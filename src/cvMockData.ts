import type { CareerMission, CvAnalysis, CvMeta, SkillGap } from "./types";

export interface CvMockProyecto {
  nombre: string;
  fechaInicio: string;
  fechaFin: string;
  descripcion: string;
  logros: string[];
}

export interface CvMockEntry {
  email: string;
  phone: string;
  linkedin: string;
  resumen: string;
  formacion: {
    fechaInicio: string;
    fechaFin: string;
    logros: string;
  };
  experiencias: {
    rol: string;
    descripcion: string;
    ubicacion: string;
    fechaInicio: string;
    fechaFin: string;
    logros: string[];
  }[];
  proyectos: CvMockProyecto[];
  hardSkills: string[];
  softSkills: string[];
  specializations: string[];
  experienceLevel: string;
}

export interface StudentCareerBundle {
  studentCode: string;
  studentName: string;
  career: string;
  targetRole: string;
  cv: CvMockEntry;
  cvMeta: CvMeta;
  cvAnalysis: CvAnalysis;
  skillGaps: SkillGap[];
  careerMissions: CareerMission[];
  initialEmployabilityScore: number;
}

export const CV_MOCK_DATA: Record<string, CvMockEntry> = {
  U22223419: {
    email: "adrian.quispe@utp.edu.pe",
    phone: "+51 987 654 300",
    linkedin: "linkedin.com/in/adrianquispe",
    resumen:
      "Estudiante de Ingeniería de Sistemas cursando el 7mo ciclo. Interesado en desarrollo de software y bases de datos. Busco mi primera oportunidad para aplicar mis conocimientos y crecer profesionalmente.",
    formacion: {
      fechaInicio: "2022-03",
      fechaFin: "2026-12",
      logros: "Curso de Base de Datos destacado. Participación en taller de Git y GitHub.",
    },
    experiencias: [],
    proyectos: [],
    hardSkills: ["HTML/CSS", "JavaScript", "SQL Server"],
    softSkills: ["Responsabilidad", "Trabajo en equipo"],
    specializations: ["Backend", "Desarrollo Web"],
    experienceLevel: "primer-empleo",
  },

  U20198765: {
    email: "camila.rios@utp.edu.pe",
    phone: "+51 987 654 301",
    linkedin: "linkedin.com/in/camilaríos",
    resumen:
      "Estudiante de Marketing con interés en marketing digital y análisis de mercado. Experiencia en proyectos académicos de investigación de mercado y campañas publicitarias. Busco prácticas pre-profesionales para aplicar mis conocimientos en un entorno real.",
    formacion: {
      fechaInicio: "2021-04",
      fechaFin: "2026-07",
      logros: "Mejor promedio del ciclo en Investigación de Mercados. Taller de Marketing Digital certificado por Google.",
    },
    experiencias: [
      {
        rol: "Voluntaria en Feria Empresarial",
        descripcion: "Organización de eventos académicos",
        ubicacion: "Lima, Perú",
        fechaInicio: "2023-08",
        fechaFin: "2023-11",
        logros: [
          "Coordiné la logística de 15 stands de exposición",
          "Apoyé en la difusión del evento alcanzando 200+ asistentes",
        ],
      },
    ],
    proyectos: [
      {
        nombre: "Plan de Marketing Digital para Emprendimiento Local",
        fechaInicio: "2024-06",
        fechaFin: "2025-01",
        descripcion: "Proyecto académico del curso de Marketing Digital",
        logros: [
          "Diseñé una estrategia de contenido para redes sociales",
          "Realicé análisis de competencia y propuesta de valor",
          "Presenté los resultados ante un jurado académico obteniendo calificación sobresaliente",
        ],
      },
    ],
    hardSkills: ["Google Analytics", "Meta Ads", "Canva", "Excel Avanzado", "SEO Básico"],
    softSkills: ["Creatividad", "Comunicación efectiva", "Trabajo en equipo", "Organización"],
    specializations: ["Marketing Digital", "Investigación de Mercados"],
    experienceLevel: "practicas-pre",
  },

  U20245678: {
    email: "jose.sandoval@utp.edu.pe",
    phone: "+51 987 654 323",
    linkedin: "linkedin.com/in/josesandoval",
    resumen:
      "Estudiante de Negocios Internacionales con experiencia en comercio exterior y logística. Certificado como Scrum Master (PSM I). He trabajado como asistente de comercio exterior en una empresa importadora, gestionando documentos de aduana y coordinando envíos internacionales.",
    formacion: {
      fechaInicio: "2020-03",
      fechaFin: "2025-12",
      logros: "Certificación PSM I (Scrum Master). Curso de Inglés Comercial Avanzado. Taller de Negociación Internacional.",
    },
    experiencias: [
      {
        rol: "Asistente de Comercio Exterior",
        descripcion: "Importaciones del Pacífico S.A.C.",
        ubicacion: "Lima, Perú",
        fechaInicio: "2024-01",
        fechaFin: "",
        logros: [
          "Gestioné documentos de importación para 30+ contenedores",
          "Coordiné con agentes de aduana reduciendo tiempos de despacho en 15%",
          "Mantuve actualizado el registro de proveedores internacionales",
        ],
      },
      {
        rol: "Practicante de Logística",
        descripcion: "LogiPerú S.A.C.",
        ubicacion: "Callao, Perú",
        fechaInicio: "2023-03",
        fechaFin: "2023-12",
        logros: [
          "Apoyé en la planificación de rutas de distribución nacional",
          "Realicé reportes de indicadores logísticos en Excel",
        ],
      },
    ],
    proyectos: [
      {
        nombre: "Plan de Exportación a Mercado Asiático",
        fechaInicio: "2024-08",
        fechaFin: "2024-11",
        descripcion: "Investigación académica para identificar oportunidades de exportación de productos peruanos",
        logros: [
          "Analicé requisitos arancelarios y barreras comerciales",
          "Propuse un plan de entrada a mercado japonés para productos agroindustriales",
        ],
      },
      {
        nombre: "Simulación de Negociación Internacional",
        fechaInicio: "2024-03",
        fechaFin: "2024-06",
        descripcion: "Simulación con empresas de Latinoamérica como parte del curso de Negociación",
        logros: [
          "Lideré el equipo de negociación representando a una empresa peruana",
          "Logré un acuerdo favorable en la simulación evaluada por el docente",
        ],
      },
    ],
    hardSkills: [
      "Excel Financiero",
      "Logística Internacional",
      "Inglés Comercial",
      "Negociación",
      "Scrum",
      "Gestión Aduanera",
    ],
    softSkills: [
      "Liderazgo",
      "Comunicación efectiva",
      "Proactividad",
      "Resolución de problemas",
    ],
    specializations: ["Comercio Exterior", "Logística", "Supply Chain"],
    experienceLevel: "profesionales",
  },
};

