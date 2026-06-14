import { Vacancy, NetworkingContact, SocialPost, CourseCatalogItem, ExternalCourseSuggestion } from "./types";
import {
  CATALOG_EXTRAS,
  EXTERNAL_COURSE_SUGGESTIONS_STATIC,
  INITIAL_VACANCIES_STATIC,
  INITIAL_NETWORKING_CONTACTS_STATIC,
  INITIAL_COMMUNITY_POSTS_STATIC,
} from "./staticAppData";

export const INITIAL_VACANCIES: Vacancy[] = INITIAL_VACANCIES_STATIC;

export const INITIAL_NETWORKING_CONTACTS: NetworkingContact[] = INITIAL_NETWORKING_CONTACTS_STATIC;

export const INITIAL_COMMUNITY_POSTS: SocialPost[] = INITIAL_COMMUNITY_POSTS_STATIC;

const BASE_CERTIFICATIONS: CourseCatalogItem[] = [
  {
    id: "course_sql_01",
    title: "SQL y Gestión de Datos",
    provider: "UTP",
    badge: "Básico - Intermedio",
    duration: "12 horas",
    pointsAwarded: 150,
    cost: "Gratis con UTP Account",
    url: "#",
    source: "internal",
    linkedGap: "Modelamiento de Bases de Datos SQL",
    description: "Domina consultas SQL, modelamiento relacional y optimización de queries para entrevistas técnicas en banca y fintech.",
    image: "https://www.mercadonegro.pe/wp-content/uploads/2020/10/cursos-online-consejos-1.jpg",
    code: "44605",
    modality: "Presencial",
    speaker: "Rodolfo Junior Miranda Saldaña",
    modules: [
      {
        id: "sql_m1",
        title: "Fundamentos de Bases de Datos",
        lessons: [
          { id: "sql_l1", title: "Introducción al modelamiento relacional", duration: "25 min" },
          { id: "sql_l2", title: "Tipos de datos y restricciones", duration: "30 min" },
          { id: "sql_l3", title: "Diagramas ER en la práctica", duration: "35 min" },
        ],
      },
      {
        id: "sql_m2",
        title: "Consultas y Joins",
        lessons: [
          { id: "sql_l4", title: "SELECT, WHERE y ORDER BY", duration: "40 min" },
          { id: "sql_l5", title: "INNER y LEFT JOIN multi-tabla", duration: "45 min" },
          { id: "sql_l6", title: "Subconsultas y agregaciones", duration: "50 min" },
        ],
      },
    ],
  },
  {
    id: "course_aws_01",
    title: "AWS Certified Cloud Practitioner",
    provider: "Google",
    badge: "Oficial Internacional",
    duration: "6 Meses",
    pointsAwarded: 300,
    cost: "Gratuito - Beca UTP+",
    url: "#",
    source: "partner",
    linkedGap: "AWS Certified Cloud Practitioner",
    description: "Ruta oficial para comprender servicios core de AWS, facturación y arquitecturas cloud orientadas a certificación.",
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTGroM5alXxC6mvrtcu1PlwC4E3fdM0ao6ElR52sKciEg&s=10",
    code: "G-9021",
    modality: "Virtual",
    speaker: "Google Career Staff",
    modules: [
      {
        id: "aws_m1",
        title: "Cloud Concepts",
        lessons: [
          { id: "aws_l1", title: "¿Qué es la computación en la nube?", duration: "20 min" },
          { id: "aws_l2", title: "Modelos IaaS, PaaS y SaaS", duration: "25 min" },
        ],
      },
      {
        id: "aws_m2",
        title: "Servicios AWS Core",
        lessons: [
          { id: "aws_l3", title: "EC2, S3 y RDS en producción", duration: "55 min" },
          { id: "aws_l4", title: "IAM y seguridad básica", duration: "40 min" },
        ],
      },
    ],
  },
  {
    id: "course_figma_01",
    title: "Microsoft Azure Fundamentals (AZ-900)",
    provider: "Microsoft",
    badge: "Especialización Profesional",
    duration: "4 Semanas",
    pointsAwarded: 200,
    cost: "Gratuito - Beca UTP+",
    url: "#",
    source: "partner",
    description: "Aprende investigación de usuarios, wireframes y prototipos de alta fidelidad con estándares de la industria.",
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTgutvMMFvRtDpuIo854Kan2v9B1x8t9RHziktMRA1QhuqTV-liPhRa5BrK&s=10",
    code: "M-1090",
    modality: "Virtual",
    speaker: "Marta Gómez (Microsoft MVP)",
    modules: [
      {
        id: "fig_m1",
        title: "Research & Wireframing",
        lessons: [
          { id: "fig_l1", title: "Entrevistas de usuario", duration: "30 min" },
          { id: "fig_l2", title: "Wireframes de baja fidelidad", duration: "35 min" },
        ],
      },
    ],
  },
  {
    id: "course_scrum_01",
    title: "Inteligencia Artificial Aplicada",
    provider: "UTP",
    badge: "Taller Práctico",
    duration: "12 Semanas",
    pointsAwarded: 100,
    cost: "100% de beca activa",
    url: "#",
    source: "internal",
    linkedGap: "Metodologías Ágiles (Scrum)",
    description: "Desarrolla habilidades de comunicación ejecutiva y storytelling para entrevistas y presentaciones de proyectos.",
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRLlaXZxhrDiHRqs0Dn5NXijE7BQIKOkcUbqtVGqid36RytaR53NeDNm3E&s=10",
    code: "30291",
    modality: "Híbrido",
    speaker: "Dra. Maria Elena Ruiz",
    modules: [
      {
        id: "comm_m1",
        title: "Comunicación Profesional",
        lessons: [
          { id: "comm_l1", title: "Estructura STAR para entrevistas", duration: "20 min" },
          { id: "comm_l2", title: "Storytelling con datos", duration: "25 min" },
        ],
      },
    ],
  },
];

