import { StorageEnum } from '../base/enums';
import { createStorage } from '../base/base';
import type { BaseStorage } from '../base/types';
import {
  AgentNameEnum,
  llmProviderModelNames,
  llmProviderParameters,
  ProviderTypeEnum,
  retiredModelNames,
  findModelIdFromDisplayName,
  isLikelyModelId,
} from './types';

// Interface for a single model configuration
export interface ModelConfig {
  // providerId, the key of the provider in the llmProviderStore, not the provider name
  provider: string;
  modelName: string;
  parameters?: Record<string, unknown>;
  reasoningEffort?: 'minimal' | 'low' | 'medium' | 'high'; // For o-series models (OpenAI and Azure)
}

// Interface for storing multiple agent model configurations
export interface AgentModelRecord {
  agents: Record<AgentNameEnum, ModelConfig>;
}

export type AgentModelStorage = BaseStorage<AgentModelRecord> & {
  setAgentModel: (agent: AgentNameEnum, config: ModelConfig) => Promise<void>;
  getAgentModel: (agent: AgentNameEnum) => Promise<ModelConfig | undefined>;
  resetAgentModel: (agent: AgentNameEnum) => Promise<void>;
  hasAgentModel: (agent: AgentNameEnum) => Promise<boolean>;
  getConfiguredAgents: () => Promise<AgentNameEnum[]>;
  getAllAgentModels: () => Promise<Record<AgentNameEnum, ModelConfig>>;
  cleanupLegacyValidatorSettings: () => Promise<void>;
};

const storage = createStorage<AgentModelRecord>(
  'agent-models',
  { agents: {} as Record<AgentNameEnum, ModelConfig> },
  {
    storageEnum: StorageEnum.Local,
    liveUpdate: true,
  },
);

function validateModelConfig(config: ModelConfig) {
  if (!config.provider || !config.modelName) {
    throw new Error('Provider and model name must be specified');
  }
}

function getModelParameters(agent: AgentNameEnum, provider: string): Record<string, unknown> {
  const providerParams = llmProviderParameters[provider as keyof typeof llmProviderParameters]?.[agent];
  return providerParams ?? { temperature: 0.1, topP: 0.1 };
}

/** Azure providers (azure_openai, azure_openai_2, ...) use deployment names, not model IDs. */
function isAzureProviderId(provider: string): boolean {
  return provider === ProviderTypeEnum.AzureOpenAI || provider.startsWith(`${ProviderTypeEnum.AzureOpenAI}_`);
}

/**
 * If the selected model has been retired by the provider, fall back to the current
 * default for that provider. Without this a stored selection such as `gemini-2.5-pro`
 * keeps failing every task with a 404.
 */
function migrateModelConfig(config: ModelConfig): ModelConfig {
  const healed = migrateInvalidModelName(config);
  const retired = retiredModelNames[healed.provider as ProviderTypeEnum] ?? [];
  if (!retired.includes(healed.modelName)) return healed;

  const defaults = llmProviderModelNames[healed.provider as keyof typeof llmProviderModelNames] ?? [];
  const replacement = defaults[0];
  if (!replacement) return healed;

  console.warn(
    `[agentModels] Model "${healed.modelName}" is no longer available for ${healed.provider}; using "${replacement}" instead`,
  );
  return { ...healed, modelName: replacement };
}

/**
 * Repair a stored selection that holds a display label (e.g. "OpenAI GPT‑4 (hosted)")
 * instead of an API model ID. Labels reach storage through older exports/imports and
 * third-party UI tweaks; sending one to the provider fails every call with 404
 * `model_not_found`. On read, map the label back to a known model ID for the provider,
 * or fall back to the provider's first default model.
 */
function migrateInvalidModelName(config: ModelConfig): ModelConfig {
  // Azure model names are user-defined deployment names and may contain spaces.
  if (isAzureProviderId(config.provider) || isLikelyModelId(config.modelName)) return config;

  const defaults = llmProviderModelNames[config.provider as keyof typeof llmProviderModelNames] ?? [];
  const mapped = findModelIdFromDisplayName(config.modelName, defaults);
  const replacement = mapped ?? defaults[0];
  if (!replacement) return config;

  console.warn(
    `[agentModels] Stored model name "${config.modelName}" is not a valid model ID for ${config.provider}; using "${replacement}" instead`,
  );
  return { ...config, modelName: replacement };
}

export const agentModelStore: AgentModelStorage = {
  ...storage,
  setAgentModel: async (agent: AgentNameEnum, config: ModelConfig) => {
    validateModelConfig(config);
    // A display label here would 404 on every API call, so reject it up front.
    // Azure is exempt: its model name is a user-defined deployment name.
    if (!isAzureProviderId(config.provider) && !isLikelyModelId(config.modelName)) {
      throw new Error(
        `"${config.modelName}" is a display name, not a model ID. Pick a model such as "gpt-4o" or "gemini-2.5-flash".`,
      );
    }
    // Merge default parameters with provided parameters
    const defaultParams = getModelParameters(agent, config.provider);
    const mergedConfig = {
      ...config,
      parameters: {
        ...defaultParams,
        ...config.parameters,
      },
    };
    await storage.set(current => ({
      agents: {
        ...current.agents,
        [agent]: mergedConfig,
      },
    }));
  },
  getAgentModel: async (agent: AgentNameEnum) => {
    const data = await storage.get();
    const config = data.agents[agent];
    if (!config) return undefined;

    // Merge default parameters with stored parameters
    const defaultParams = getModelParameters(agent, config.provider);
    const migrated = migrateModelConfig(config);
    return {
      ...migrated,
      parameters: {
        ...defaultParams,
        ...config.parameters,
      },
    };
  },
  resetAgentModel: async (agent: AgentNameEnum) => {
    await storage.set(current => {
      const newAgents = { ...current.agents };
      delete newAgents[agent];
      return { agents: newAgents };
    });
  },
  hasAgentModel: async (agent: AgentNameEnum) => {
    const data = await storage.get();
    return agent in data.agents;
  },
  getConfiguredAgents: async () => {
    const data = await storage.get();
    // Filter out any legacy validator entries for backward compatibility
    return Object.keys(data.agents).filter(
      agentKey => agentKey !== 'validator' && Object.values(AgentNameEnum).includes(agentKey as AgentNameEnum),
    ) as AgentNameEnum[];
  },
  getAllAgentModels: async () => {
    const data = await storage.get();
    // Filter out any legacy validator entries for backward compatibility
    const filteredAgents: Partial<Record<AgentNameEnum, ModelConfig>> = {};
    for (const [agentKey, config] of Object.entries(data.agents)) {
      if (agentKey !== 'validator' && Object.values(AgentNameEnum).includes(agentKey as AgentNameEnum)) {
        filteredAgents[agentKey as AgentNameEnum] = migrateModelConfig(config);
      }
    }
    return filteredAgents as Record<AgentNameEnum, ModelConfig>;
  },
  cleanupLegacyValidatorSettings: async () => {
    await storage.set(current => {
      const newAgents = { ...current.agents };
      delete newAgents['validator' as keyof typeof newAgents];
      return { agents: newAgents };
    });
  },
};