const STUDENT_CAREER_BUNDLES: Record<string, StudentCareerBundle> = {
  U22223419: {
    studentCode: "U22223419",
    studentName: "Adrian Quispe",
    career: "Ingeniería de Sistemas",
    targetRole: "Backend Developer Trainee",
    cv: CV_MOCK_DATA.U22223419,
    cvMeta: {
      fileName: "CV_Adrian_Quispe.pdf",
      format: "PDF",
      source: "Perfil Profesional",
      status: "Analizado por IA",
      targetRole: "Backend Developer Trainee",
      analysisDate: "Hoy",
    },
    initialEmployabilityScore: 42,
    cvAnalysis: {
      score: 48,
      strengths: [
        "Formación académica coherente con Ingeniería de Sistemas.",
        "Interés explícito en desarrollo de software y bases de datos.",
        "Habilidades base en HTML/CSS, JavaScript y SQL Server.",
      ],
      weaknesses: [
        "Sin experiencia laboral ni proyectos documentados en el CV.",
        "No menciona control de versiones (Git/GitHub) ni APIs REST.",
        "Resumen genérico sin orientación al puesto Backend Trainee.",
        "Faltan métricas, certificaciones y enlaces a portafolio.",
      ],
      keywordsFound: ["JavaScript", "SQL Server", "HTML/CSS", "Bases de datos", "Trabajo en equipo"],
      keywordsMissing: ["Git/GitHub", "APIs REST", "Node.js", "Testing", "Scrum", "Docker"],
      generalFeedback: `## Informe ATS — Adrian Quispe · Backend Developer Trainee

### Diagnóstico general
Tu CV refleja un perfil de **primer empleo** con bases técnicas, pero aún no demuestra evidencia práctica que los reclutadores tech exigen para un trainee backend.

### Hallazgos clave
- **Formación:** correcta para 7mo ciclo; destaca el curso de BD, pero falta detallar proyectos académicos.
- **Experiencia:** vacía — es normal en primer empleo, pero debes compensar con proyectos personales.
- **Habilidades:** SQL y JS listados sin contexto de uso ni repositorios públicos.
- **Orientación al rol:** el resumen no menciona backend, APIs ni metodologías ágiles.

### Recomendaciones prioritarias
1. Publicar al menos **un proyecto en GitHub** (API REST simple con Node o Spring).
2. Reformular el resumen en 3 líneas orientadas a **Backend Developer Trainee**.
3. Agregar sección **Proyectos** con stack, problema resuelto y resultado.
4. Incluir certificación o curso en **Git** y fundamentos de **cloud**.
5. Completar perfil de **LinkedIn** alineado al mismo mensaje del CV.`,
      atsFormattedCvAdvice:
        "Estudiante de Ingeniería de Sistemas (7mo ciclo) orientado al desarrollo backend. Domina fundamentos de JavaScript, HTML/CSS y SQL Server. Busca su primer rol como Backend Developer Trainee, con foco en APIs REST, control de versiones con Git/GitHub y metodologías ágiles. Aporta responsabilidad, aprendizaje autónomo y trabajo en equipo.",
    },
    skillGaps: [
      {
        skillName: "Modelamiento de bases de datos SQL",
        category: "tecnica",
        priority: "alta",
        description:
          "Las vacantes backend junior exigen consultas SQL, modelamiento relacional y optimización básica de queries.",
        recommendedResource: "SQL y Gestión de Datos — UTP",
        status: "pendiente",
      },
      {
        skillName: "Git/GitHub y control de versiones",
        category: "tecnica",
        priority: "alta",
        description:
          "Sin evidencia de repositorios públicos ni flujo de trabajo colaborativo con Git.",
        recommendedResource: "Git y GitHub desde cero — Udemy",
        status: "pendiente",
      },
      {
        skillName: "Metodologías Ágiles (Scrum)",
        category: "blanda",
        priority: "media",
        description:
          "Los equipos de desarrollo esperan familiaridad con ceremonias ágiles y trabajo en sprint.",
        recommendedResource: "Taller Scrum para desarrolladores — UTP+",
        status: "pendiente",
      },
      {
        skillName: "AWS Certified Cloud Practitioner",
        category: "certificacion",
        priority: "media",
        description:
          "Una certificación cloud básica diferencia tu perfil frente a otros candidatos de primer empleo.",
        recommendedResource: "AWS Skill Builder",
        status: "pendiente",
      },
    ],
    careerMissions: [
      {
        id: "m_ad_cv_01",
        title: "CV orientado a Backend Trainee",
        description:
          "Reescribe tu resumen profesional, agrega sección de proyectos y keywords técnicas para el rol Backend Developer Trainee.",
        xpValue: 80,
        type: "documento",
        status: "disponible",
        order: 1,
        actionLabel: "Optimizar CV",
        subtasks: [
          { text: "Resumen de 3 líneas orientado al puesto", done: false },
          { text: "Sección Proyectos con stack y resultado", done: false },
          { text: "Keywords Git, APIs REST y SQL integradas", done: false },
        ],
      },
      {
        id: "m_ad_proj_01",
        title: "Primer proyecto en GitHub",
        description:
          "Publica una API REST simple (Node.js o Spring Boot) con README, endpoints documentados y al menos 2 commits significativos.",
        xpValue: 120,
        type: "aprendizaje",
        status: "bloqueado",
        order: 2,
        actionLabel: "Crear repositorio",
        subtasks: [
          { text: "Repositorio público con README profesional", done: false },
          { text: "API REST con al menos 3 endpoints", done: false },
          { text: "Enlace al repo en CV y LinkedIn", done: false },
        ],
      },
      {
        id: "m_ad_int_01",
        title: "Simulación entrevista técnica",
        description:
          "Practica preguntas de SQL, lógica de programación y metodologías ágiles en el simulador de entrevistas.",
        xpValue: 100,
        type: "simulacion",
        status: "bloqueado",
        order: 3,
        actionLabel: "Iniciar simulación",
        subtasks: [
          { text: "Completar ronda de preguntas SQL", done: false },
          { text: "Responder escenario de trabajo en equipo", done: false },
          { text: "Recibir feedback de la IA", done: false },
        ],
      },
      {
        id: "m_ad_net_01",
        title: "Networking con devs UTP",
        description:
          "Conecta con 3 profesionales o egresados de Ingeniería de Sistemas en la bolsa de contactos.",
        xpValue: 60,
        type: "networking",
        status: "bloqueado",
        order: 4,
        actionLabel: "Ver contactos",
        subtasks: [
          { text: "Enviar solicitud a 3 contactos tech", done: false },
          { text: "Personalizar mensaje de conexión", done: false },
          { text: "Registrar seguimiento en la plataforma", done: false },
        ],
      },
    ],
  },

  U20198765: {
    studentCode: "U20198765",
    studentName: "Camila Ríos",
    career: "Marketing",
    targetRole: "Asistente de Marketing Digital",
    cv: CV_MOCK_DATA.U20198765,
    cvMeta: {
      fileName: "CV_Camila_Rios.pdf",
      format: "PDF",
      source: "Perfil Profesional",
      status: "Analizado por IA",
      targetRole: "Asistente de Marketing Digital",
      analysisDate: "Hoy",
    },
    initialEmployabilityScore: 58,
    cvAnalysis: {
      score: 65,
      strengths: [
        "Proyecto académico sólido en marketing digital con resultados presentados.",
        "Experiencia voluntaria en feria empresarial con logística y difusión.",
        "Habilidades en Google Analytics, Meta Ads, Canva y SEO básico.",
        "Promedio destacado en Investigación de Mercados.",
      ],
      weaknesses: [
        "Falta certificación oficial de Google Analytics 4.",
        "Meta Ads mencionado sin métricas de campañas (CTR, CPA, ROAS).",
        "No incluye portafolio visual ni casos de estudio descargables.",
        "CV orientado a prácticas pero sin keywords de CRM o email marketing.",
      ],
      keywordsFound: [
        "Google Analytics",
        "Meta Ads",
        "Marketing Digital",
        "SEO",
        "Investigación de Mercados",
        "Canva",
      ],
      keywordsMissing: [
        "Google Analytics 4",
        "Email Marketing",
        "CRM",
        "Storytelling con datos",
        "Power BI",
        "Copywriting",
      ],
      generalFeedback: `## Informe ATS — Camila Ríos · Asistente de Marketing Digital

### Diagnóstico general
Perfil prometedor para **prácticas pre-profesionales** en marketing digital. Tienes proyectos académicos relevantes, pero el CV aún no demuestra impacto medible en campañas reales.

### Hallazgos clave
- **Proyecto académico:** buena base; conviértelo en caso de estudio con métricas simuladas o reales.
- **Experiencia:** voluntariado útil; falta cuantificar alcance y conversiones en redes.
- **Herramientas:** GA y Meta Ads listados; certifica GA4 y documenta un mini-dashboard.
- **Portafolio:** ausente — agrega PDF o Behance con piezas creativas.

### Recomendaciones prioritarias
1. Obtener certificación **Google Analytics 4** (Skillshop).
2. Documentar el proyecto de emprendimiento con **KPIs** (alcance, engagement, leads).
3. Agregar sección **Portafolio** con 2-3 piezas de contenido digital.
4. Incluir keywords de **email marketing** y herramientas CRM básicas.
5. Adaptar el resumen al rol **Asistente de Marketing Digital**.`,
      atsFormattedCvAdvice:
        "Estudiante de Marketing (6to ciclo) especializada en marketing digital e investigación de mercados. Experiencia en campañas académicas con Google Analytics, Meta Ads y SEO. Busca prácticas pre-profesionales como Asistente de Marketing Digital, aportando creatividad, análisis de datos y comunicación efectiva.",
    },
    skillGaps: [
      {
        skillName: "Certificación Google Analytics 4",
        category: "certificacion",
        priority: "alta",
        description:
          "Las vacantes de marketing digital priorizan candidatos con GA4 certificado en Skillshop.",
        recommendedResource: "Google Analytics 4 — Skillshop",
        status: "pendiente",
      },
      {
        skillName: "Meta Ads y optimización de campañas",
        category: "tecnica",
        priority: "alta",
        description:
          "Falta evidencia de métricas de rendimiento (CTR, CPA) en campañas pagadas.",
        recommendedResource: "Meta Blueprint — Fundamentos de Ads",
        status: "pendiente",
      },
      {
        skillName: "Storytelling con datos",
        category: "blanda",
        priority: "media",
        description:
          "Necesitas presentar resultados de campañas con narrativa clara y visualizaciones.",
        recommendedResource: "Inteligencia Artificial Aplicada — UTP",
        status: "pendiente",
      },
      {
        skillName: "Email Marketing y CRM básico",
        category: "tecnica",
        priority: "media",
        description:
          "Muchas prácticas exigen manejo de funnels, newsletters y herramientas CRM.",
        recommendedResource: "HubSpot Academy — Email Marketing",
        status: "pendiente",
      },
    ],
    careerMissions: [
      {
        id: "m_ca_cv_01",
        title: "CV para Marketing Digital",
        description:
          "Transforma tu proyecto académico en caso de estudio y alinea keywords al rol Asistente de Marketing Digital.",
        xpValue: 90,
        type: "documento",
        status: "disponible",
        order: 1,
        actionLabel: "Optimizar CV",
        subtasks: [
          { text: "Caso de estudio con KPIs del proyecto académico", done: false },
          { text: "Keywords GA4, Meta Ads y CRM integradas", done: false },
          { text: "Enlace a portafolio o Behance", done: false },
        ],
      },
      {
        id: "m_ca_port_01",
        title: "Portafolio de campaña digital",
        description:
          "Arma un mini-portafolio PDF con estrategia, piezas creativas y métricas del plan de marketing digital.",
        xpValue: 110,
        type: "documento",
        status: "bloqueado",
        order: 2,
        actionLabel: "Crear portafolio",
        subtasks: [
          { text: "3 piezas visuales en Canva", done: false },
          { text: "Tabla de métricas simuladas o reales", done: false },
          { text: "PDF exportado y enlazado en CV", done: false },
        ],
      },
      {
        id: "m_ca_int_01",
        title: "Simulación entrevista marketing",
        description:
          "Practica preguntas sobre campañas digitales, análisis de mercado y trabajo con equipos creativos.",
        xpValue: 100,
        type: "simulacion",
        status: "bloqueado",
        order: 3,
        actionLabel: "Iniciar simulación",
        subtasks: [
          { text: "Explicar un caso de campaña con métricas", done: false },
          { text: "Responder sobre herramientas GA y Meta", done: false },
          { text: "Recibir evaluación de la IA", done: false },
        ],
      },
      {
        id: "m_ca_net_01",
        title: "Red de contactos marketing",
        description:
          "Conecta con especialistas en marketing digital y growth en la bolsa de contactos UTP.",
        xpValue: 70,
        type: "networking",
        status: "bloqueado",
        order: 4,
        actionLabel: "Ver contactos",
        subtasks: [
          { text: "Contactar 3 profesionales de marketing", done: false },
          { text: "Pedir feedback sobre portafolio", done: false },
          { text: "Registrar conexiones en la plataforma", done: false },
        ],
      },
    ],
  },

  U20245678: {
    studentCode: "U20245678",
    studentName: "Jose Sandoval",
    career: "Negocios Internacionales",
    targetRole: "Asistente de Comercio Exterior",
    cv: CV_MOCK_DATA.U20245678,
    cvMeta: {
      fileName: "CV_Jose_Sandoval.pdf",
      format: "PDF",
      source: "Perfil Profesional",
      status: "Analizado por IA",
      targetRole: "Asistente de Comercio Exterior",
      analysisDate: "Hoy",
    },
    initialEmployabilityScore: 72,
    cvAnalysis: {
      score: 79,
      strengths: [
        "Experiencia laboral real en comercio exterior con métricas (30+ contenedores, -15% tiempos).",
        "Certificación PSM I (Scrum Master) que aporta diferenciación.",
        "Proyectos académicos alineados a exportación y negociación internacional.",
        "Habilidades técnicas coherentes: logística, gestión aduanera, Excel financiero.",
      ],
      weaknesses: [
        "Inglés comercial sin nivel certificado (TOEFL/IELTS).",
        "No menciona herramientas CRM o ERP de comercio exterior.",
        "Falta especialización en Incoterms 2020 y normativa aduanera actualizada.",
        "CV podría destacar más el rol objetivo en el resumen inicial.",
      ],
      keywordsFound: [
        "Comercio Exterior",
        "Logística Internacional",
        "Gestión Aduanera",
        "Negociación",
        "Scrum",
        "Excel Financiero",
        "Importación",
      ],
      keywordsMissing: [
        "Incoterms 2020",
        "SAP/ERP Logístico",
        "Inglés C1",
        "Supply Chain Digital",
        "COMEX",
        "Despacho aduanero",
      ],
      generalFeedback: `## Informe ATS — Jose Sandoval · Asistente de Comercio Exterior

### Diagnóstico general
CV **competitivo** para roles de comercio exterior junior. Combinas experiencia práctica, certificación Scrum y proyectos académicos relevantes. Con ajustes puntuales puedes alcanzar shortlist en empresas importadoras/exportadoras.

### Hallazgos clave
- **Experiencia:** sólida para estudiante; métricas claras en gestión de contenedores y aduanas.
- **Formación:** PSM I suma valor; complementa con certificación en COMEX o aduanas.
- **Idioma:** inglés comercial mencionado sin certificación — prioridad para negocios internacionales.
- **Herramientas:** falta ERP/CRM logístico (SAP, Odoo o similar).

### Recomendaciones prioritarias
1. Certificar **inglés B2/C1** o incluir puntaje TOEFL/IELTS.
2. Agregar keywords **Incoterms 2020** y normativa aduanera peruana.
3. Destacar rol objetivo en las primeras líneas del resumen.
4. Mencionar herramientas digitales de **supply chain** si las has usado.
5. Reforzar red de contactos en **logística y COMEX** para próximas vacantes.`,
      atsFormattedCvAdvice:
        "Profesional de Negocios Internacionales con experiencia en comercio exterior, gestión aduanera y logística. Certificado PSM I. Ha gestionado importaciones de 30+ contenedores y optimizado tiempos de despacho. Busca consolidar su carrera como Asistente de Comercio Exterior, aportando negociación internacional, Excel financiero y orientación a resultados.",
    },
    skillGaps: [
      {
        skillName: "Inglés comercial certificado (B2/C1)",
        category: "certificacion",
        priority: "alta",
        description:
          "El 90% de vacantes COMEX exigen inglés intermedio-avanzado con certificación verificable.",
        recommendedResource: "TOEFL iBT / IELTS — Preparación UTP+",
        status: "pendiente",
      },
      {
        skillName: "Incoterms 2020 y normativa aduanera",
        category: "tecnica",
        priority: "alta",
        description:
          "Debes demostrar dominio actualizado de Incoterms y procedimientos de despacho aduanero.",
        recommendedResource: "Curso COMEX y Aduanas — Cámara de Comercio",
        status: "pendiente",
      },
      {
        skillName: "Metodologías Ágiles (Scrum)",
        category: "blanda",
        priority: "media",
        description:
          "Ya tienes PSM I; refuerza cómo aplicas Scrum en proyectos logísticos y de importación.",
        recommendedResource: "Inteligencia Artificial Aplicada — UTP",
        status: "en_progreso",
      },
      {
        skillName: "Supply Chain Digital y ERP logístico",
        category: "tecnica",
        priority: "media",
        description:
          "Las empresas importadoras valoran manejo de ERP y trazabilidad digital de operaciones.",
        recommendedResource: "Logística 4.0 — LinkedIn Learning",
        status: "pendiente",
      },
    ],
    careerMissions: [
      {
        id: "m_jo_cv_01",
        title: "CV optimizado COMEX",
        description:
          "Refuerza el resumen orientado a Asistente de Comercio Exterior con Incoterms, métricas y certificaciones.",
        xpValue: 70,
        type: "documento",
        status: "disponible",
        order: 1,
        actionLabel: "Optimizar CV",
        subtasks: [
          { text: "Resumen con rol objetivo y años de experiencia", done: false },
          { text: "Keywords Incoterms y COMEX integradas", done: false },
          { text: "Métricas de importación destacadas al inicio", done: false },
        ],
      },
      {
        id: "m_jo_neg_01",
        title: "Simulación negociación internacional",
        description:
          "Entrena escenarios de negociación con proveedores extranjeros y condiciones de pago internacional.",
        xpValue: 130,
        type: "simulacion",
        status: "bloqueado",
        order: 2,
        actionLabel: "Iniciar simulación",
        subtasks: [
          { text: "Negociar precio y plazo con proveedor asiático", done: false },
          { text: "Defender condiciones Incoterms FOB/CIF", done: false },
          { text: "Obtener evaluación de la IA", done: false },
        ],
      },
      {
        id: "m_jo_cert_01",
        title: "Certificación en gestión aduanera",
        description:
          "Completa un curso especializado en normativa aduanera peruana y documentación de importación.",
        xpValue: 140,
        type: "aprendizaje",
        status: "bloqueado",
        order: 3,
        actionLabel: "Ver cursos",
        subtasks: [
          { text: "Inscribirte en curso COMEX/aduanas", done: false },
          { text: "Completar módulo de Incoterms 2020", done: false },
          { text: "Agregar certificación al CV", done: false },
        ],
      },
      {
        id: "m_jo_net_01",
        title: "Red logística y COMEX",
        description:
          "Amplía tu red con agentes de aduana, especialistas logísticos y reclutadores del sector.",
        xpValue: 80,
        type: "networking",
        status: "bloqueado",
        order: 4,
        actionLabel: "Ver contactos",
        subtasks: [
          { text: "Conectar con 3 contactos del sector COMEX", done: false },
          { text: "Solicitar referencia o recomendación", done: false },
          { text: "Actualizar LinkedIn con nuevas conexiones", done: false },
        ],
      },
    ],
  },
};

export function getCvMockData(studentCode: string): CvMockEntry | undefined {
  return CV_MOCK_DATA[studentCode];
}

export function getStudentCareerBundle(studentCode: string): StudentCareerBundle | undefined {
  return STUDENT_CAREER_BUNDLES[studentCode];
}

export function hasStudentCareerBundle(studentCode: string): boolean {
  return studentCode in STUDENT_CAREER_BUNDLES;
}

export const STUDENT_MOCK_CODES = Object.keys(STUDENT_CAREER_BUNDLES);
