# Integración Frontend ↔ Backend — SkillPath AI

> Documentación de la capa de comunicación entre el frontend React (SkillPath AI)
> y el backend Node.js (BackendNodeJS-Hackaton) para las funcionalidades de IA.

---

## Arquitectura

```
┌─────────────────────────────┐       HTTP/JSON       ┌──────────────────────────────┐
│  Frontend (SkillPath AI)    │ ──────────────────→   │  Backend (Railway)           │
│                             │ ←──────────────────   │                              │
│  src/api/                   │                       │  /api-ai/*                   │
│    client.ts                │                       │  /whatsapp/*                 │
│    ai.ts                    │                       │                              │
│    cv.ts                    │                       │                              │
│    whatsapp.ts              │                       │                              │
│    types.ts                 │                       │                              │
└─────────────────────────────┘                       └──────────────────────────────┘
```

## Capa de comunicación (`src/api/`)

### `client.ts` — HTTP client base

```typescript
import { apiFetch, apiUrl } from "../api";
```

- Base URL configurable via `VITE_AI_API_BASE_URL` (default: `https://backendnodejs-hackaton-production.up.railway.app`)
- `apiFetch<T>(path, options?)` — wrapper genérico con tipado fuerte
- Maneja errores con `ApiError` (status, code, message)
- Headers automáticos: `Content-Type: application/json` y `Accept: application/json`
- Soporta `FormData` (para upload de CV) sin sobrescribir Content-Type

### `types.ts` — DTOs del backend

Todos los tipos reflejan exactamente la respuesta del backend:

| Tipo | Endpoint | Uso |
|------|----------|-----|
| `AiQueryRequest` / `AiQueryResponse` | `POST /api-ai/query` | Chat mentor IA |
| `CvTextRequest` / `CvTextResponse` | `POST /api-ai/cv/text` | Analizar CV desde texto |
| `CvDetailResponse` | `GET /api-ai/cv/:cvId` | Obtener análisis por ID |
| `CvListResponse` | `GET /api-ai/cv` | Listar CVs |
| `WhatsAppSendRequest` / `WhatsAppSendResponse` | `POST /whatsapp/send` | Enviar WhatsApp |
| `WhatsAppConfigResponse` | `GET /whatsapp/config` | Verificar configuración |

### `ai.ts` — Servicio de IA

```typescript
import { queryAi } from "../api";

const respuesta = await queryAi("¿Qué habilidades debería reforzar?", {
  cvId: "uuid-del-cv",
  maxWords: 300,
});
```

### `cv.ts` — Servicio de CV

```typescript
import { analyzeCvText, getCvAnalysis, listCvs } from "../api";

// Enviar CV como texto
const { cvId, context } = await analyzeCvText(textoDelCv, {
  targetRole: "Backend Developer",
  studentId: "alumno123",
});

// Recuperar análisis posteriormente
const { context } = await getCvAnalysis(cvId);

// Listar CVs de un estudiante
const { cvs } = await listCvs("alumno123");
```

### `whatsapp.ts` — Servicio de WhatsApp

```typescript
import { sendWhatsAppMessage, getWhatsAppConfig } from "../api";

// Verificar configuración
const config = await getWhatsAppConfig();

// Enviar mensaje de texto
await sendWhatsAppMessage({
  to: "51912077181",
  type: "text",
  text: "¡Hola! Tu CV ha sido analizado.",
});

// Enviar plantilla
await sendWhatsAppMessage({
  to: "51912077181",
  type: "template",
  templateName: "hello_world",
  languageCode: "en_US",
});
```

---

## Flujo de datos

### Flujo principal: Diagnóstico → Análisis → WhatsApp

