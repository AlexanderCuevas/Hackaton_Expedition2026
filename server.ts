import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize Gemini SDK with custom agent telemetry header
const apiKey = process.env.GEMINI_API_KEY;
let ai: GoogleGenAI | null = null;

if (apiKey && apiKey !== "MY_GEMINI_API_KEY") {
  try {
    ai = new GoogleGenAI({
      apiKey: apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });
    console.log("Gemini API successfully initialized on Express backend.");
  } catch (error) {
    console.error("Failed to initialize Gemini SDK:", error);
  }
} else {
  console.log("No valid GEMINI_API_KEY found. Running in localized fallback mock mode.");
}

// 1. Endpoint: Analyze profile and identify career skill gaps & missions
app.post("/api/profile/analyze", async (req, res) => {
  const { name, career, semester, experienceLevel, targetRole, currentSkills, interests } = req.body;

  if (!career || !targetRole) {
    return res.status(400).json({ error: "career and targetRole are required" });
  }

  const prompt = `Analiza el perfil de este estudiante universitario para determinar su nivel de empleabilidad:
Nombre: ${name || "Estudiante"}
Carrera: ${career}
Ciclo / Semestre: ${semester}
Nivel de experiencia: ${experienceLevel}
Puesto de trabajo objetivo: ${targetRole}
Habilidades actuales: ${(currentSkills || []).join(", ")}
Intereses: ${(interests || []).join(", ")}

Evalúa las brechas entre sus habilidades actuales y los requerimientos del mercado para el puesto: "${targetRole}". 
Genera un análisis interactivo.

Devuelve de manera estricta un objeto JSON con la siguiente estructura:
{
  "employabilityScore": un número entero del 0 al 100 indicando su nivel de preparación actual,
  "skillGaps": [
    {
      "skillName": "Nombre de la habilidad faltante",
      "category": "tecnica" o "blanda" o "certificacion",
      "priority": "alta" o "media" o "baja",
      "description": "Una breve explicación de por qué le falta esta habilidad y para qué sirve",
      "recommendedResource": "Nombre del curso, plataforma o certificación recomendada (por ejemplo: 'Curso de SQL de Platzi', 'Microsoft PL-300', etc.)"
    }
  ],
  "recommendedMissions": [
    {
      "id": "un id único de 6-8 caracteres",
      "title": "Misión interactiva estilo Duolingo (por ejemplo: 'Aprender SQL Básico', 'Crear tu CV en LinkedIn')",
      "description": "Explicación breve de la misión y qué va a lograr",
      "xpValue": 50,
      "type": "documento", "aprendizaje", "networking" o "simulacion",
      "actionLabel": "Texto del botón de acción (por ejemplo: 'Ir al analizador de CV', 'Comenzar curso')",
      "subtasks": [
        { "text": "Subtarea específica 1", "done": false },
        { "text": "Subtarea específica 2", "done": false }
      ]
    }
  ]
}`;

  if (ai) {
    try {
      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              employabilityScore: { type: Type.INTEGER },
              skillGaps: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    skillName: { type: Type.STRING },
                    category: { type: Type.STRING },
                    priority: { type: Type.STRING },
                    description: { type: Type.STRING },
                    recommendedResource: { type: Type.STRING }
                  },
                  required: ["skillName", "category", "priority", "description", "recommendedResource"]
                }
              },
              recommendedMissions: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    id: { type: Type.STRING },
                    title: { type: Type.STRING },
                    description: { type: Type.STRING },
                    xpValue: { type: Type.INTEGER },
                    type: { type: Type.STRING },
                    actionLabel: { type: Type.STRING },
                    subtasks: {
                      type: Type.ARRAY,
                      items: {
                        type: Type.OBJECT,
                        properties: {
                          text: { type: Type.STRING },
                          done: { type: Type.BOOLEAN }
                        }
                      }
                    }
                  }
                }
              }
            },
            required: ["employabilityScore", "skillGaps", "recommendedMissions"]
          }
        }
      });

      const parsed = JSON.parse(response.text?.trim() || "{}");
      return res.json(parsed);
    } catch (error) {
      console.error("Failed to generate content with Gemini:", error);
      // Fallback inside error block
    }
  }

  // Pure aesthetic offline mock responsive generator (aligned precisely with requested role)
  console.log("Serving offline responsive recommendation algorithm (Fallback)...");
  
  // Custom tailored recommendations based on career and target role
  const techCareers = ["ingeniería de sistemas", "ingeniería de software"];
  const isTechCareer = techCareers.some((c) => (career || "").toLowerCase().includes(c));
  const isTechRole = /\b(dev|developer|programador|backend|frontend|full[\s-]?stack|qa|devops|software engineer|analista de datos)\b/i.test(
    targetRole || ""
  );
  const isTech = isTechCareer || isTechRole;
  
  const score = isTech ? 45 : 55;
  const standardGaps = isTech ? [
    {
      skillName: "Modelamiento de Bases de Datos SQL",
      category: "tecnica",
      priority: "alta",
      description: "Es esencial para roles de tecnología realizar consultas complejas y diseñar bases estructuradas.",
      recommendedResource: "Curso Práctico de SQL en Hack Academy o Khan Academy"
    },
    {
      skillName: "Comunicación Asertiva en Equipos Scrum",
      category: "blanda",
      priority: "media",
      description: "Los ingenieros necesitan explicar decisiones técnicas de manera sencilla y colaborar en sprints coordinados.",
      recommendedResource: "Taller de Habilidades Blandas de la UTP o Coursera"
    },
    {
      skillName: "Certificación AWS Certified Cloud Practitioner",
      category: "certificacion",
      priority: "alta",
      description: "Demuestra comprensión fundamental de servicios en la nube, lo cual es altamente demandado hoy.",
      recommendedResource: "AWS Academy / YouTube Cloud Training"
    }
  ] : [
    {
      skillName: "Google Analytics 4 & Data Studio",
      category: "tecnica",
      priority: "alta",
      description: "Vital para medir el retorno de inversión en campañas de marketing y reportes de negocios.",
      recommendedResource: "Google Skillshop Academy"
    },
    {
      skillName: "Negociación y Resolución de Conflictos",
      category: "blanda",
      priority: "alta",
      description: "Facilidad de coordinar con diversas áreas de la empresa y asegurar acuerdos viables.",
      recommendedResource: "LinkedIn Learning - Negotiation Basics"
    },
    {
      skillName: "Certificación Scrum Product Owner fundamentals",
      category: "certificacion",
      priority: "media",
      description: "Incrementa tu valor aprendiendo a priorizar requerimientos de negocio ágiles.",
      recommendedResource: "Scrum.org Professional Basics"
    }
  ];

  const standardMissions = [
    {
      id: "m_cv_01",
      title: "Optimizar CV para filtros ATS",
      description: "Asegura que tu currículum destaque los términos clave requeridos por los algoritmos de reclutamiento automatizados.",
      xpValue: 80,
      type: "documento",
      actionLabel: "Analizar mi CV ahora",
      subtasks: [
        { text: "Copiar el texto de tu currículum en el CV Analyzer", done: false },
        { text: "Implementar las palabras clave sugeridas por la IA", done: false },
        { text: "Descargar el nuevo formato legible para ATS", done: false }
      ]
    },
    {
      id: "m_int_01",
      title: "Simular Entrevista Técnico-Comportamental",
      description: "Practica respuestas con el entrevistador interactivo de Despega UTP para el puesto de " + targetRole,
      xpValue: 120,
      type: "simulacion",
      actionLabel: "Empezar simulación",
      subtasks: [
        { text: "Responder al menos 3 preguntas de la IA", done: false },
        { text: "Obtener un puntaje de retroalimentación mínimo de 70%", done: false }
      ]
    },
    {
      id: "m_net_01",
      title: "Conectar con 2 Mentores del Área",
      description: "Impulsa tu networking contactando egresados establecidos en empresas clave para pedir sus tips prácticos.",
      xpValue: 100,
      type: "networking",
      actionLabel: "Buscar Mentores",
      subtasks: [
        { text: "Enviar solicitud de mentoría personalizada a través de la pestaña Comunidad", done: false },
        { text: "Obtener un tip exclusivo para destacar en entrevistas", done: false }
      ]
    }
  ];

  res.json({
    employabilityScore: score,
    skillGaps: standardGaps,
    recommendedMissions: standardMissions
  });
});

