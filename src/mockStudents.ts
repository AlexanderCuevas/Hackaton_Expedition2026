export interface MockStudent {
  name: string;
  career: string;
  semester: number;
  code: string;
  hasCv: boolean;
  email?: string;
  phone?: string;
  linkedin?: string;
  github?: string;
  experienceLevel?: string;
  targetRole?: string;
  hardSkills?: string[];
  softSkills?: string[];
  interests?: string[];
  cvResumen?: string;
  cvFormacion?: string;
  cvProyectos?: string;
}

export const MOCK_STUDENTS_BY_CODE: Record<string, MockStudent> = {
  U20213456: {
    name: "Valeria Alva",
    career: "Administración",
    semester: 8,
    code: "U20213456",
    hasCv: false,
  },
  U22223419: {
    name: "Adrian Quispe",
    career: "Ingeniería de Sistemas",
    semester: 7,
    code: "U22223419",
    hasCv: false,
    email: "adrian.quispe@utp.edu.pe",
    phone: "+51 987 654 300",
    linkedin: "linkedin.com/in/adrianquispe",
    targetRole: "Backend Developer Trainee",
    interests: ["Backend", "Desarrollo Web"],
  },
  U20198765: {
    name: "Camila Ríos",
    career: "Marketing",
    semester: 6,
    code: "U20198765",
    hasCv: false,
    email: "camila.rios@utp.edu.pe",
    phone: "+51 987 654 301",
    linkedin: "linkedin.com/in/camilaríos",
    targetRole: "Asistente de Marketing Digital",
    interests: ["Marketing Digital", "Investigación de Mercados"],
  },
  U20204567: {
    name: "Diego Mendoza",
    career: "Derecho",
    semester: 9,
    code: "U20204567",
    hasCv: false,
  },
  U20211234: {
    name: "Sofía Torres",
    career: "Diseño Gráfico / UX-UI",
    semester: 5,
    code: "U20211234",
    hasCv: false,
  },

  U20227890: {
    name: "Mateo Cáceres",
    career: "Ingeniería de Software",
    semester: 9,
    code: "U20227890",
    hasCv: true,
    email: "mateo.caceres@utp.edu.pe",
    phone: "+51 987 654 321",
    linkedin: "linkedin.com/in/mateocaceres",
    github: "github.com/mateocaceres",
    experienceLevel: "avanzado",
    targetRole: "Junior Software Engineer",
    hardSkills: ["TypeScript", "React", "Node.js", "Git/GitHub", "Docker", "AWS Basic"],
    softSkills: ["Comunicación efectiva", "Trabajo en equipo", "Resolución de problemas"],
    interests: ["Frontend", "Full Stack", "DevOps"],
    cvResumen: "Estudiante de Ingeniería de Software con experiencia en desarrollo full stack y despliegue cloud. Apasionado por construir productos escalables y trabajar en equipos ágiles.",
    cvFormacion: "Universidad Tecnológica del Perú (UTP) — Ingeniería de Software, 9° ciclo. Formación sólida en arquitectura de software, bases de datos y metodologías ágiles.",
    cvProyectos: "Pipeline CI/CD con GitHub Actions y Docker para despliegue en VPS. Aplicación web de gestión de tareas con React, Node.js y PostgreSQL.",
  },
  U20235678: {
    name: "Valentina Ríos",
    career: "Ingeniería de Sistemas",
    semester: 8,
    code: "U20235678",
    hasCv: true,
    email: "valentina.rios@utp.edu.pe",
    phone: "+51 987 654 322",
    linkedin: "linkedin.com/in/valentinaríos",
    github: "github.com/valentinaríos",
    experienceLevel: "intermedio",
    targetRole: "Analista de Datos",
    hardSkills: ["Python", "SQL Server", "Power BI", "Excel Avanzado", "Git/GitHub"],
    softSkills: ["Pensamiento crítico", "Organización", "Adaptabilidad"],
    interests: ["Data Analytics", "Cloud", "Backend"],
    cvResumen: "Estudiante de Ingeniería de Sistemas con enfoque en análisis de datos e inteligencia de negocios. Experiencia en proyectos académicos de extracción y visualización de datos.",
    cvFormacion: "Universidad Tecnológica del Perú (UTP) — Ingeniería de Sistemas, 8° ciclo. Cursos destacados: Minería de Datos, Estadística Aplicada, Base de Datos Avanzadas.",
    cvProyectos: "Dashboard interactivo de ventas con Power BI y SQL Server. Scripts de ETL en Python para limpieza y transformación de datos financieros.",
  },
  U20245678: {
    name: "Jose Sandoval",
    career: "Negocios Internacionales",
    semester: 9,
    code: "U20245678",
    hasCv: true,
    email: "jose.sandoval@utp.edu.pe",
    phone: "+51 987 654 323",
    linkedin: "linkedin.com/in/josesandoval",
    experienceLevel: "avanzado",
    targetRole: "Asistente de Comercio Exterior",
    hardSkills: ["Excel Financiero", "Logística Internacional", "Inglés Comercial", "Negociación", "Scrum"],
    softSkills: ["Liderazgo", "Comunicación efectiva", "Proactividad"],
    interests: ["Comercio Exterior", "Logística", "Supply Chain"],
    cvResumen: "Estudiante de Negocios Internacionales con certificación PSM I (Scrum Master) y experiencia en comercio exterior. Orientado a resultados y gestión de operaciones internacionales.",
    cvFormacion: "Universidad Tecnológica del Perú (UTP) — Negocios Internacionales, 9° ciclo. Certificación PSM I (Scrum Master). Inglés intermedio-avanzado con enfoque comercial.",
    cvProyectos: "Plan de exportación de productos peruanos a mercado asiático. Simulación de negociación internacional con empresas de Latinoamérica.",
  },
  U20256789: {
    name: "Andrea Salazar",
    career: "Psicología Organizacional",
    semester: 10,
    code: "U20256789",
    hasCv: true,
    email: "andrea.salazar@utp.edu.pe",
    phone: "+51 987 654 324",
    linkedin: "linkedin.com/in/andreasalazar",
    experienceLevel: "avanzado",
    targetRole: "Analista de Talento Humano",
    hardSkills: ["Selección de Personal", "Clima Laboral", "Evaluación de Desempeño", "Power BI básico", "Excel Intermedio"],
    softSkills: ["Empatía", "Comunicación asertiva", "Trabajo en equipo", "Organización"],
    interests: ["Selección de Talento", "Clima Laboral", "Desarrollo Organizacional"],
    cvResumen: "Estudiante de Psicología Organizacional con experiencia en procesos de selección y evaluación de clima laboral. Capacidad para diseñar e implementar estrategias de mejora organizacional.",
    cvFormacion: "Universidad Tecnológica del Perú (UTP) — Psicología Organizacional, 10° ciclo. Especialización en Gestión del Talento Humano y Evaluación Psicométrica.",
    cvProyectos: "Diseño e implementación de encuesta de clima laboral para 200 colaboradores. Programa de onboarding para practicantes en empresa retail.",
  },
  U20267890: {
    name: "Diego Farfán",
    career: "Diseño Gráfico / UX-UI",
    semester: 7,
    code: "U20267890",
    hasCv: true,
    email: "diego.farfan@utp.edu.pe",
    phone: "+51 987 654 325",
    linkedin: "linkedin.com/in/diegofarfan",
    github: "github.com/diegofarfan",
    experienceLevel: "intermedio",
    targetRole: "Diseñador UX/UI Trainee",
    hardSkills: ["Figma", "Adobe Illustrator", "Adobe Photoshop", "Prototipado", "Design Thinking", "User Research"],
    softSkills: ["Creatividad", "Empatía", "Trabajo en equipo"],
    interests: ["UX Research", "UI Design", "Design Systems"],
    cvResumen: "Estudiante de Diseño Gráfico con especialización en UX/UI. Apasionado por crear experiencias digitales intuitivas y accesibles. Portfolio con proyectos de investigación y prototipado.",
    cvFormacion: "Universidad Tecnológica del Perú (UTP) — Diseño Gráfico / UX-UI, 7° ciclo. Talleres de Design Thinking, Accesibilidad Web y Sistemas de Diseño.",
    cvProyectos: "Rediseño de app móvil de banca para adultos mayores (investigación + prototipos). Sistema de diseño para startup de e-commerce con Figma y tokens de diseño.",
  },
};

export function normalizeStudentCode(raw: string): string {
  let input = raw.normalize("NFKC").trim();
  if (!input) return "";

  if (input.includes("@")) {
    input = input.split("@")[0] ?? input;
  }

  const upper = input.toUpperCase().replace(/[\s._-]+/g, "");

  const codeMatch = upper.match(/U\d{8}/);
  if (codeMatch) return codeMatch[0];

  const digitsOnly = upper.replace(/^U?(?:TP)?/i, "");
  if (/^\d{8}$/.test(digitsOnly)) {
    return `U${digitsOnly}`;
  }

  return upper.startsWith("U") ? upper : `U${upper}`;
}

export function findStudentByCode(raw: string): MockStudent | null {
  const normalized = normalizeStudentCode(raw);
  if (!normalized) return null;
  return MOCK_STUDENTS_BY_CODE[normalized] ?? null;
}
