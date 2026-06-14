import { apiFetch } from "./client";
import type { AiQueryRequest, AiQueryResponse } from "./types";

const MOCK_RESPONSES: [RegExp, string][] = [
  [/habilidades?|skills|competencias/i, "Para mejorar tu perfil profesional, te recomiendo enfocarte en:\n\n1. **Habilidades técnicas**: identifica las 3 tecnologías más demandadas en tu campo y busca certificarte en ellas.\n2. **Habilidades blandas**: comunicación asertiva, trabajo en equipo y resolución de problemas son las más valoradas.\n3. **Proyectos prácticos**: crea un portafolio con 2-3 proyectos que demuestren tus capacidades.\n\n¿Quieres que profundice en alguna de estas áreas?"],
  [/entrevista|preparación|simulación/i, "¡Claro! Aquí tienes una guía rápida para preparar tu entrevista:\n\n1. **Investiga la empresa**: conoce su misión, valores y productos.\n2. **Prepara tu pitch**: ten listo un resumen de 30 segundos sobre quién eres.\n3. **STAR Method**: estructura tus respuestas con Situación, Tarea, Acción y Resultado.\n4. **Preguntas frecuentes**: prepárate para 'cuéntame de ti', 'fortalezas y debilidades', 'dónde te ves en 5 años'.\n\n¿Quieres practicar con una pregunta específica?"],
  [/cv|currículum|curriculum|hoja de vida/i, "Para optimizar tu CV y pasar filtros ATS:\n\n1. **Formato simple**: usa encabezados claros, sin tablas ni columnas.\n2. **Palabras clave**: incluye términos específicos del puesto al que postulas.\n3. **Logros cuantificables**: usa números ('aumenté ventas 20%', 'gestioné equipo de 5').\n4. **Secciones clave**: experiencia, educación, habilidades, certificaciones.\n\n¿Quieres que revise alguna sección específica de tu CV?"],
  [/certificación|certificate|curso/i, "Las certificaciones más valoradas actualmente son:\n\n- **Google**: Fundamentals de Digital Marketing, IT Support, Data Analytics.\n- **Microsoft**: Azure Fundamentals, Power Platform.\n- **AWS**: Cloud Practitioner.\n- **Scrum**: Scrum Master certificado.\n- **Idiomas**: certificación de inglés (TOEFL, IELTS, Cambridge).\n\n¿Te interesa alguna área en particular?"],
  [/carrera|ruta|camino|qué estudiar|recomendación/i, "Para definir tu ruta profesional:\n\n1. **Autoevaluación**: identifica tus fortalezas y áreas de mejora.\n2. **Mercado**: investiga los puestos más demandados en tu campo.\n3. **Especialización**: elige un área que te apasione y conviértete en experto.\n4. **Networking**: conecta con profesionales del sector.\n\n¿En qué área te gustaría especializarte?"],
  [/prácticas|practicas|primer empleo|trabajo/i, "Para conseguir tu primera oportunidad laboral:\n\n1. **Actualiza tu LinkedIn**: perfil completo con foto profesional.\n2. **CV optimizado**: enfócate en proyectos académicos y habilidades.\n3. **Prácticas pre-profesionales**: muchas empresas reclutan talento joven.\n4. **Ferias de empleo**: participa en eventos de tu universidad.\n\n¿Necesitas ayuda con algún paso en específico?"],
];

function mockQuery(prompt: string): string {
  const lower = prompt.toLowerCase();
  for (const [pattern, response] of MOCK_RESPONSES) {
    if (pattern.test(lower)) {
      return response;
    }
  }
  return "¡Hola! Soy tu mentor profesional IA de Despega UTP. Estoy aquí para ayudarte con tu desarrollo profesional. Puedes preguntarme sobre:\n\n- **Habilidades** que deberías reforzar\n- **Preparación para entrevistas**\n- **Optimización de tu CV**\n- **Certificaciones recomendadas**\n- **Tu ruta de carrera**\n\n¿En qué puedo ayudarte hoy? 😊";
}

export async function queryAi(
  prompt: string,
  opts?: {
    cvId?: string;
    maxWords?: number;
    max_words?: number;
    model?: string;
  },
): Promise<AiQueryResponse> {
  const body: AiQueryRequest = {
    prompt,
    model: opts?.model ?? "gemini-2.5-flash",
    max_words: opts?.max_words ?? opts?.maxWords ?? 700,
    maxWords: opts?.maxWords ?? opts?.max_words ?? 700,
  };

  if (opts?.cvId) body.cvId = opts.cvId;

  try {
    const res = await apiFetch<AiQueryResponse>("/api-ai/query", {
      method: "POST",
      body: JSON.stringify(body),
    });
    return res;
  } catch {
    console.log("[AI] Backend no disponible, usando respuesta simulada.");
    return { text: mockQuery(prompt) };
  }
}
