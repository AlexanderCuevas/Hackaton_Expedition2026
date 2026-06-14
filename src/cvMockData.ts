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

export const CV_MOCK_DATA: Record<string, CvMockEntry> = {
  // ─── 1. Adrian Quispe — CV casi vacío (primer-empleo) ───
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
    specializations: [],
    experienceLevel: "primer-empleo",
  },

  // ─── 2. Camila Ríos — Con proyectos académicos (practicas-pre) ───
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

  // ─── 3. Jose Sandoval — Con experiencia laboral (profesionales) ───
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

export function getCvMockData(studentCode: string): CvMockEntry | undefined {
  return CV_MOCK_DATA[studentCode];
}
