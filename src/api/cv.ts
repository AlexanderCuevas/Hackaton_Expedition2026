import type { CvTextResponse, CvDetailResponse } from './types';

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

export async function analyzeCvText(
  cvText: string,
  options?: { targetRole?: string; studentId?: string; fileName?: string }
): Promise<CvTextResponse> {
  const body = {
    text: cvText,
    targetRole: options?.targetRole,
    studentId: options?.studentId,
    fileName: options?.fileName || 'cv-text.txt'
  };

  return requestJson('/api-ai/cv/text', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  });
}

export async function analyzeCvFile(
  file: File,
  options?: { targetRole?: string; studentId?: string }
): Promise<CvTextResponse> {
  const fd = new FormData();
  fd.append('file', file);
  if (options?.targetRole) fd.append('targetRole', options.targetRole);
  if (options?.studentId) fd.append('studentId', options.studentId);

  return requestJson('/api-ai/cv/upload', {
    method: 'POST',
    body: fd
  });
}

export async function getCvById(cvId: string): Promise<CvDetailResponse> {
  const safe = encodeURIComponent(cvId);
  return requestJson(`/api-ai/cv/${safe}`, { method: 'GET' });
}

export async function listCvs(studentId?: string) {
  const q = studentId ? `?studentId=${encodeURIComponent(studentId)}` : '';
  return requestJson(`/api-ai/cv${q}`, { method: 'GET' });
}