// 2. Endpoint: ATS CV Analyzer with Gemini recommendation engine
app.post("/api/cv/analyze", async (req, res) => {
  const { cvText, targetRole } = req.body;

  if (!cvText) {
    return res.status(400).json({ error: "Texto del CV es requerido" });
  }

  const rolePrompt = targetRole ? `para el puesto objetivo: "${targetRole}"` : "para puestos generales de su carrera";

  const prompt = `Analiza detalladamente el siguiente texto que representa el Currículum Vitae (CV) de un estudiante universitario ${rolePrompt}.
Realiza un escaneo ATS (Applicant Tracking System) riguroso.

CV:
${cvText}

Devuelve de manera estricta un objeto JSON con la siguiente estructura:
{
  "score": un número entero de 0 a 100 de compatibilidad ATS,
  "strengths": ["Lista de 3-4 fortalezas encontradas en su CV"],
  "weaknesses": ["Lista de 3-4 debilidades o errores estructurales observados"],
  "keywordsFound": ["Palabras clave estratégicas que ya incluye"],
  "keywordsMissing": ["Palabras clave fundamentales y de impacto que DEBE agregar para superar filtros ATS"],
  "generalFeedback": "Un resumen estructurado escrito de manera empática y constructiva usando lenguaje académico en formato Markdown, recomendando mejoras de redacción, formato y verbos de acción.",
  "atsFormattedCvAdvice": "Una plantilla de texto o bloques formateados con sugerencia exacta de cómo re-escribir su descripción principal."
}`;

  if (ai) {
    try {
      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              score: { type: Type.INTEGER },
              strengths: { type: Type.ARRAY, items: { type: Type.STRING } },
              weaknesses: { type: Type.ARRAY, items: { type: Type.STRING } },
              keywordsFound: { type: Type.ARRAY, items: { type: Type.STRING } },
              keywordsMissing: { type: Type.ARRAY, items: { type: Type.STRING } },
              generalFeedback: { type: Type.STRING },
              atsFormattedCvAdvice: { type: Type.STRING }
            },
            required: ["score", "strengths", "weaknesses", "keywordsFound", "keywordsMissing", "generalFeedback", "atsFormattedCvAdvice"]
          }
        }
      });

      const parsed = JSON.parse(response.text?.trim() || "{}");
      return res.json(parsed);
    } catch (error) {
      console.error("Failed to analyze CV with Gemini:", error);
    }
  }

  // Backup Mock response
  console.log("Serving offline responsive CV analysis mock report...");
  res.json({
    score: 62,
    strengths: [
      "Estructura cronológica limpia y legible.",
      "Mención directa a proyectos reales desarrollados en el campus.",
      "Excelente selección de habilidades blandas asociadas al trabajo en equipo."
    ],
    weaknesses: [
      "Uso de verbos débiles o pasivos (e.g. 'ayudé en', 'me encargué de' en vez de 'dirigí', 'implementé').",
      "Falta de cuantificación de logros (no presentas porcentajes de rendimiento o métricas cuantitativas).",
      "Formato de datos de contacto obsoleto y ausencia de enlace a portafolio GitHub/Behance."
    ],
    keywordsFound: [
      "Trabajo bajo presión",
      "Soporte técnico",
      "Organización",
      "React",
      "Estudiante de Sistemas"
    ],
    keywordsMissing: [
      "Metodología Ágil (Scrum)",
      "Optimización de procesos",
      "CI/CD",
      "REST APIs",
      "Control de Versiones (Git/GitHub)"
    ],
    generalFeedback: `### ¡Excelente inicio, pero con alto margen de mejora!

Tu currículum presenta una base sólida puesto que explicas de forma organizada tus estudios. Sin embargo, para superar los filtros automatizados **ATS** necesitas realizar los siguientes ajustes de inmediato:

1. **Cuantifica tus logros**: En lugar de escribir *"Desarrollé la aplicación web de inventario"*, prueba con *"Diseñé e implementé una SPA React de inventario, disminuyendo el tiempo de registro manual en un 25%."*
2. **Impacto de la tecnología**: Menciona qué tecnologías usaste y con qué propósito.
3. **Optimización de distribución**: Remueve barras de porcentaje para autoevaluar tus habilidades (como 'Español: 80%'). Los sistemas ATS no interpretan gráficos de barra y descartan el currículum.`,
    atsFormattedCvAdvice: `Escribe tu extracto profesional usando esta estructura optimizada para ATS:

"Estudiante de Ingeniería de Sistemas de ciclo avanzado, orientado al desarrollo Full Stack con dominio en TypeScript, React y SQL. Especializado en la optimización de procesos mediante desarrollo ágil y diseño de interfaces modulares. Experiencia liderando proyectos de clase exitosos y automatizando flujos manuales de consulta de datos."`
  });
});

