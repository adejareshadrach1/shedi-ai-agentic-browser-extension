import { ProviderTypeEnum, type ProviderConfig } from '@extension/storage';

/**
 * Live model discovery.
 *
 * Provider model catalogues change constantly (models are added and retired), so instead
 * of relying on the bundled defaults we ask each provider's own `/models` endpoint for
 * the list it will actually accept. The extension holds `<all_urls>` host permission, so
 * these cross-origin requests are allowed from the options page.
 */

export interface ModelDiscoveryResult {
  /** Model IDs the provider reports. Empty when `error` is set. */
  models: string[];
  /** Human readable failure reason, if discovery did not succeed. */
  error?: string;
}

/** Endpoints used when a provider config does not carry its own `baseUrl`. */
const DEFAULT_BASE_URLS: Partial<Record<ProviderTypeEnum, string>> = {
  [ProviderTypeEnum.OpenAI]: 'https://api.openai.com/v1',
  [ProviderTypeEnum.Anthropic]: 'https://api.anthropic.com/v1',
  [ProviderTypeEnum.Gemini]: 'https://generativelanguage.googleapis.com/v1beta',
  [ProviderTypeEnum.DeepSeek]: 'https://api.deepseek.com',
  [ProviderTypeEnum.Grok]: 'https://api.x.ai/v1',
  [ProviderTypeEnum.Groq]: 'https://api.groq.com/openai/v1',
  [ProviderTypeEnum.Cerebras]: 'https://api.cerebras.ai/v1',
  [ProviderTypeEnum.OpenRouter]: 'https://openrouter.ai/api/v1',
  [ProviderTypeEnum.Ollama]: 'http://localhost:11434',
};

const ANTHROPIC_VERSION = '2023-06-01';

/**
 * Models that cannot drive the agent (embeddings, speech, image/video generation,
 * moderation, safety classifiers, realtime/live audio, ...).
 */
const NON_CHAT_MODEL_PATTERNS: RegExp[] = [
  /embed/i,
  /tts/i,
  /whisper/i,
  /transcri/i,
  /dall-e/i,
  /image/i,
  /imagen/i,
  /moderation/i,
  /audio/i,
  /realtime/i,
  /sora/i,
  /veo/i,
  /lyria/i,
  /guard/i,
  /rerank/i,
  /robotics/i,
  /computer-use/i,
  /deep-research/i,
  /-live/i,
  /search/i,
  /-clip/i,
  /omni/i,
  /nano-banana/i,
  /-trace/i,
];

/** Hard ceiling so a provider with hundreds of models can't blow up the settings UI. */
const MAX_MODELS_PER_PROVIDER = 60;

function isChatCapableModel(modelId: string, providerType: ProviderTypeEnum): boolean {
  // Claude and local Ollama catalogues are small and already text-focused.
  if (providerType === ProviderTypeEnum.Anthropic || providerType === ProviderTypeEnum.Ollama) {
    return true;
  }
  return !NON_CHAT_MODEL_PATTERNS.some(pattern => pattern.test(modelId));
}

type JsonResponse = { ok: true; data: unknown } | { ok: false; error: string };

/** Keep a dead endpoint (e.g. a stopped local Ollama) from hanging the settings page. */
const REQUEST_TIMEOUT_MS = 15000;

async function requestJson(url: string, init?: RequestInit): Promise<JsonResponse> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  try {
    const response = await fetch(url, { ...init, signal: controller.signal });
    const raw = await response.text();

    let parsed: unknown;
    try {
      parsed = raw ? JSON.parse(raw) : undefined;
    } catch {
      parsed = undefined;
    }

    if (!response.ok) {
      const body = parsed as { error?: { message?: string }; message?: string } | undefined;
      return {
        ok: false,
        error: body?.error?.message || body?.message || `HTTP ${response.status}`.trim(),
      };
    }

    return { ok: true, data: parsed };
  } catch (error) {
    // Network / CORS / offline / timeout failures land here.
    if (error instanceof DOMException && error.name === 'AbortError') {
      return { ok: false, error: `The request timed out after ${REQUEST_TIMEOUT_MS / 1000}s.` };
    }
    return { ok: false, error: error instanceof Error ? error.message : String(error) };
  } finally {
    clearTimeout(timeoutId);
  }
}

/** OpenAI-compatible `GET /models` → `{ data: [{ id }] }` */
function parseOpenAiStyleModels(data: unknown): string[] {
  const list = (data as { data?: Array<{ id?: string }> } | undefined)?.data;
  if (!Array.isArray(list)) return [];
  return list.map(item => item?.id).filter((id): id is string => Boolean(id && id.trim()));
}

function buildBaseUrl(providerType: ProviderTypeEnum, config: ProviderConfig): string {
  const configured = config.baseUrl?.trim();
  const base = configured || DEFAULT_BASE_URLS[providerType] || '';
  return base.replace(/\/+$/, '');
}