```
DiagnosticoWizard
  │
  ├── Completa el formulario (CV, habilidades, etc.)
  ├── Genera CV en texto plano (formato Harvard)
  ├── Llama a POST /api-ai/cv/text  ←  ENVÍA AL BACKEND
  │     └── Guarda cvId en localStorage ("sp_cv_id")
  │
  ▼
App.tsx recibe el cvId y navega a "cvanalyzer"
  │
  ▼
CvAnalyzerPanel
  │
  ├── Si hay cvId → GET /api-ai/cv/:cvId  ←  OBTIENE ANÁLISIS REAL
  │     └── Muestra score, fortalezas, keywords, etc.
  │
  ├── Si no hay cvId → botón "Analizar con IA"
  │     └── Llama a POST /api-ai/cv/text
  │
  └── Fallback: datos simulados (mock) si el backend no responde
  │
  ▼
WhatsAppPreview
  │
  ├── GET /whatsapp/config  ←  VERIFICA CONFIGURACIÓN
  ├── Muestra badge de estado (conectado / simulación)
  └── POST /whatsapp/send  ←  ENVÍA NOTIFICACIÓN REAL
```

---

## Endpoints consumidos

| Método | Ruta | Request | Response | Componente |
|--------|------|---------|----------|------------|
| `POST` | `/api-ai/cv/text` | `{ cvText, targetRole?, studentId?, fileName? }` | `{ ok, cvId, context }` | DiagnosticoWizard, CvAnalyzerPanel |
| `GET` | `/api-ai/cv/:cvId` | — | `{ ok, context }` | CvAnalyzerPanel |
| `GET` | `/api-ai/cv` | `?studentId=` | `{ ok, cvs[] }` | (futuro) |
| `POST` | `/api-ai/query` | `{ prompt, cvId?, max_words? }` | `{ text }` | (futuro: mentor chat) |
| `GET` | `/whatsapp/config` | — | `{ ok, configured, hasToken, ... }` | WhatsAppPreview |
| `POST` | `/whatsapp/send` | `{ to, type, text?/templateName? }` | `{ ok, payload, whatsappResponse }` | WhatsAppPreview |

---

## Manejo de errores

El frontend captura errores del backend y muestra fallbacks locales:

```typescript
try {
  const res = await analyzeCvText(text);
} catch (err) {
  if (err instanceof ApiError) {
    // err.status → HTTP status
    // err.code  → "missing_text", "error_processing_cv", etc.
    // err.message → descripción legible
  }
  // Fallback a datos mock
}
```

### Códigos de error esperados

| Código | HTTP | Causa |
|--------|:----:|-------|
| `missing prompt` | 400 | No se envió prompt a `/api-ai/query` |
| `missing_file` | 400 | No se adjuntó archivo en upload |
| `unsupported_file_type` | 415 | Formato no soportado (solo PDF, DOCX, TXT) |
| `missing_text` | 400 | No se envió texto a `/api-ai/cv/text` |
| `cv_not_found` | 404 | El cvId no existe |
| `error_processing_cv` | 500 | Error al analizar CV |
| `missing_whatsapp_configuration` | 500 | WhatsApp no configurado |
| `missing_to` / `missing_type` | 400 | Faltan campos requeridos |

---

## Variables de entorno

| Variable | Obligatoria | Default | Descripción |
|----------|:-----------:|---------|-------------|
| `VITE_AI_API_BASE_URL` | No | `https://backendnodejs-hackaton-production.up.railway.app` | URL base del backend de IA |

---

## Notas importantes

1. **Persistencia**: El backend almacena CVs en memoria RAM (volátil). El frontend guarda `cvId` en localStorage (`sp_cv_id`) para poder recuperar análisis mientras el servidor esté corriendo.

2. **Fallback offline**: Todos los componentes tienen fallback a datos simulados si el backend no responde. La app funciona completa sin conexión al backend.

3. **Interview Simulator**: Las simulaciones de entrevista (`InterviewPanel`) siguen usando el servidor Express local (`server.ts`), NO el backend de Railway, ya que esos endpoints no están en el deployment.

4. **CV Upload**: El upload de archivos PDF/DOCX se hace desde el frontend. Si se necesita enviar archivos al backend, usar `FormData` con `POST /api-ai/cv/upload` (aún no implementado en UI — actualmente se envía siempre como texto).
