import { Vacancy, NetworkingContact, SocialPost, CourseCatalogItem, ExternalCourseSuggestion } from "./types";

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
  },
  {
    id: "post_04",
    authorName: "Carlos Mendoza",
    authorCareer: "Sistemas & Software (Alumni)",
    authorSemester: 10,
    avatarColor: "bg-red-700",
    content: "Estamos armando equipo para el Cloud Summit LATAM 2026. Busco 2 estudiantes UTP con conocimientos básicos de Kubernetes y muchas ganas de aprender. Ofrezco mentoría intensiva 1:1 durante las 3 semanas previas al evento. Los interesados pueden escribirme directo.",
    date: "Hace 5 horas",
    likes: 23,
    likedByUser: false,
    category: "evento",
    comments: [
      {
        authorName: "Diego Alva",
        content: "¡Me apunto! Tengo experiencia con Docker y estoy empezando con K8s.",
        date: "Hace 4 horas"
      },
      {
        authorName: "Mateo Cáceres",
        content: "Yo también quiero participar, ingeniero. Tengo base de AWS y contenedores.",
        date: "Hace 3 horas"
      }
    ]
  },
  {
    id: "post_05",
    authorName: "Andrea Salazar",
    authorCareer: "Psicología Organizacional",
    authorSemester: 10,
    avatarColor: "bg-emerald-600",
    content: "Tips de reclutamiento para sus postulaciones: El 80% de los reclutadores descarta CVs que no mencionan logros cuantificables. En lugar de poner 'Responsable de reportes', escriban 'Reduje el tiempo de entrega de reportes en un 30% usando macros de Excel'. Esto multiplica sus chances de pasar el filtro ATS.",
    date: "Hace 8 horas",
    likes: 67,
    likedByUser: true,
    category: "general",
    comments: [
      {
        authorName: "Valeria Ruiz",
        content: "Excelente consejo, Andrea. ¿Recomiendas algún formato en específico para el CV?",
        date: "Hace 7 horas"
      }
    ]
  },
  {
    id: "post_06",
    authorName: "Diana Tello",
    authorCareer: "Ingeniería de Software (Alumni UTP)",
    authorSemester: 10,
    avatarColor: "bg-purple-600",
    content: "¡Lanzamos la beta de nuestra app Xpedition Studio! 🎉 Después de 6 meses de desarrollo con un equipo de 4 personas, logramos publicar en Play Store. Fue un camino duro pero aprendí más que en cualquier curso. El tip: no subestimen el poder de un MVP bien ejecutado para conseguir inversionistas.",
    date: "Hace 1 día",
    likes: 89,
    likedByUser: false,
    category: "logro",
    comments: [
      {
        authorName: "Jose Sandoval",
        content: "Diana, increíble logro. ¿Usaron React Native o Flutter?",
        date: "Hace 20 horas"
      },
      {
        authorName: "Diana Tello",
        content: "¡Gracias, Jose! Usamos React Native con Expo. Fue clave para iterar rápido.",
        date: "Hace 19 horas"
      }
    ]
  },
  {
    id: "post_07",
    authorName: "Mateo Cáceres",
    authorCareer: "Ingeniería de Sistemas",
    authorSemester: 9,
    avatarColor: "bg-cyan-600",
    content: "Comparto mi pipeline de CI/CD que armé para el curso de Ingeniería de Software. Configuré GitHub Actions con pruebas automatizadas, linting y deploy a un VPS de DigitalOcean. Si alguien quiere guía para armar el suyo, puedo hacer un workshop gratuito este sábado.",
    date: "Hace 12 horas",
    likes: 34,
    likedByUser: false,
    category: "proyecto",
    comments: []
  },
  {
    id: "post_08",
    authorName: "Valeria Alva (Tú)",
    authorCareer: "Ingeniería de Sistemas",
    authorSemester: 7,
    avatarColor: "bg-black",
    content: "¿Alguien ha usado el simulador de entrevistas de SkillPath AI? Acabo de terminar una simulación para puesto de Junior Full Stack y me sorprendió lo preciso del feedback. Me recomendó practicar la estructura STAR para preguntas de trabajo en equipo. Muy recomendado para los que están en búsqueda de prácticas.",
    date: "Hace 30 minutos",
    likes: 15,
    likedByUser: false,
    category: "general",
    comments: [
      {
        authorName: "Diego Alva",
        content: "Sí, lo usé la semana pasada. Me ayudó a corregir mi postura al responder preguntas técnicas.",
        date: "Hace 15 minutos"
      }
    ]
  },
  {
    id: "post_09",
    authorName: "Diego Alva",
    authorCareer: "Ingeniería de Sistemas",
    authorSemester: 8,
    avatarColor: "bg-indigo-500",
    content: "¿Alguien más se inscribió al taller de 'Inglés Técnico para Entrevistas' que anunció la universidad? Empieza la próxima semana y cubre vocabulario específico para roles de TI. Creo que es justo lo que necesito para postular a las vacantes de Belcorp que compartió la Lic. Andrea.",
    date: "Hace 3 horas",
    likes: 11,
    likedByUser: false,
    category: "evento",
    comments: []
  },
  {
    id: "post_10",
    authorName: "Jose Sandoval",
    authorCareer: "Negocios Internacionales",
    authorSemester: 9,
    avatarColor: "bg-teal-500",
    content: "Después de 3 meses de preparación, aprobé el examen de certificación en Scrum Master (PSM I). El material de estudio que compartió la universidad fue suficiente, pero recomiendo complementar con simulacros en línea. Ahora estoy listo para postular a roles ágiles en proyectos internacionales.",
    date: "Hace 6 horas",
    likes: 52,
    likedByUser: true,
    category: "logro",
    comments: [
      {
        authorName: "Andrea Salazar",
        content: "¡Felicitaciones, Jose! Las certificaciones ágiles tienen alta demanda en los procesos de selección que manejamos.",
        date: "Hace 5 horas"
      },
      {
        authorName: "Valeria Ruiz",
        content: "¿Cuánto tiempo te tomó prepararte? Me interesa obtenerla también.",
        date: "Hace 4 horas"
      },
      {
        authorName: "Jose Sandoval",
        content: "Gracias, Andrea. Valeria, le dediqué unas 2 horas diarias por 3 meses. El examen no es muy difícil si practicas los simulacros.",
        date: "Hace 3 horas"
      }
    ]
  }
];

