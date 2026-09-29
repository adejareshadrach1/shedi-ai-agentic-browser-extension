import { describe, it, expect, vi, beforeAll } from 'vitest';
import {
  isLikelyModelId,
  findModelIdFromDisplayName,
  AgentNameEnum,
  ProviderTypeEnum,
  llmProviderModelNames,
} from '../lib';
import type { AgentModelStorage } from '../lib';

describe('isLikelyModelId', () => {
  it('accepts real provider model IDs', () => {
    expect(isLikelyModelId('gpt-4o')).toBe(true);
    expect(isLikelyModelId('gemini-2.5-flash')).toBe(true);
    expect(isLikelyModelId('openai/gpt-6-sol')).toBe(true);
    expect(isLikelyModelId('qwen3:14b')).toBe(true);
    expect(isLikelyModelId('Llama-3.3-70B-Instruct')).toBe(true);
    expect(isLikelyModelId('claude-sonnet-4-5')).toBe(true);
  });

  it('rejects display labels and empty values', () => {
    expect(isLikelyModelId('OpenAI GPT\u20114 (hosted)')).toBe(false);
    expect(isLikelyModelId('OpenAI GPT-4 (hosted)')).toBe(false);
    expect(isLikelyModelId('Azure OpenAI 2')).toBe(false);
    expect(isLikelyModelId('Custom Provider')).toBe(false);
    expect(isLikelyModelId('  ')).toBe(false);
    expect(isLikelyModelId('')).toBe(false);
  });

  it('treats unicode punctuation in labels as invalid', () => {
    expect(isLikelyModelId('GPT\u20114')).toBe(false); // non-breaking hyphen
    expect(isLikelyModelId('Claude\u2019s pick')).toBe(false); // curly apostrophe
  });
});

describe('findModelIdFromDisplayName', () => {
  const openai = llmProviderModelNames[ProviderTypeEnum.OpenAI];
  const anthropic = llmProviderModelNames[ProviderTypeEnum.Anthropic];

  it('maps a provider label containing a version to the real model ID', () => {
    // U+2011 non-breaking hyphen in the label, ASCII hyphen in the real ID.
    expect(findModelIdFromDisplayName('OpenAI GPT\u20114o (hosted)', openai)).toBe('gpt-4o');
    expect(findModelIdFromDisplayName('Claude Sonnet 5 5', anthropic)).toBe('claude-sonnet-5-5');
  });

  it('returns undefined when no candidate matches', () => {
    expect(findModelIdFromDisplayName('Totally Unknown Model (hosted)', openai)).toBeUndefined();
  });
});

describe('agentModelStore', () => {
  let agentModelStore: AgentModelStorage;

  beforeAll(async () => {
    // base.ts captures globalThis.chrome at module load, so the stub must be installed
    // before the storage module is evaluated (hence resetModules + dynamic import).
    const data = new Map<string, unknown>();
    vi.stubGlobal('chrome', {
      storage: {
        local: {
          get: vi.fn(async (keys: string[]) => {
            const out: Record<string, unknown> = {};
            for (const key of keys) {
              if (data.has(key)) out[key] = data.get(key);
            }
            return out;
          }),
          set: vi.fn(async (items: Record<string, unknown>) => {
            for (const [key, value] of Object.entries(items)) data.set(key, value);
          }),
          onChanged: {
            addListener: vi.fn(),
          },
        },
        session: {},
      },
      runtime: {},
    });

    vi.resetModules();
    ({ agentModelStore } = await import('../lib'));
  });

  it('rejects display-label model names on write', async () => {
    await expect(
      agentModelStore.setAgentModel(AgentNameEnum.Planner, {
        provider: ProviderTypeEnum.OpenAI,
        modelName: 'OpenAI GPT\u20114 (hosted)',
      }),
    ).rejects.toThrow(/display name/i);
  });

  it('heals a stored display label on read, mapping it to a known model ID', async () => {
    await agentModelStore.setAgentModel(AgentNameEnum.Planner, {
      provider: ProviderTypeEnum.OpenAI,
      modelName: 'gpt-4o',
    });
    // Corrupt storage directly, bypassing the write guard, like a legacy import would.
    await agentModelStore.set({
      agents: {
        planner: { provider: 'openai', modelName: 'OpenAI GPT\u20114o (hosted)' },
      },
    });
    const config = await agentModelStore.getAgentModel(AgentNameEnum.Planner);
    expect(config?.modelName).toBe('gpt-4o');
  });

  it('falls back to the provider default when a label cannot be mapped', async () => {
    await agentModelStore.set({
      agents: {
        navigator: { provider: 'openai', modelName: 'Something Weird (hosted)' },
      },
    });
    const config = await agentModelStore.getAgentModel(AgentNameEnum.Navigator);
    expect(config?.modelName).toBe(llmProviderModelNames[ProviderTypeEnum.OpenAI][0]);
  });

  it('allows space-containing Azure deployment names on write', async () => {
    await expect(
      agentModelStore.setAgentModel(AgentNameEnum.Planner, {
        provider: ProviderTypeEnum.AzureOpenAI,
        modelName: 'My GPT 4o Deployment',
      }),
    ).resolves.toBeUndefined();
  });

  it('leaves Azure deployment names untouched when reading', async () => {
    await agentModelStore.set({
      agents: {
        planner: { provider: 'azure_openai', modelName: 'My GPT 4o Deployment' },
      },
    });
    const config = await agentModelStore.getAgentModel(AgentNameEnum.Planner);
    expect(config?.modelName).toBe('My GPT 4o Deployment');
  });
});