export const CERTIFICATIONS_AND_COURSES: CourseCatalogItem[] = [
  ...CATALOG_EXTRAS,
  ...BASE_CERTIFICATIONS,
];

export const EXTERNAL_COURSE_SUGGESTIONS: ExternalCourseSuggestion[] = EXTERNAL_COURSE_SUGGESTIONS_STATIC;

export const UTP_CAREERS = [
  "Ingeniería de Sistemas",
  "Ingeniería de Software",
  "Administración",
  "Marketing",
  "Diseño Gráfico / UX-UI",
  "Diseño Publicitario",
  "Arquitectura",
  "Derecho",
  "Negocios Internacionales",
  "Psicología Organizacional",
  "Ciencias de la Comunicación",
] as const;

export const CAREER_TYPICAL_SKILLS: Record<string, string[]> = {
  "Ingeniería de Sistemas": ["HTML/CSS", "JavaScript", "SQL Server", "TypeScript", "Python", "React", "Node.js", "Git/GitHub", "Metodologías Ágiles", "AWS Basic"],
  "Ingeniería de Software": ["HTML/CSS", "JavaScript", "TypeScript", "React", "Node.js", "Git/GitHub", "Scrum", "Testing", "APIs REST"],
  "Administración": ["Excel Intermedio", "Power BI básico", "Gestión de Proyectos", "Presupuestos", "Scrum", "Inglés Intermedio", "Liderazgo"],
  "Marketing": ["Google Analytics", "Facebook Ads", "Copywriting", "SEO/SEM", "Canva/Photoshop", "Email Marketing", "Estrategia Digital"],
  "Diseño Gráfico / UX-UI": ["Figma", "Adobe Illustrator", "Prototipado", "Design Thinking", "Adobe Photoshop", "User Research", "Wireframing"],
  "Diseño Publicitario": ["Figma", "Adobe Illustrator", "Photoshop", "Branding", "Copywriting", "Redes Sociales", "Motion Graphics"],
  "Arquitectura": ["AutoCAD", "Revit", "Sketchup", "Renderizado 3D", "Control de Obras", "Diseño Sostenible"],
  "Derecho": ["Redacción Jurídica", "Litigación Oral", "Investigación Legal", "Mediación", "Derecho Corporativo"],
  "Negocios Internacionales": ["Excel Financiero", "Logística Internacional", "Aduanas", "Inglés Comercial", "Negociación"],
  "Psicología Organizacional": ["Selección de Personal", "Clima Laboral", "Coaching", "Evaluación de Desempeño", "Comunicación Asertiva"],
  "Ciencias de la Comunicación": ["Redacción Creativa", "Edición de Video", "Community Management", "Relaciones Públicas", "Fotografía"],
};

