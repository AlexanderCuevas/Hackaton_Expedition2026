import type { QueryAiResponse } from './types';

const BASE = import.meta.env.VITE_API_URL || '';

async function requestJson(path: string, init?: RequestInit) {
  const url = BASE + path;
  const res = await fetch(url, init);
  const json = await res.json().catch(() => ({}));
  if (!res.ok) {
    const err = (json && (json.error || json.message)) || `Request failed ${res.status}`;
    throw new Error(err);
  }
  return json;
}

export async function queryAi(
  prompt: string,
  options?: { model?: string; max_tokens?: number; max_words?: number; cvId?: string }
): Promise<QueryAiResponse> {
  const body: any = { prompt };
  if (options?.model) body.model = options.model;
  if (options?.max_tokens) body.max_tokens = options.max_tokens;
  if (options?.max_words) body.max_words = options.max_words;
  if (options?.cvId) body.cvId = options.cvId;

  return requestJson('/api-ai/query', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  });
}