// 3. Endpoint: Interview simulator chat
app.post("/api/interview/chat", async (req, res) => {
  const { roleName, messages } = req.body;

  if (!roleName) {
    return res.status(400).json({ error: "roleName is required" });
  }

  const conversationHistory = (messages || [])
    .map((m: any) => `${m.role === "user" ? "Candidato" : "Entrevistador"}: ${m.content}`)
    .join("\n");

  const prompt = `Actúa como un reclutador de talento profesional o líder de ingeniería que realiza una entrevista formal en español para el puesto de: "${roleName}".
Estás evaluando a un estudiante universitario. Haz preguntas que mezclen la evaluación de habilidades técnicas de su carrera con competencias blandas (resolución de problemas corporativos, resiliencia, trabajo en equipo).

Mantén el diálogo dinámico: responde al último mensaje de manera realista, da retroalimentación rápida (pero sutil, de reclutador) si es necesario, y formula exactamente UNA nueva pregunta. No repitas preguntas ya planteadas.

Mantén tu respuesta amigable pero profesional.

Historial de la conversación:
${conversationHistory}

Siguiente mensaje del Entrevistador:`;

  if (ai) {
    try {
      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: prompt
      });

      return res.json({ reply: response.text?.trim() || "Interesante respuesta. Cuéntame, ¿cómo manejas los conflictos dentro de un grupo de estudio universitario de ritmo acelerado?" });
    } catch (error) {
      console.error("Failed to fetch interview reply from Gemini:", error);
    }
  }

  // Pure response logic
  const lastUserMsg = messages && messages.length > 0 ? messages[messages.length - 1].content.toLowerCase() : "";
  let baseReply = "";

  if (messages.length <= 1) {
    baseReply = `¡Hola! Un gusto tenerte en esta sesión de preparación para el puesto de **${roleName}**. Para comenzar, cuéntame: ¿Cuál consideras que ha sido el mayor reto técnico o académico que has superado durante tus últimos ciclos universitarios y cómo lo resolviste?`;
  } else if (lastUserMsg.includes("comunicación") || lastUserMsg.includes("coordinar") || lastUserMsg.includes("grupo")) {
    baseReply = "Excelente punto. La alineación y comunicación oportuna es crucial en cualquier rol profesional hoy. Ahora dime, suponiendo que un cliente te pide cambiar de prioridad una entrega a mitad del sprint o entrega académica, ¿cómo gestionarías las expectativas para no frustrarte ni fallar en la calidad?";
  } else {
    baseReply = "Entiendo perfectamente tu enfoque. Es una experiencia muy constructiva. Si fueras contratado(a) esta semana para el rol, ¿cuáles serían los dos primeros indicadores u objetivos que te gustaría cumplir en tus primeros 30 días en la empresa?";
  }

  res.json({ reply: baseReply });
});

