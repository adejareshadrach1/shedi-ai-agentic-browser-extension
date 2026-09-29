// Agent name, used to identify the agent in the settings
export enum AgentNameEnum {
  Planner = 'planner',
  Navigator = 'navigator',
}

// Provider type, types before CustomOpenAI are built-in providers, CustomOpenAI is a custom provider
// For built-in providers, we will create ChatModel instances with its respective LangChain ChatModel classes
// For custom providers, we will create ChatModel instances with the ChatOpenAI class
export enum ProviderTypeEnum {
  OpenAI = 'openai',
  Anthropic = 'anthropic',
  DeepSeek = 'deepseek',
  Gemini = 'gemini',
  Grok = 'grok',
  Ollama = 'ollama',
  AzureOpenAI = 'azure_openai',
  OpenRouter = 'openrouter',
  Groq = 'groq',
  Cerebras = 'cerebras',
  Llama = 'llama',
  CustomOpenAI = 'custom_openai',
}

// Default supported models for each built-in provider.
//
// These lists are only a starting point: the Models settings page can refresh them
// straight from each provider's own /models endpoint (see the "Update" actions), which
// is the reliable way to pick up newly released and retired models.
// Last reviewed: September 2026.
export const llmProviderModelNames = {
  [ProviderTypeEnum.OpenAI]: [
    'gpt-6-astra',
    'gpt-6-sol',
    'gpt-6-luna',
    'gpt-5.2',
    'gpt-5.1',
    'gpt-5-mini',
    'gpt-4.1',
    'gpt-4o',
  ],
  [ProviderTypeEnum.Anthropic]: [
    'claude-opus-5-5',
    'claude-sonnet-5-5',
    'claude-fable-5-1',
    'claude-haiku-4-5',
  ],
  [ProviderTypeEnum.DeepSeek]: ['deepseek-flash', 'deepseek-pro', 'deepseek-chat', 'deepseek-reasoner'],
  [ProviderTypeEnum.Gemini]: [
    'gemini-3.8-flash',
    'gemini-3.7-flash',
    'gemini-3.5-flash-lite',
    'gemini-3.1-pro-preview',
    'gemini-3-flash-preview',
    'gemini-3.1-flash-lite',
  ],
  [ProviderTypeEnum.Grok]: ['grok-4.7', 'grok-4.6', 'grok-4.5', 'grok-4.3', 'grok-4.1-fast'],
  [ProviderTypeEnum.Ollama]: ['qwen3:14b', 'falcon3:10b', 'qwen2.5-coder:14b', 'mistral-small:24b'],
  [ProviderTypeEnum.AzureOpenAI]: ['gpt-6-astra', 'gpt-6-sol', 'gpt-5.2', 'gpt-5.1', 'gpt-4.1'],
  [ProviderTypeEnum.OpenRouter]: [
    'google/gemini-3.1-pro-preview',
    'anthropic/claude-opus-5-5',
    'openai/gpt-6-sol',
    'deepseek/deepseek-flash',
    'meta-llama/llama-4-maverick',
  ],
  [ProviderTypeEnum.Groq]: ['llama-3.3-70b-versatile', 'openai/gpt-oss-120b', 'qwen/qwen3-32b'],
  [ProviderTypeEnum.Cerebras]: ['llama-3.3-70b', 'qwen-3-32b'],
  [ProviderTypeEnum.Llama]: [
    'Llama-3.3-70B-Instruct',
    'Llama-3.3-8B-Instruct',
    'Llama-4-Maverick-17B-128E-Instruct-FP8',
    'Llama-4-Scout-17B-16E-Instruct-FP8',
  ],
  // Custom OpenAI providers don't have predefined models as they are user-defined
};

//
// Model IDs that are retired or blocked for new accounts. Keeping them in a stored
// provider configuration causes hard 404s at task time (for example Google now returns
// 404 for `gemini-2.5-pro` on new keys), so they are dropped whenever a provider
// configuration is read.
//
export const retiredModelNames: Partial<Record<ProviderTypeEnum, string[]>> = {
  [ProviderTypeEnum.Gemini]: [
    'gemini-3-pro-preview',
    'gemini-2.5-pro',
    'gemini-2.5-flash-lite',
    'gemini-2.0-flash',
    'gemini-2.0-flash-lite',
    'gemini-1.5-pro',
    'gemini-1.5-flash',
  ],
  [ProviderTypeEnum.OpenAI]: ['gpt-4-turbo', 'gpt-4', 'gpt-3.5-turbo'],
  [ProviderTypeEnum.Anthropic]: ['claude-opus-4-1', 'claude-sonnet-4', 'claude-3-5-sonnet'],
  [ProviderTypeEnum.Grok]: ['grok-3', 'grok-3-fast', 'grok-2'],
};

