import { Vacancy, NetworkingContact, SocialPost } from "./types";

export const INITIAL_VACANCIES: Vacancy[] = [
  {
    id: "vac_01",
    company: "Banco de Crédito del Perú (BCP)",
    logoUrl: "BCP",
    role: "Practicante de Ingeniería de Software Backend",
    location: "Lima, Perú (Híbrido)",
    salary: "S/. 1,200 - S/. 1,500",
    matchScore: 88,
    description: "Buscamos estudiantes de ciclos finales apasionados por construir microservicios robustos, integrarse con APIs REST y aprender arquitecturas modernas basadas en la nube.",
    skillsRequired: ["SQL", "Java Spring Boot", "Git", "Trabajo en equipo", "Metodologías Ágiles"],
    skillsMissing: ["Java Spring Boot"],
    tipsForApplying: "BCP valora en gran medida el entendimiento sólido de algoritmos y el manejo avanzado de bases de datos relacionales en SQL. Destaca tus proyectos estudiantiles de sistemas en tu extracto."
  },
  {
    id: "vac_02",
    company: "Xpedition Tech Labs",
    logoUrl: "XP",
    role: "Junior Full Stack Developer (React / Node)",
    location: "Remoto (Latinoamérica)",
    salary: "$600 - $800 USD",
    matchScore: 92,
    description: "Únete a nuestro ágil equipo de desarrollo web. Participarás en sprints semanales construyendo productos digitales innovadores utilizando la pila React, Node.js y cloud hosting.",
    skillsRequired: ["React", "TypeScript", "Node.js", "Git", "Comunicación Eficaz"],
    skillsMissing: ["Node.js"],
    tipsForApplying: "Asegúrate de enlazar tus repositorios de GitHub con código limpio en tu currículum. La adaptabilidad cultural y velocidad de aprendizaje son primordiales aquí."
  },
  {
    id: "vac_03",
    company: "Alicorp S.A.",
    logoUrl: "AL",
    role: "Practicante de Inteligencia de Negocios (BI)",
    location: "Callao, Perú",
    salary: "S/. 1,300",
    matchScore: 74,
    description: "Responsable del diseño, mantenimiento y actualización de dashboards interactivos de control de ventas. Soporte directo a la toma de decisiones comerciales.",
    skillsRequired: ["Power BI", "SQL", "Excel Avanzado", "Análisis de Datos"],
    skillsMissing: ["Power BI", "Excel Avanzado"],
    tipsForApplying: "Enfatiza cualquier experiencia previa manejando grandes volúmenes de datos en Excel o SQL. Alicorp filtra candidatos buscando consistencia matemática."
  },
  {
    id: "vac_04",
    company: "Interbank",
    logoUrl: "IB",
    role: "Analista de Experiencia de Usuario (UI/UX) Trainee",
    location: "Lima, Perú (Remoto)",
    salary: "S/. 1,500 - S/. 1,800",
    matchScore: 68,
    description: "Colabora en el rediseño de flujos móviles y de banca por internet. Creación de prototipos interactivos de alta fidelidad centrados en la simplicidad del usuario peruano.",
    skillsRequired: ["Figma", "User Research", "Prototipado", "Design Thinking"],
    skillsMissing: ["Figma", "User Research"],
    tipsForApplying: "Sube un portafolio PDF o enlace de Behance/Figma donde se muestre el desarrollo completo de diseño de UX, de inicio a fin."
  }
];