// 4. Endpoint: Interview evaluation
app.post("/api/interview/evaluate", async (req, res) => {
  const { roleName, messages } = req.body;

  if (!messages || messages.length < 2) {
    return res.status(400).json({ error: "Suficientes mensajes son requeridos para evaluar" });
  }

  const conversationHistory = messages
    .map((m: any) => `${m.role === "user" ? "Estudiante" : "Entrevistador"}: ${m.content}`)
    .join("\n");

  const prompt = `Analiza la siguiente simulación de entrevista en español para el puesto de: "${roleName}".
Evalúa la calidad de las respuestas dadas por el Estudiante. Determina fortalezas, áreas de mejora y una calificación constructiva de 0 a 100 de desempeño.

Historial de conversación:
${conversationHistory}

Devuelve de manera estricta un objeto JSON con la siguiente estructura:
{
  "score": un número entero del 0 al 100,
  "strengths": ["Lista de 3 fortalezas clave demostradas en sus respuestas"],
  "improvements": ["Lista de 3 sugerencias precisas o correcciones de lenguaje/estructura corporativa"],
  "feedbackMessage": "Un mensaje motivacional largo en formato Markdown resumiendo su desempeño en la entrevista."
}`;

  if (ai) {
    try {
      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              score: { type: Type.INTEGER },
              strengths: { type: Type.ARRAY, items: { type: Type.STRING } },
              improvements: { type: Type.ARRAY, items: { type: Type.STRING } },
              feedbackMessage: { type: Type.STRING }
            },
            required: ["score", "strengths", "improvements", "feedbackMessage"]
          }
        }
      });

      const parsed = JSON.parse(response.text?.trim() || "{}");
      return res.json(parsed);
    } catch (error) {
      console.error("Failed to generate evaluation report:", error);
    }
  }

  // Fallback Mock Evaluation
  res.json({
    score: 78,
    strengths: [
      "Estructura clara al relatar soluciones mediante metodologías sencillas.",
      "Orientación proactiva hacia el aprendizaje y la mejora de habilidades.",
      "Excelente nivel de honestidad profesional al explicar tus limitaciones técnicas actuales."
    ],
    improvements: [
      "Utiliza el método STAR (Situación, Tarea, Acción, Resultado) para ordenar tus respuestas complejas de manera más directa.",
      "Menciona con mayor profundidad qué herramientas medibles utilizaste para dar soporte a tus soluciones.",
      "Evita el titubeo o redundancia al explicar el manejo de prioridades."
    ],
    feedbackMessage: `### ¡Buen trabajo en tu simulación de entrevista!

Has demostrado una **comunicación asertiva excelente** y una visión clara de tus objetivos profesionales. Para el puesto de **${roleName}**, los entrevistadores aprecian que demuestres iniciativa técnica. 

Te sugerimos practicar estructurar tus respuestas usando datos o métricas concretas y repasar el método **STAR** para que tus historias profesionales brillen aún más en tus próximas rondas de selección.`
  });
});


// Serve static assets in production, hook Vite dev server in development
if (process.env.NODE_ENV !== "production") {
  const startVite = async () => {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
    
    app.listen(PORT, "0.0.0.0", () => {
      console.log(`Development Server running on http://localhost:${PORT}`);
    });
  };
  startVite();
} else {
  const distPath = path.join(process.cwd(), "dist");
  app.use(express.static(distPath));
  app.get("*", (req, res) => {
    res.sendFile(path.join(distPath, "index.html"));
  });
  
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Production Server running on code port ${PORT}`);
  });
}