export const CERTIFICATIONS_AND_COURSES: CourseCatalogItem[] = [
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

export const EXTERNAL_COURSE_SUGGESTIONS: ExternalCourseSuggestion[] = [
  {
    id: "ext_udemy_sql",
    platform: "Udemy",
    title: "SQL para Análisis de Datos: De Cero a Experto",
    instructor: "Juan Pérez",
    price: "S/. 34.90",
    originalPrice: "S/. 199.90",
    rating: 4.7,
    students: "12,400+",
    linkedGap: "Modelamiento de Bases de Datos SQL",
    url: "https://www.udemy.com/course/sql-data-analysis/",
    highlight: "82% de descuento esta semana. Ideal para cerrar tu brecha en consultas multi-tabla exigidas por BCP e Interbank.",
  },
  {
    id: "ext_udemy_scrum",
    platform: "Udemy",
    title: "Scrum Master: Metodologías Ágiles desde Cero",
    instructor: "Ana Rodríguez",
    price: "S/. 29.90",
    originalPrice: "S/. 179.90",
    rating: 4.6,
    students: "8,900+",
    linkedGap: "Metodologías Ágiles (Scrum)",
    url: "https://www.udemy.com/course/scrum-master-agile/",
    highlight: "Curso práctico con simulaciones de sprint. Complementa lo que no cubre el convenio universitario.",
  },
  {
    id: "ext_udemy_aws",
    platform: "Udemy",
    title: "AWS Cloud Practitioner CLF-C02 — Español",
    instructor: "Cloud Academy LATAM",
    price: "S/. 39.90",
    originalPrice: "S/. 219.90",
    rating: 4.8,
    students: "21,000+",
    linkedGap: "AWS Certified Cloud Practitioner",
    url: "https://www.udemy.com/course/aws-cloud-practitioner-es/",
    highlight: "Incluye simulacros del examen oficial. Más económico que el voucher estándar si no tienes beca AWS Academy.",
  },
  {
    id: "ext_linkedin_scrum",
    platform: "LinkedIn Learning",
    title: "Fundamentos de Scrum",
    instructor: "Kelley O'Connell",
    price: "Incluido con cuenta UTP",
    rating: 4.5,
    students: "45,000+",
    linkedGap: "Metodologías Ágiles (Scrum)",
    url: "https://www.linkedin.com/learning/scrum-fundamentals",
    highlight: "Acceso gratuito con tu correo @utp.edu.pe. Recomendado antes de invertir en cursos de pago.",
  },
  {
    id: "ext_udemy_figma",
    platform: "Udemy",
    title: "Figma UI UX Design Essentials",
    instructor: "Daniel Walter Scott",
    price: "S/. 32.90",
    originalPrice: "S/. 189.90",
    rating: 4.7,
    students: "18,500+",
    linkedGap: "Diseño Gráfico / UX-UI",
    url: "https://www.udemy.com/course/figma-ui-ux-design/",
    highlight: "Ideal para carreras de diseño y comunicación. Prototipado profesional a buen precio.",
  },
  {
    id: "ext_udemy_analytics",
    platform: "Udemy",
    title: "Google Analytics 4 — De Cero a Experto",
    instructor: "MarketLab PE",
    price: "S/. 27.90",
    originalPrice: "S/. 159.90",
    rating: 4.5,
    students: "6,200+",
    linkedGap: "Google Analytics 4 & Data Studio",
    url: "https://www.udemy.com/course/google-analytics-4/",
    highlight: "Perfecto para Marketing y Negocios. Cierra brechas de analítica digital demandadas en agencias.",
  },
  {
    id: "ext_linkedin_negotiation",
    platform: "LinkedIn Learning",
    title: "Negociación y Resolución de Conflictos",
    instructor: "Lisa Gates",
    price: "Incluido con cuenta UTP",
    rating: 4.6,
    students: "32,000+",
    linkedGap: "Negociación y Resolución de Conflictos",
    url: "https://www.linkedin.com/learning/negotiation-foundations",
    highlight: "Recurso gratuito para carreras de Administración, Derecho y Negocios Internacionales.",
  },
];

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