/**
 * Ask the provider for its current model list.
 *
 * Never throws: failures come back as `{ models: [], error }` so the caller can surface
 * them next to the button that triggered the refresh.
 */
export async function discoverModels(providerId: string, config: ProviderConfig): Promise<ModelDiscoveryResult> {
  const providerType = (config.type ?? providerId) as ProviderTypeEnum;
  const apiKey = config.apiKey?.trim() ?? '';
  const baseUrl = buildBaseUrl(providerType, config);

  if (providerType === ProviderTypeEnum.AzureOpenAI) {
    return { models: [], error: 'Azure uses deployment names, which cannot be listed automatically.' };
  }

  if (!baseUrl) {
    return { models: [], error: 'A base URL is required before models can be refreshed.' };
  }

  // ---- Google Gemini: GET {base}/models?key=... --------------------------------
  if (providerType === ProviderTypeEnum.Gemini) {
    if (!apiKey) return { models: [], error: 'An API key is required to list Gemini models.' };

    const response = await requestJson(
      `${baseUrl}/models?key=${encodeURIComponent(apiKey)}&pageSize=200`,
      { method: 'GET' },
    );
    if (!response.ok) return { models: [], error: response.error };

    const entries =
      (response.data as { models?: Array<{ name?: string; supportedGenerationMethods?: string[] }> } | undefined)
        ?.models ?? [];

    const generateContent = entries.filter(
      entry => !entry.supportedGenerationMethods || entry.supportedGenerationMethods.includes('generateContent'),
    );
    const pool = generateContent.length > 0 ? generateContent : entries;

    const models = pool
      .map(entry => entry.name?.replace(/^models\//, '').trim())
      .filter((name): name is string => Boolean(name))
      .filter(name => isChatCapableModel(name, providerType));

    return models.length > 0 ? { models } : { models: [], error: 'Gemini returned no usable chat models.' };
  }

  // ---- Anthropic: GET {base}/models --------------------------------------------
  if (providerType === ProviderTypeEnum.Anthropic) {
    if (!apiKey) return { models: [], error: 'An API key is required to list Claude models.' };

    const response = await requestJson(`${baseUrl}/models?limit=1000`, {
      method: 'GET',
      headers: {
        'x-api-key': apiKey,
        'anthropic-version': ANTHROPIC_VERSION,
        // Required for browser-originated requests from an extension page.
        'anthropic-dangerous-direct-browser-access': 'true',
      },
    });
    if (!response.ok) return { models: [], error: response.error };

    const models = parseOpenAiStyleModels(response.data).filter(name => isChatCapableModel(name, providerType));
    return models.length > 0 ? { models } : { models: [], error: 'Anthropic returned no models.' };
  }

  // ---- Ollama: GET {base}/api/tags --------------------------------------------
  if (providerType === ProviderTypeEnum.Ollama) {
    const response = await requestJson(`${baseUrl}/api/tags`, { method: 'GET' });
    if (!response.ok) return { models: [], error: response.error };

    const models = (
      (response.data as { models?: Array<{ name?: string }> } | undefined)?.models ?? []
    )
      .map(entry => entry.name?.trim())
      .filter((name): name is string => Boolean(name));

    return models.length > 0 ? { models } : { models: [], error: 'Ollama returned no local models.' };
  }

  // ---- Everything else speaks the OpenAI-compatible /models shape -------------
  const headers: Record<string, string> = {};
  if (apiKey) headers.Authorization = `Bearer ${apiKey}`;
  // OpenRouter recommends these for attribution; harmless elsewhere.
  if (providerType === ProviderTypeEnum.OpenRouter) {
    headers['HTTP-Referer'] = 'https://shedi.ai';
    headers['X-Title'] = 'Shedi AI';
  }

  if (!apiKey && providerType !== ProviderTypeEnum.CustomOpenAI) {
    return { models: [], error: 'An API key is required to list models.' };
  }

  const response = await requestJson(`${baseUrl}/models`, { method: 'GET', headers });
  if (!response.ok) return { models: [], error: response.error };

  const models = parseOpenAiStyleModels(response.data).filter(name => isChatCapableModel(name, providerType));
  return models.length > 0 ? { models } : { models: [], error: 'The provider returned no usable chat models.' };
}

/**
 * Merge freshly discovered models into the existing list.
 *
 * Existing entries keep their position so the user's picks don't jump around, and new
 * models are appended. The result is capped to keep the settings UI manageable.
 */
export function mergeModelNames(existing: string[], discovered: string[]): string[] {
  const seen = new Set<string>();
  const merged: string[] = [];

  for (const candidate of [...existing, ...discovered]) {
    const model = candidate?.trim();
    if (!model || seen.has(model)) continue;
    seen.add(model);
    merged.push(model);
    if (merged.length >= MAX_MODELS_PER_PROVIDER) break;
  }

  return merged;
}