// Default parameters for each agent per provider, for providers not specified, use OpenAI parameters
export const llmProviderParameters = {
  [ProviderTypeEnum.OpenAI]: {
    [AgentNameEnum.Planner]: {
      temperature: 0.7,
      topP: 0.9,
    },
    [AgentNameEnum.Navigator]: {
      temperature: 0.3,
      topP: 0.85,
    },
  },
  [ProviderTypeEnum.Anthropic]: {
    [AgentNameEnum.Planner]: {
      temperature: 0.3,
      topP: 0.6,
    },
    [AgentNameEnum.Navigator]: {
      temperature: 0.2,
      topP: 0.5,
    },
  },
  [ProviderTypeEnum.Gemini]: {
    [AgentNameEnum.Planner]: {
      temperature: 0.7,
      topP: 0.9,
    },
    [AgentNameEnum.Navigator]: {
      temperature: 0.3,
      topP: 0.85,
    },
  },
  [ProviderTypeEnum.Grok]: {
    [AgentNameEnum.Planner]: {
      temperature: 0.7,
      topP: 0.9,
    },
    [AgentNameEnum.Navigator]: {
      temperature: 0.3,
      topP: 0.85,
    },
  },
  [ProviderTypeEnum.Ollama]: {
    [AgentNameEnum.Planner]: {
      temperature: 0.3,
      topP: 0.9,
    },
    [AgentNameEnum.Navigator]: {
      temperature: 0.1,
      topP: 0.85,
    },
  },
  [ProviderTypeEnum.AzureOpenAI]: {
    [AgentNameEnum.Planner]: {
      temperature: 0.7,
      topP: 0.9,
    },
    [AgentNameEnum.Navigator]: {
      temperature: 0.3,
      topP: 0.85,
    },
  },
  [ProviderTypeEnum.OpenRouter]: {
    [AgentNameEnum.Planner]: {
      temperature: 0.7,
      topP: 0.9,
    },
    [AgentNameEnum.Navigator]: {
      temperature: 0.3,
      topP: 0.85,
    },
  },
  [ProviderTypeEnum.Groq]: {
    [AgentNameEnum.Planner]: {
      temperature: 0.7,
      topP: 0.9,
    },
    [AgentNameEnum.Navigator]: {
      temperature: 0.3,
      topP: 0.85,
    },
  },
  [ProviderTypeEnum.Cerebras]: {
    [AgentNameEnum.Planner]: {
      temperature: 0.7,
      topP: 0.9,
    },
    [AgentNameEnum.Navigator]: {
      temperature: 0.3,
      topP: 0.85,
    },
  },
  [ProviderTypeEnum.Llama]: {
    [AgentNameEnum.Planner]: {
      temperature: 0.7,
      topP: 0.9,
    },
    [AgentNameEnum.Navigator]: {
      temperature: 0.3,
      topP: 0.85,
    },
  },
};

//
// Display labels (e.g. "OpenAI GPT‑4 (hosted)") sometimes end up in storage as a
// model name. They are pretty-printed names shown in UI dropdowns, NOT API model IDs,
// and providers answer every request for one with a hard 404 `model_not_found`.
// These helpers let storage keep such values out of configurations.
//

/** Characters that never appear in real provider model IDs. */
const DISPLAY_LABEL_INDICATORS = /[\u00A0\u1680\u2000-\u200B\u2010-\u2015\u2019\u201C\u201D\u202F\u3000()]/;

/**
 * Heuristic check for whether a string looks like a real API model ID rather than a
 * display label. Real IDs (gpt-4o, gemini-2.5-flash, anthropic/claude-4-opus) use
 * lowercase ASCII letters, digits, dots, dashes, underscores and slashes, and never
 * contain whitespace or parentheses.
 */
export function isLikelyModelId(value: string): boolean {
  const trimmed = value.trim();
  if (!trimmed) return false;
  if (DISPLAY_LABEL_INDICATORS.test(trimmed)) return false;
  if (/\s/.test(trimmed)) return false;
  return /^[A-Za-z0-9._/@:+-]+$/.test(trimmed);
}

/**
 * Best-effort mapping of a display label back to a model ID: normalize pretty
 * punctuation (unicode hyphens/quotes/spaces, parentheses) and match it against the
 * candidate IDs. Returns the matched ID, or undefined when nothing matches.
 */
export function findModelIdFromDisplayName(displayName: string, candidateModelIds: string[]): string | undefined {
  // Treat unicode punctuation, separators and the dashes/underscores used inside real
  // IDs as equivalent spaces, so "GPT‑4o" and "gpt_4o" both match "gpt-4o".
  const normalize = (value: string) =>
    value
      .toLowerCase()
      .replace(/[\u00A0\u1680\u2000-\u200B\u2010-\u2015\u202F\u3000]/g, ' ')
      .replace(/[\u2018\u2019\u201B]/g, "'")
      .replace(/[\u201C\u201D\u201F]/g, '"')
      .replace(/[()]/g, ' ')
      .replace(/[-_]+/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();

  const target = normalize(displayName);
  if (!target) return undefined;

  // Exact (normalized) match first...
  for (const candidate of candidateModelIds) {
    if (normalize(candidate) === target) return candidate;
  }
  // ...then the longest candidate contained in (or containing) the label.
  let best: { candidate: string; length: number } | undefined;
  for (const candidate of candidateModelIds) {
    const normalized = normalize(candidate);
    if (!normalized) continue;
    if (target.includes(normalized) || normalized.includes(target)) {
      if (!best || normalized.length > best.length) {
        best = { candidate, length: normalized.length };
      }
    }
  }
  return best?.candidate;
}