export const INITIAL_NETWORKING_CONTACTS: NetworkingContact[] = [
  {
    id: "net_01",
    name: "Ing. Carlos Mendoza",
    role: "Staff Backend Architect",
    company: "Globant Latam",
    type: "mentor",
    isConnected: false,
    isPending: false,
    compatibilityText: "98% de afinidad según tus metas (Egresado UTP)",
    bio: "Más de 10 años en desarrollo de software, apasionado por Scrum, Node.js y mentoría técnica a estudiantes universitarios de sistemas."
  },
  {
    id: "net_02",
    name: "Lic. Andrea Salazar",
    role: "Senior Talent Acquisition Specialist",
    company: "Belcorp",
    type: "reclutador",
    isConnected: true,
    isPending: false,
    compatibilityText: "Recluta activamente practicantes de sistemas y administración",
    bio: "Buscando siempre nuevos talentos de universidades peruanas para integrarse a los retos de transformación digital de Belcorp."
  },
  {
    id: "net_03",
    name: "Diana Tello",
    role: "Co-fundadora & CTO",
    company: "Xpedition Studio",
    type: "mentor",
    isConnected: false,
    isPending: false,
    compatibilityText: "Mentora de Emprendimiento y Código",
    bio: "Ex-alumna apasionada de hackathons. Dispuesta a orientar estudiantes motivados sobre cómo crear portafolios de impacto y postular a startups."
  },
  {
    id: "net_04",
    name: "Mateo Cáceres",
    role: "DevOps Engineer Trainee",
    company: "BBVA Perú",
    type: "alumni",
    isConnected: false,
    isPending: true,
    compatibilityText: "Compañero universitario de 9no ciclo",
    bio: "Estudiante de Sistemas especializado en Pipelines de Automatización (AWS/Docker). Abierto a crear grupos de estudio y networking."
  }
];

export const INITIAL_COMMUNITY_POSTS: SocialPost[] = [
  {
    id: "post_01",
    authorName: "Diego Alva",
    authorCareer: "Ingeniería de Sistemas",
    authorSemester: 8,
    avatarColor: "bg-indigo-500",
    content: "¡Orgulloso de compartir mi nuevo proyecto escolar! Desarrollé un portal de consulta de notas con Node y React. Logré optimizar las queries con índices SQL dinámicos reduciendo el tiempo de carga un 40%. ¿Alguien que se sume a validarlo y darme feedback de código?",
    date: "Hace 2 horas",
    likes: 12,
    likedByUser: false,
    category: "proyecto",
    comments: [
      {
        authorName: "Ing. Carlos Mendoza",
        content: "Excelente iniciativa, Diego. Agrégale pruebas unitarias en Jest y es un candidato ideal para tu portafolio.",
        date: "Hace 1 hora"
      }
    ]
  },
  {
    id: "post_02",
    authorName: "Valeria Ruiz",
    authorCareer: "Diseño Publicitario",
    authorSemester: 6,
    avatarColor: "bg-pink-500",
    content: "¡Completé la certificación oficial de AWS Certified Cloud Practitioner! 🚀 No dejen de aplicar al programa AWS Academy para estudiantes universitarios, los vouchers tienen descuento o salen gratis.",
    date: "Ayer",
    likes: 45,
    likedByUser: true,
    category: "logro",
    comments: []
  },
  {
    id: "post_03",
    authorName: "Jose Sandoval",
    authorCareer: "Negocios Internacionales",
    authorSemester: 9,
    avatarColor: "bg-teal-500",
    content: "Hola a todos, estoy buscando un compañero especializado en frontend para participar en la Hackathon de UTP & Xpedition de este fin de semana. Tenemos lista la idea del producto y modelo de negocio, ¡escríbanme al inbox!",
    date: "Hace 2 días",
    likes: 8,
    likedByUser: false,
    category: "ayuda",
    comments: []
  }
];

export const CERTIFICATIONS_AND_COURSES = [
  {
    title: "SQL y Gestión de Datos",
    provider: "SkillPath AI Academy",
    badge: "Básico - Intermedio",
    duration: "12 horas",
    pointsAwarded: 150,
    cost: "Gratis con UTP Account",
    url: "#"
  },
  {
    title: "AWS Certified Cloud Practitioner Pathway",
    provider: "AWS Educate",
    badge: "Oficial Internacional",
    duration: "20 horas",
    pointsAwarded: 300,
    cost: "Voucher Estudiantil disponible",
    url: "#"
  },
  {
    title: "Figma Masterclass: UX Design Fundamentals",
    provider: "Coursera & Google",
    badge: "Especialización Profesional",
    duration: "18 horas",
    pointsAwarded: 200,
    cost: "Subvencionado por Rectorado",
    url: "#"
  },
  {
    title: "Comunicación de Impacto y Storytelling",
    provider: "Xpedition Soft Skills Bootcamps",
    badge: "Taller Práctico",
    duration: "6 horas",
    pointsAwarded: 100,
    cost: "100% de beca activa",
    url: "#"
  }
];

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