export const CAREER_SUGGESTED_ROLES: Record<string, string[]> = {
  "Ingeniería de Sistemas": ["Full Stack Developer Junior", "Analista de Datos", "Backend Developer Trainee", "DevOps Engineer Junior", "QA Analyst"],
  "Ingeniería de Software": ["Junior Software Engineer", "Frontend Developer Trainee", "Full Stack Developer Junior", "Mobile Developer Junior"],
  "Administración": ["Analista de Procesos", "Asistente de Recursos Humanos", "Project Manager Junior", "Administrador de Operaciones"],
  "Marketing": ["Social Media Analyst", "Growth Marketing Specialist", "Asistente de Marketing Digital", "SEO Copywriter"],
  "Diseño Gráfico / UX-UI": ["Diseñador UX/UI Trainee", "Product Designer Junior", "Diseñador Gráfico Digital", "Content Creator"],
  "Diseño Publicitario": ["Diseñador Gráfico Junior", "Art Director Trainee", "Community Manager Visual", "Motion Designer Junior"],
  "Arquitectura": ["Asistente de Diseñador Arquitectónico", "Modelador BIM Junior", "Supervisor de Obras Junior"],
  "Derecho": ["Asistente Legal Corporativo", "Consultor Contractual Junior", "Practicante Judicial"],
  "Negocios Internacionales": ["Asistente de Comercio Exterior", "Analista de Inteligencia Comercial", "Supply Chain Trainee"],
  "Psicología Organizacional": ["Analista de Talento Humano", "Asistente de Selección", "Coordinador de Clima Laboral"],
  "Ciencias de la Comunicación": ["Redactor Creativo", "Especialista en PR / Comunicaciones", "Coordinador de Audiovisuales"],
};

export function getDefaultTargetRole(career: string): string {
  return CAREER_SUGGESTED_ROLES[career]?.[0] ?? "Practicante Profesional";
}

export { MOCK_STUDENTS_BY_CODE, findStudentByCode } from "./mockStudents";
export type { MockStudent } from "./mockStudents";

export const GENERIC_SOFT_SKILLS = [
  "Comunicación efectiva",
  "Trabajo en equipo",
  "Liderazgo",
  "Resolución de problemas",
  "Organización",
  "Adaptabilidad",
  "Pensamiento crítico",
  "Proactividad",
  "Gestión del tiempo",
  "Empatía",
];

export const CAREER_SPECIALIZATION_TAGS: Record<string, string[]> = {
  "Ingeniería de Sistemas": ["Desarrollo Web", "Backend", "Cloud", "Ciberseguridad", "Data Analytics", "DevOps"],
  "Ingeniería de Software": ["Frontend", "Mobile", "Full Stack", "QA", "Arquitectura de Software"],
  Administración: ["Gestión de Proyectos", "Finanzas", "Operaciones", "Consultoría", "Recursos Humanos"],
  Marketing: ["Marketing Digital", "Branding", "E-commerce", "Contenido", "Investigación de Mercados"],
  "Diseño Gráfico / UX-UI": ["UX Research", "UI Design", "Prototipado", "Design Systems", "Accesibilidad"],
  "Diseño Publicitario": ["Branding", "Publicidad Digital", "Motion", "Copywriting Visual"],
  Arquitectura: ["Diseño Sostenible", "BIM", "Urbanismo", "Interiorismo", "Gestión de Obras"],
  Derecho: ["Derecho Corporativo", "Litigación", "Compliance", "Propiedad Intelectual"],
  "Negocios Internacionales": ["Comercio Exterior", "Logística", "Negociación", "Supply Chain"],
  "Psicología Organizacional": ["Selección de Talento", "Clima Laboral", "Coaching", "Desarrollo Organizacional"],
  "Ciencias de la Comunicación": ["Audiovisual", "Relaciones Públicas", "Periodismo Digital", "Community Management"],
};

export const UNIVERSITY_EVENTS = [
  {
    title: "Hackathon Universitaria UTP & Xpedition 2026",
    date: "14 y 15 de Junio - Presencial",
    location: "Campus Lima Centro",
    type: "Hackathon",
    desc: "Crea soluciones disruptivas de impacto social y empleabilidad tecnológica."
  },
  {
    title: "Feria de Empleo de Innovación y Tecnología TechLaunch",
    date: "18 de Junio - Virtual",
    location: "Plataforma de Videollamada UTP",
    type: "Feria de Carrera",
    desc: "Entrevistas express de 5 minutos con reclutadores de BCP, Interbank y Globant."
  }
];
