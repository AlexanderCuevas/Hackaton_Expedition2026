import React, { useState } from "react";
import { SocialPost, NetworkingContact } from "../types";
import { useNotification } from "../context/NotificationContext";
import { 
  Users, MessageSquare, ThumbsUp, Sparkles, Send, Tag, Share2, 
  Search, PlusCircle, Check, Briefcase, GraduationCap, Trophy,
  User, HeartHandshake, X, List, ArrowUpRight, Linkedin, Github, Globe,
  MessageCircle, UserPlus, Zap, FolderGit2, MapPin, Radio
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { INITIAL_COMMUNITY_POSTS, INITIAL_NETWORKING_CONTACTS } from "../data";
import { NavBar } from "./ui/tubelight-navbar";
import { FeedView } from "./ui/feed-view";
import { Button } from "./ui/button";


const COMMUNITY_USER_PROFILES: Record<string, any> = {
  "Diego Alva": {
    name: "Diego Alva",
    career: "Ingeniería de Sistemas",
    semester: 8,
    avatarColor: "bg-black text-[#B50E30] border-black",
    targetRole: "Backend Developer Trainee",
    bio: "Apasionado por la optimización de código y la arquitectura de datos relacionales en SQL Server. Busco oportunidades corporativas de desarrollo.",
    skills: ["React", "NodeJS", "TypeScript", "SQL Server", "Git", "Jest"],
    level: 3,
    xp: 480,
    type: "Estudiante UTP"
  },
  "Valeria Ruiz": {
    name: "Valeria Ruiz",
    career: "Diseño Publicitario",
    semester: 6,
    avatarColor: "bg-[#B50E30] text-white border-[#B50E30]",
    targetRole: "UX/UI Designer Junior",
    bio: "Fascinada por el diseño centrado en el usuario, el prototipado rápido en Figma y las arquitecturas de la nube aplicadas a productos digitales.",
    skills: ["Figma", "User Research", "Adobe Illustrator", "Storytelling", "AWS Cloud"],
    level: 2,
    xp: 290,
    type: "Estudiante UTP"
  },
  "Jose Sandoval": {
    name: "Jose Sandoval",
    career: "Negocios Internacionales",
    semester: 9,
    avatarColor: "bg-black text-white border-black",
    targetRole: "Analista de Proyectos Comerciales",
    bio: "Líder de equipos orientado al logro de indicadores de mercado. Disfruto uniendo tecnología y estrategia comercial para acelerar startups.",
    skills: ["Design Thinking", "Gestión de Proyectos", "Scrum", "Business Strategy", "English"],
    level: 4,
    xp: 610,
    type: "Estudiante UTP"
  },
  "Carlos Mendoza": {
    name: "Ing. Carlos Mendoza",
    career: "Sistemas & Software (Alumni)",
    semester: 10,
    avatarColor: "bg-[#B50E30] text-white border-[#B50E30]",
    targetRole: "Staff Backend Architect @ Globant",
    bio: "Más de 10 años diseñando microservicios robustos a gran escala en Latinoamérica. Apasionado de la mentoría técnica universitaria.",
    skills: ["Kubernetes", "AWS Cloud", "NodeJS", "TypeScript", "Java Spring Boot", "Scrum"],
    level: 8,
    xp: 4500,
    type: "Mentor Destacado"
  },
  "Andrea Salazar": {
    name: "Lic. Andrea Salazar",
    career: "Psicología Organizacional",
    semester: 10,
    avatarColor: "bg-black text-[#B50E30] border-black",
    targetRole: "Senior Talent Acquisition Specialist @ Belcorp",
    bio: "Comprometida con la identificación de perfiles de alto valor integrando metodologías ágiles y evaluaciones STAR de impacto.",
    skills: ["Selección de Talento IT", "LinkedIn Recruiting", "Método STAR", "Oratoria de Impacto"],
    level: 7,
    xp: 3200,
    type: "Reclutador Corporativo"
  },
  "Diana Tello": {
    name: "Diana Tello",
    career: "Ingeniería de Software (Alumni UTP)",
    semester: 10,
    avatarColor: "bg-black text-white border-black",
    targetRole: "Co-fundadora & CTO @ Xpedition Studio",
    bio: "Ex-alumna apasionada de hackathons académicas. Dispuesta a orientar estudiantes en el armado de portafolios disruptivos.",
    skills: ["React Native", "Firebase", "Startup Funding", "Python", "Agile Leadership"],
    level: 9,
    xp: 5900,
    type: "Mentor Destacado"
  },
  "Mateo Cáceres": {
    name: "Mateo Cáceres",
    career: "Ingeniería de Sistemas",
    semester: 9,
    avatarColor: "bg-[#B50E30] text-white border-[#B50E30]",
    targetRole: "DevOps Engineer Trainee @ BBVA Perú",
    bio: "Apasionado por la automatización de procesos, Infraestructura como Código y contenedores híbridos con Docker.",
    skills: ["GitLab CI", "AWS Foundations", "Docker", "Sistemas Operativos", "Bash Scripting"],
    level: 3,
    xp: 520,
    type: "Alumni Junior"
  },
  "Carlos Gutiérrez": {
    name: "Carlos Gutiérrez",
    career: "Negocios Internacionales (Alumni)",
    semester: 10,
    avatarColor: "bg-black text-white border-black",
    targetRole: "Supply Chain Manager @ Alicorp",
    bio: "Más de 10 años liderando operaciones de cadena de suministro en Alicorp. Apasionado por la transformación digital logística y la mentoría de nuevos talentos.",
    skills: ["Supply Chain Management", "SAP ERP", "Logística Internacional", "Negociación", "Power BI", "Liderazgo"],
    level: 8,
    xp: 4200,
    type: "Mentor Destacado"
  },
  "Mariana López": {
    name: "Mariana López",
    career: "Psicología Organizacional",
    semester: 10,
    avatarColor: "bg-[#B50E30] text-white border-[#B50E30]",
    targetRole: "Talent Acquisition Logistics @ DHL",
    bio: "Especialista en reclutamiento de perfiles logísticos y comercio exterior. Buscando talento joven con visión internacional.",
    skills: ["Reclutamiento Especializado", "LinkedIn Recruiting", "Evaluación por Competencias", "Logística"],
    level: 6,
    xp: 2800,
    type: "Reclutador Corporativo"
  },
  "Fernando Rivas": {
    name: "Fernando Rivas",
    career: "Negocios Internacionales (Alumni)",
    semester: 10,
    avatarColor: "bg-black text-[#B50E30] border-black",
    targetRole: "Director de Comercio Exterior @ CCL",
    bio: "15+ años impulsando la internacionalización de empresas peruanas. Mentor UTP+ apasionado por formar a la próxima generación de líderes COMEX.",
    skills: ["Comercio Exterior", "Negociación Internacional", "Incoterms", "Gestión Aduanera", "Inglés Avanzado", "Mentoría"],
    level: 9,
    xp: 5100,
    type: "Mentor Destacado"
  },
  "Lucía Fernández": {
    name: "Lucía Fernández",
    career: "Negocios Internacionales",
    semester: 10,
    avatarColor: "bg-[#B50E30] text-white border-[#B50E30]",
    targetRole: "Jefa de Exportaciones @ AgroPerú Export",
    bio: "Liderando el equipo de exportaciones de AgroPerú. Comprometida con el desarrollo del comercio exterior peruano y la formación de nuevos talentos.",
    skills: ["Exportaciones", "Gestión Aduanera", "Documentación Internacional", "Negociación", "Logística"],
    level: 7,
    xp: 3500,
    type: "Alumni Senior"
  }
};

interface SocialHubProps {
  career?: string;
  interests?: string[];
}

const CAREER_KEYWORDS: Record<string, string[]> = {
  "Negocios Internacionales": ["COMEX", "Comercio Exterior", "Logística", "Supply Chain", "Aduana", "Exportación", "Alicorp", "DHL", "Cámara de Comercio", "AgroPerú"],
  "Ingeniería de Sistemas": ["Backend", "Sistemas", "Developer", "Tech Lead", "DevOps", "Globant", "BBVA"],
  "Ingeniería de Software": ["Developer", "Software", "Frontend", "Full Stack", "Mobile", "CTO"],
  "Marketing": ["Marketing", "Growth", "Rappi", "GA4", "Publicidad"],
};

function sortContactsByRelevance(contacts: NetworkingContact[], career?: string, interests?: string[]): NetworkingContact[] {
  if (!career && !interests?.length) return contacts;

  const relevantKeywords = [
    ...(CAREER_KEYWORDS[career || ""] || []),
    ...(interests?.map(i => i.toLowerCase()) || []),
  ];

  if (relevantKeywords.length === 0) return contacts;

  return [...contacts].sort((a, b) => {
    const textA = `${a.role} ${a.company} ${a.compatibilityText} ${a.bio}`.toLowerCase();
    const textB = `${b.role} ${b.company} ${b.compatibilityText} ${b.bio}`.toLowerCase();
    const scoreA = relevantKeywords.filter(k => textA.includes(k.toLowerCase())).length;
    const scoreB = relevantKeywords.filter(k => textB.includes(k.toLowerCase())).length;
    return scoreB - scoreA;
  });
}

export default function SocialHub({ career, interests }: SocialHubProps) {
  const { addNotification } = useNotification();
  const [posts, setPosts] = useState<SocialPost[]>(INITIAL_COMMUNITY_POSTS);
  const sortedContacts = sortContactsByRelevance(INITIAL_NETWORKING_CONTACTS, career, interests);
  const [contacts, setContacts] = useState<NetworkingContact[]>(sortedContacts);
  
  const [selectedUserProfile, setSelectedUserProfile] = useState<any | null>(null);
  
  const [connectedProfiles, setConnectedProfiles] = useState<Record<string, boolean>>({});

  const [newPostContent, setNewPostContent] = useState("");
  const [newPostCategory, setNewPostCategory] = useState<SocialPost["category"]>("proyecto");
  const [showCreateModal, setShowCreateModal] = useState(false);

  const [activeCategory, setActiveCategory] = useState<"todo" | SocialPost["category"]>("todo");

  const [activeSegment, setActiveSegment] = useState<"comunidad" | "networking">("comunidad");

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.12 },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: "easeOut" as const },
    },
  };

  const openProfile = (name: string, fallbackData?: any) => {
    let cleanName = name.replace(" (Tú)", "").trim();
    if (cleanName === "Tú" || cleanName === "Valeria Alva (Tú)" || cleanName === "Valeria Alva") {
      setSelectedUserProfile({
        name: "Valeria Alva (Tú)",
        career: "Ingeniería de Sistemas",
        semester: 7,
        avatarColor: "bg-black text-white border-black",
        targetRole: "Junior Full Stack Developer",
        bio: "Estudiante motivada y apasionada de la UTP. Optimizando el uso del método STAR y desarrollando habilidades cloud y de bases de datos.",
        skills: ["HTML/CSS", "JavaScript", "SQL Server", "TypeScript", "React"],
        level: 2,
        xp: 320,
        type: "Tú (Estudiante)"
      });
      return;
    }

    const matched = COMMUNITY_USER_PROFILES[cleanName] || COMMUNITY_USER_PROFILES[name];
    if (matched) {
      setSelectedUserProfile(matched);
    } else {
      setSelectedUserProfile({
        name: cleanName,
        career: fallbackData?.career || "Ingeniería de Sistemas",
        semester: fallbackData?.semester || 7,
        avatarColor: fallbackData?.avatarColor || "bg-[#B50E30] text-white border-[#B50E30]",
        targetRole: fallbackData?.targetRole || "Estudiante UTP",
        bio: "Colaborador activo de la comunidad académica aportando ideas para desafíos de ingeniería.",
        skills: ["Bases de Datos", "Metodologías Ágiles", "Frontend Core"],
        level: 2,
        xp: 180,
        type: "Estudiante UTP"
      });
    }
  };

  const handleUserProfileConnect = (username: string) => {
    setConnectedProfiles(prev => ({ ...prev, [username]: true }));
    
    setContacts(prev =>
      prev.map(c => {
        if (c.name.includes(username) || username.includes(c.name)) {
          return { ...c, isConnected: true };
        }
        return c;
      })
    );

    addNotification({
      type: "connection_accepted",
      title: "Conexión establecida",
      description: `Ahora estás conectado con ${username.replace(" (Tú)", "").trim()}`,
      actorName: username,
    });
  };

  const handleLike = (postId: string) => {
    setPosts(prevPosts => 
      prevPosts.map(p => {
        if (p.id === postId) {
          const liked = !p.likedByUser;
          return {
            ...p,
            likedByUser: liked,
            likes: liked ? p.likes + 1 : p.likes - 1
          };
        }
        return p;
      })
    );
  };

  const handleCreatePost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPostContent.trim()) return;

    const newPost: SocialPost = {
      id: `p_${Date.now()}`,
      authorName: "Valeria Alva (Tú)",
      authorCareer: "Ingeniería de Sistemas",
      authorSemester: 7,
      avatarColor: "bg-black text-[#B50E30]",
      content: newPostContent,
      category: newPostCategory,
      date: "Hace unos instantes",
      likes: 0,
      likedByUser: false,
      comments: []
    };

    setPosts([newPost, ...posts]);
    setNewPostContent("");
    setShowCreateModal(false);
  };

  const handleConnect = (contactId: string) => {
    let contactName = "";
    setContacts(prev =>
      prev.map(c => {
        if (c.id === contactId) {
          if (!c.isConnected && !c.isPending) {
            contactName = c.name;
            return { ...c, isPending: true };
          }
        }
        return c;
      })
    );

    if (contactName) {
      addNotification({
        type: "connection_request",
        title: "Solicitud de conexión enviada",
        description: `Has solicitado conectar con ${contactName}`,
        actorName: contactName,
      });
    }
  };

  const postsByCareer = career
    ? posts.filter(p => {
        const careerMatch = p.authorCareer?.toLowerCase().includes(career.toLowerCase());
        const generalPost = ["Empleabilidad", "General", ""].includes(p.authorCareer || "");
        return careerMatch || generalPost;
      })
    : posts;
  const hasCareerPosts = career && postsByCareer.length >= 2;
  const displayPosts = hasCareerPosts ? postsByCareer : posts;
  const filteredPosts = activeCategory === "todo" 
    ? displayPosts 
    : displayPosts.filter(p => p.category === activeCategory);

  /* ─── Profile Modal Content ─── */
  function ProfileModalContent({
    profile,
    onClose,
  }: {
    profile: any;
    onClose: () => void;
  }) {
    const rawName = profile.name?.replace(" (Tú)", "").replace("Ing. ", "").replace("Lic. ", "") || "";
    const nameParts = rawName.trim().split(" ");
    const initials = nameParts.map((n: string) => n[0]).join("").substring(0, 2).toUpperCase();
    const firstName = nameParts[0] || "";
    const lastName = nameParts.slice(1).join(" ") || "";
    const role = profile.targetRole || "";
    const skills: string[] = profile.skills || [];
    const stack = skills.slice(0, 5).join(" · ") + (skills.length > 5 ? " · +" + (skills.length - 5) : "");
    const career = profile.career || "";
    const semester = profile.semester || 1;
    const type = profile.type || "Estudiante UTP";
    const xp = profile.xp || 0;
    const level = profile.level || 1;
    const bio = profile.bio || "";
    const isSelf = profile.name?.includes("Tú") || false;
    const isAlreadyConnected = connectedProfiles[profile.name] || false;
    const projectCount = posts.filter(p => p.category === "proyecto" && p.authorName.includes(rawName)).length;
    const logroCount = posts.filter(p => p.category === "logro" && p.authorName.includes(rawName)).length;
    const conexCount = contacts.filter(c => c.isConnected).length;
    const userPosts = posts.filter(p => p.authorName.includes(rawName));
    const recentPosts = userPosts.length > 0
      ? userPosts.slice(0, 5).map(p => p.content || "")
      : ["Proyecto de API REST con autenticación JWT", "Logro: Certificación en React Avanzado", "Nuevo proyecto: Dashboard en tiempo real"];
    const contactList = contacts.map(c => ({
      name: c.name,
      role: c.role + " · " + c.company,
      level: (c.name.length * 7 + 3) % 15 + 3,
    }));

    const TABS = ["Perfil", "Actividad", "Conexiones"] as const;
    type Tab = (typeof TABS)[number];
    const [tab, setTab] = useState<Tab>("Perfil");

    function Label({ children }: { children: React.ReactNode }) {
      return <span className="text-[9px] font-black uppercase tracking-[0.2em] text-[#B50E30]">{children}</span>;
    }
    function Divider() {
      return <div className="h-px w-full bg-neutral-200" />;
    }
    function StatBlock({ value, label }: { value: string | number; label: string }) {
      return (
        <div className="flex flex-col gap-0.5">
          <span className="text-3xl font-black text-neutral-900 leading-none tracking-tighter">{value}</span>
          <Label>{label}</Label>
        </div>
      );
    }
    function SectionRow({ label, count, children }: { label: string; count?: number; children?: React.ReactNode }) {
      return (
        <div className="flex items-center gap-3 mb-4">
          <Label>{label}</Label>
          <div className="flex-1 h-px bg-neutral-100" />
          {count !== undefined && <span className="text-[9px] font-black text-neutral-300">{count}</span>}
          {children}
        </div>
      );
    }

    /* left panel */
    const LeftPanel = () => (
      <div
        className="relative flex flex-col w-full md:w-64 md:shrink-0 overflow-hidden overflow-y-auto max-h-[42vh] md:max-h-none"
        style={{ background: "linear-gradient(160deg, #fdf4f4 0%, #fafafa 60%, #fdf6f5 100%)", borderRight: "1px solid #e2e0dd", scrollbarWidth: "none" }}
      >
        <div className="h-[3px] w-full shrink-0" style={{ background: "linear-gradient(90deg, #B50E30, transparent)" }} />
        <div className="px-8 pt-10 pb-6 shrink-0">
          <div className="relative w-fit">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1, type: "spring", damping: 16, stiffness: 200 }}
              className="h-20 w-20 flex items-center justify-center text-white text-2xl font-black"
              style={{ background: "linear-gradient(135deg, #B50E30 0%, #7a091f 100%)" }}
            >
              {initials}
            </motion.div>
            <div className="absolute -bottom-1 -right-1 h-4 w-4 flex items-center justify-center" style={{ background: "#fafafa" }}>
              <Radio className="h-3 w-3 text-emerald-400" style={{ fill: "rgba(52,211,153,0.3)" }} />
            </div>
          </div>
        </div>
        <Divider />
        <div className="px-8 py-6 flex flex-col gap-1 shrink-0">
          <motion.div initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.15 }}>
            <p className="text-[28px] font-black text-neutral-900 leading-none tracking-tighter uppercase">{firstName}</p>
            <p className="text-[28px] font-black leading-none tracking-tighter uppercase" style={{ color: "#B50E30" }}>{lastName}</p>
          </motion.div>
          <div className="mt-2 flex flex-col gap-0.5">
            <span className="text-xs font-semibold text-neutral-700">{role}</span>
            <span className="text-[11px] text-neutral-400 font-medium">{stack}</span>
          </div>
          <div className="mt-3 flex items-center gap-1.5">
            <MapPin className="h-3 w-3 text-neutral-400" />
            <span className="text-[11px] text-neutral-400 font-medium">Lima, Perú</span>
          </div>
        </div>
        <Divider />
        <div className="px-8 py-4 flex flex-col gap-2 shrink-0">
          <Label>Rol</Label>
          <span className="text-[10px] font-black tracking-widest text-white px-2 py-1 w-fit whitespace-nowrap" style={{ background: "#B50E30" }}>
            {type}
          </span>
          <div className="flex items-center gap-1.5 mt-1">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-[10px] text-emerald-500 font-bold">Disponible</span>
          </div>
        </div>
        <Divider />
        <div className="px-8 py-5 grid grid-cols-2 gap-x-4 gap-y-5 shrink-0">
          <StatBlock value={xp.toLocaleString()} label="XP Total" />
          <StatBlock value={`L${level}`} label="Nivel" />
          <StatBlock value={conexCount} label="Contactos" />
          <StatBlock value={`${semester}°`} label="Ciclo" />
        </div>
        <Divider />
        <div className="px-8 py-5 flex flex-col gap-2.5 shrink-0">
          <Label>Redes</Label>
          {[
            { icon: <Linkedin className="h-3.5 w-3.5" />, label: "LinkedIn" },
            { icon: <Github className="h-3.5 w-3.5" />, label: "GitHub" },
            { icon: <Globe className="h-3.5 w-3.5" />, label: "Portafolio" },
          ].map(({ icon, label }) => (
            <button key={label} className="flex items-center justify-between text-neutral-500 hover:text-neutral-900 text-xs font-semibold transition-colors duration-150 group">
              <span className="flex items-center gap-2">{icon}{label}</span>
              <ArrowUpRight className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
            </button>
          ))}
        </div>
        <div className="mt-auto px-8 py-4 border-t border-neutral-200 shrink-0">
          <span className="text-[9px] font-black tracking-widest text-neutral-400">UTP-{xp + 1092}</span>
        </div>
      </div>
    );

    /* tabs */
    const TabPerfil = () => (
      <motion.div key="perfil" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.18 }} className="flex flex-col gap-8">
        <section>
          <SectionRow label="Acerca de" />
          <p className="text-neutral-600 leading-relaxed text-sm">{bio}</p>
          <div className="mt-4 flex items-center gap-3 text-[11px] text-neutral-400 font-medium">
            <span>{career}</span>
            <span style={{ color: "#B50E30" }}>·</span>
            <span>{semester}° Ciclo</span>
          </div>
        </section>
        <section>
          <SectionRow label="Habilidades" count={skills.length} />
          <div className="flex flex-wrap gap-2">
            {skills.map((s: string, i: number) => (
              <motion.span
                key={s}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04 }}
                className="text-xs font-bold text-neutral-600 hover:text-white hover:bg-[#B50E30] hover:border-[#B50E30] cursor-default transition-all duration-150 hover:-translate-y-px"
                style={{ border: "1px solid #e4e4e7", padding: "6px 14px", background: "#fafafa" }}
              >
                {s}
              </motion.span>
            ))}
          </div>
        </section>
        <section>
          <SectionRow label="Progresión" />
          <div className="flex flex-col gap-2 p-5" style={{ background: "#fafafa", border: "1px solid #e4e4e7" }}>
            <div className="flex items-center justify-between">
              <span className="text-xs font-black text-neutral-900">NIVEL {level}</span>
              <span className="text-xs font-black" style={{ color: "#B50E30" }}>→ NIVEL {level + 1}</span>
            </div>
            <div className="h-1 w-full bg-neutral-200">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${Math.round(((xp % 500) / 500) * 100)}%` }}
                transition={{ delay: 0.4, duration: 0.9, ease: "easeOut" }}
                className="h-full"
                style={{ background: "linear-gradient(90deg, #B50E30, #e8294f)" }}
              />
            </div>
            <span className="text-[10px] font-bold text-neutral-400">{500 - (xp % 500)} XP restantes</span>
          </div>
        </section>
      </motion.div>
    );

    const TabActividad = () => (
      <motion.div key="actividad" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.18 }} className="flex flex-col gap-6">
        <SectionRow label="Métricas de actividad" />
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 -mt-2">
          {[
            { icon: <FolderGit2 className="h-5 w-5" />, value: projectCount, label: "Proyectos" },
            { icon: <Trophy className="h-5 w-5" />, value: logroCount, label: "Logros" },
            { icon: <Users className="h-5 w-5" />, value: conexCount, label: "Conexiones" },
            { icon: <Zap className="h-5 w-5" />, value: xp, label: "XP Total" },
          ].map(({ icon, value, label }) => (
            <div key={label} className="flex flex-col gap-3 p-5 transition-all duration-150 hover:border-[#B50E30]/40" style={{ background: "#fafafa", border: "1px solid #e4e4e7" }}>
              <div className="text-neutral-300">{icon}</div>
              <div>
                <div className="text-2xl font-black text-neutral-900 tracking-tighter leading-none">{value}</div>
                <Label>{label}</Label>
              </div>
            </div>
          ))}
        </div>
        <SectionRow label="Publicaciones recientes" />
        <div className="flex flex-col gap-2 -mt-2">
          {recentPosts.map((post: string, i: number) => (
            <div key={i} className="flex items-center gap-4 p-4 transition-colors duration-150 hover:border-neutral-300 cursor-default group" style={{ border: "1px solid #ebebeb", background: "#fafafa" }}>
              <div className="text-[10px] font-black tabular-nums shrink-0" style={{ color: "#B50E30" }}>
                {String(i + 1).padStart(2, "0")}
              </div>
              <span className="text-xs text-neutral-500 group-hover:text-neutral-800 transition-colors flex-1">{post}</span>
              <ArrowUpRight className="h-3.5 w-3.5 text-neutral-300 group-hover:text-neutral-500 transition-colors shrink-0" />
            </div>
          ))}
        </div>
      </motion.div>
    );

    const TabConexiones = () => (
      <motion.div key="conexiones" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.18 }} className="flex flex-col gap-3">
        <SectionRow label="Red de contactos" count={conexCount} />
        {contactList.map((c: any, i: number) => (
          <motion.div
            key={c.name}
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.06 }}
            className="flex items-center gap-4 p-4 group cursor-default transition-all duration-150 hover:border-neutral-300"
            style={{ border: "1px solid #ebebeb", background: "#fafafa" }}
          >
            <div className="h-9 w-9 shrink-0 flex items-center justify-center text-[11px] font-black text-white" style={{ background: i % 2 === 0 ? "#B50E30" : "#1a1a1a" }}>
              {c.name.split(" ").map((n: string) => n[0]).join("")}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold text-neutral-700 group-hover:text-neutral-900 transition-colors">{c.name}</p>
              <p className="text-[10px] text-neutral-400">{c.role}</p>
            </div>
            <div className="flex items-center gap-1.5 shrink-0">
              <span className="text-[9px] font-black" style={{ color: "#B50E30" }}>LVL {c.level}</span>
              <div className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
            </div>
          </motion.div>
        ))}
      </motion.div>
    );

    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 md:p-6"
        style={{ background: "rgba(0,0,0,0.45)" }}
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 32 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 32 }}
          transition={{ type: "spring", damping: 30, stiffness: 300 }}
          onClick={(e) => e.stopPropagation()}
          className="w-full max-w-5xl flex flex-col md:flex-row overflow-hidden max-h-[95vh] sm:max-h-[88vh] md:rounded-none"
          style={{ height: "auto", minHeight: 0, background: "#f8f7f5", border: "1px solid #e2e0dd" }}
        >
          <LeftPanel />
          <div className="flex flex-col flex-1 min-w-0">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-4 sm:px-8 py-3 sm:py-4 shrink-0 bg-white" style={{ borderBottom: "1px solid #e2e0dd" }}>
              <div className="flex items-center overflow-x-auto scrollbar-none -mx-1 px-1">
                {TABS.map((t) => (
                  <button
                    key={t}
                    onClick={() => setTab(t)}
                    className="relative px-4 py-2 text-xs font-bold transition-colors duration-150"
                    style={{ color: tab === t ? "#111" : "#a1a1aa" }}
                  >
                    {t}
                    {tab === t && (
                      <motion.div layoutId="tab-underline" className="absolute bottom-0 left-0 right-0 h-[2px]" style={{ background: "#B50E30" }} />
                    )}
                  </button>
                ))}
              </div>
              <div className="flex items-center gap-2 flex-wrap shrink-0">
                {isSelf ? (
                  <div className="px-3 py-1.5 text-[11px] font-black text-neutral-400" style={{ border: "1px solid #d4d4d8" }}>
                    Tú (Estudiante)
                  </div>
                ) : isAlreadyConnected ? (
                  <div className="flex items-center gap-1.5 px-3 py-1.5 text-[11px] font-black text-emerald-600" style={{ border: "1px solid rgba(16,185,129,0.3)", background: "rgba(16,185,129,0.06)" }}>
                    <Check className="h-3 w-3 stroke-[3]" />
                    Conectados
                  </div>
                ) : (
                  <button
                    onClick={() => handleUserProfileConnect(profile.name)}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-[11px] font-black text-white transition-all duration-150 hover:opacity-80"
                    style={{ background: "#B50E30" }}
                  >
                    <UserPlus className="h-3 w-3" />
                    Conectar
                  </button>
                )}
                <button className="flex items-center gap-1.5 px-3 py-1.5 text-[11px] font-bold text-neutral-500 hover:text-neutral-900 transition-colors duration-150" style={{ border: "1px solid #d4d4d8" }}>
                  <MessageCircle className="h-3 w-3" />
                  Mensaje
                </button>
                <button
                  onClick={onClose}
                  className="h-8 w-8 flex items-center justify-center text-neutral-400 hover:text-neutral-900 transition-colors duration-150 ml-2"
                  style={{ border: "1px solid #d4d4d8" }}
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>
            <div className="flex-1 overflow-y-auto px-4 sm:px-8 py-5 sm:py-7 bg-white min-h-0" style={{ scrollbarWidth: "none" }}>
              <AnimatePresence mode="wait">
                {tab === "Perfil" && <TabPerfil />}
                {tab === "Actividad" && <TabActividad />}
                {tab === "Conexiones" && <TabConexiones />}
              </AnimatePresence>
            </div>
          </div>
        </motion.div>
      </motion.div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Tab Select Controller */}
      <div className="bg-white rounded-none border border-utp-border p-2 flex select-none">
        <button
          type="button"
          onClick={() => setActiveSegment("comunidad")}
          className={`flex-1 py-3.5 text-xs font-black uppercase tracking-wider rounded-none transition flex items-center justify-center gap-1.5 cursor-pointer ${
            activeSegment === "comunidad"
              ? "bg-[#EFF6FF] text-[#000F37]"
              : "text-black hover:bg-neutral-50"
          }`}
        >
          <MessageSquare className="h-4 w-4" />
          Foro de Estudiantes UTP+
        </button>
        <button
          type="button"
          onClick={() => setActiveSegment("networking")}
          className={`flex-1 py-3.5 text-xs font-black uppercase tracking-wider rounded-none transition flex items-center justify-center gap-1.5 cursor-pointer ${
            activeSegment === "networking"
              ? "bg-[#EFF6FF] text-[#000F37]"
              : "text-black hover:bg-neutral-50"
          }`}
        >
          <Users className="h-4 w-4" />
          Networking con Reclutadores
        </button>
      </div>

      <AnimatePresence mode="wait">
        {activeSegment === "comunidad" ? (
          /* COMMUNITY FORUM BLOCK */
          <motion.div
            key="comunidad"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="grid grid-cols-1 lg:grid-cols-3 gap-6"
          >
            {/* Posts feed list */}
            <div className="lg:col-span-2 space-y-4">
              {/* Category Filter Pills & Create Post Trigger */}
              <div className="bg-white rounded-none border border-utp-border p-4 flex flex-wrap items-center justify-between gap-3">
                <NavBar
                  items={[
                    { name: "todo", icon: <List className="h-3.5 w-3.5" /> },
                    { name: "proyecto", icon: <Briefcase className="h-3.5 w-3.5" /> },
                    { name: "logro", icon: <Trophy className="h-3.5 w-3.5" /> },
                    { name: "ayuda", icon: <HeartHandshake className="h-3.5 w-3.5" /> },
                    { name: "evento", icon: <Sparkles className="h-3.5 w-3.5" /> },
                    { name: "general", icon: <Tag className="h-3.5 w-3.5" /> },
                  ]}
                  activeTab={activeCategory}
                  onTabChange={(name) => setActiveCategory(name as "todo" | "proyecto" | "logro" | "ayuda" | "evento" | "general")}
                />

                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => setShowCreateModal(true)}
                    className="bg-[#EFF6FF] hover:bg-[#dbeafe] text-[#000F37] text-[11px] font-black uppercase tracking-widest px-4 py-2.5 flex items-center gap-1.5 transition cursor-pointer rounded-none"
                  >
                    <PlusCircle className="h-4 w-4" />
                    Compartir un logro
                  </button>
                </div>
              </div>

              {/* POST WRITE PANEL IN-LINE CARD IF TRIGGERED */}
              {showCreateModal && (
                <motion.form
                  onSubmit={handleCreatePost}
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  className="bg-white text-black rounded-none p-6 border border-gray-200 space-y-4"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] uppercase tracking-widest font-black text-[#B50E30] flex items-center gap-1.5">
                      <Sparkles className="h-4 w-4 fill-[#B50E30] text-[#B50E30]" />
                      Anuncia tu crecimiento a la red académica
                    </span>
                    <button
                      type="button"
                      onClick={() => setShowCreateModal(false)}
                      className="text-xs text-gray-500 hover:text-black font-extrabold uppercase tracking-wide"
                    >
                      Cancelar
                    </button>
                  </div>

                  <textarea
                    required
                    value={newPostContent}
                    onChange={(e) => setNewPostContent(e.target.value)}
                    placeholder="Comparte tu avance corporativo, un proyecto académico de la UTP o solicita retroalimentación de verbos en el CV..."
                    className="w-full p-4 bg-white text-black text-xs font-semibold outline-none rounded-none border border-gray-200 focus:border-[#B50E30] placeholder-gray-400 font-mono"
                    rows={4}
                  />

                  <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                    <div className="flex items-center gap-2">
                      <span className="text-[9px] uppercase font-black text-gray-500">Categoría:</span>
                      <select
                        value={newPostCategory}
                        onChange={(e) => setNewPostCategory(e.target.value as SocialPost["category"])}
                        className="bg-white border border-gray-200 text-xs text-black rounded-none px-2.5 py-1.5 uppercase font-bold"
                      >
                        <option value="proyecto">PROYECTO</option>
                        <option value="logro">LOGRO FORMATIVO</option>
                        <option value="ayuda">SOLICITAR FEEDBACK</option>
                        <option value="evento">EVENTO/HACKATHON</option>
                        <option value="general">GENERAL</option>
                      </select>
                    </div>

                    <button
                      type="submit"
                      className="bg-[#B50E30] hover:bg-[#85061B] px-5 py-2 rounded-none text-xs font-black uppercase tracking-widest transition flex items-center gap-1.5 cursor-pointer"
                    >
                      Publicar ahora
                    </button>
                  </div>
                </motion.form>
              )}

              {/* FEED VIEW — único diseño oficial */}
              {filteredPosts.length === 0 ? (
              <div className="bg-white rounded-none border border-utp-border p-8 text-center space-y-4">
                <div className="text-neutral-300 mx-auto">
                  {activeCategory === "todo" ? (
                    <MessageSquare className="h-10 w-10 mx-auto" />
                  ) : activeCategory === "proyecto" ? (
                    <Briefcase className="h-10 w-10 mx-auto" />
                  ) : activeCategory === "logro" ? (
                    <Trophy className="h-10 w-10 mx-auto" />
                  ) : activeCategory === "ayuda" ? (
                    <HeartHandshake className="h-10 w-10 mx-auto" />
                  ) : activeCategory === "evento" ? (
                    <Sparkles className="h-10 w-10 mx-auto" />
                  ) : (
                    <Tag className="h-10 w-10 mx-auto" />
                  )}
                </div>
                <p className="text-xs font-black uppercase text-neutral-400">
                  {activeCategory === "todo"
                    ? "Aún no hay publicaciones en el foro"
                    : `No hay publicaciones en "${activeCategory}"`}
                </p>
                <button
                  type="button"
                  onClick={() => setShowCreateModal(true)}
                  className="inline-flex items-center gap-1.5 bg-[#EFF6FF] hover:bg-[#dbeafe] text-[#000F37] text-[11px] font-black uppercase tracking-widest px-4 py-2.5 transition cursor-pointer rounded-none"
                >
                  <PlusCircle className="h-4 w-4" />
                  Compartir un logro
                </button>
              </div>
              ) : (
              <FeedView
                posts={filteredPosts}
                onLike={handleLike}
                onComment={(id, text) => {
                  setPosts((prev) =>
                    prev.map((p) => {
                      if (p.id === id) {
                        return {
                          ...p,
                          comments: [
                            ...p.comments,
                            { authorName: "Valeria Alva (Tú)", content: text, date: "Ahora mismo" },
                          ],
                        };
                      }
                      return p;
                    })
                  );
                }}
                onOpenProfile={(name) => openProfile(name)}
              />
            )}
            </div>

            {/* Micro networking sidebar inside community */}
            <div className="space-y-6">
              <div className="bg-white rounded-none border border-utp-border p-6 space-y-4">
                <h3 className="heading-sm text-black tracking-widest flex items-center gap-2 pb-2 border-b border-utp-border">
                  <Trophy className="h-4 w-4 text-[#B50E30]" />
                  Egresados Destacados
                </h3>
                <div className="space-y-4">
                  {contacts.slice(0, 2).map((cont) => (
                    <div 
                      key={cont.id} 
                      onClick={() => openProfile(cont.name)}
                      className="p-3 bg-neutral-50 hover:bg-neutral-100 border border-utp-border rounded-none space-y-2 transition cursor-pointer group"
                      title="Ver Perfil Completo"
                    >
                      <div className="space-y-1">
                        <span className="text-[8px] font-black text-white bg-black px-2 py-0.5 rounded-none uppercase tracking-wide">
                          {cont.type}
                        </span>
                        <h4 className="heading-md text-black group-hover:text-[#B50E30] transition-colors">{cont.name}</h4>
                        <p className="text-[11px] text-neutral-550 font-bold uppercase">
                          {cont.role} en <strong className="text-black">{cont.company}</strong>
                        </p>
                      </div>
                      <p className="text-[10px] text-neutral-500 leading-relaxed font-semibold italic border-l-2 border-[#B50E30] pl-2">
                        "{cont.bio.slice(0, 75)}..."
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        ) : (
          /* NETWORKING CONNECTIONS SEGMENT — VacanciesPanel card design */
          <motion.div
            key="networking"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            <motion.div
              className="grid grid-cols-1 md:grid-cols-2 gap-5"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              {contacts.map((c) => (
                <motion.div
                  key={c.id}
                  variants={cardVariants}
                  whileHover={{ y: -4 }}
                  className="relative group bg-white border border-gray-200 shadow-[0_4px_20px_rgba(0,0,0,0.05)] hover:shadow-[0_15px_40px_rgba(0,0,0,0.12)] transition-all duration-400 ease-out p-6 md:p-7 overflow-hidden flex flex-col"
                >
                  <div className="absolute top-0 left-0 w-1.5 h-full bg-[#B50E30] transform -translate-x-full group-hover:translate-x-0 transition-transform duration-300" />

                  <div className="flex justify-between items-start mb-4 gap-3">
                    <span className={`text-[10px] md:text-xs font-bold px-3 py-1 uppercase tracking-widest mt-1 shadow-sm shrink-0 ${
                      c.type === "mentor"
                        ? "bg-black text-[#B50E30]"
                        : c.type === "reclutador"
                          ? "bg-[#B50E30] text-white"
                          : "bg-black text-white"
                    }`}>
                      {c.type}
                    </span>
                  </div>

                  <h3 className="text-lg md:text-xl font-black uppercase tracking-tight text-black leading-tight mb-2 group-hover:text-[#B50E30] transition-colors duration-300">
                    {c.name}
                  </h3>

                  <div className="flex flex-wrap items-center gap-3 text-gray-400 font-bold text-[10px] md:text-xs uppercase tracking-wider mb-4">
                    <span className="flex items-center gap-1">
                      <Briefcase className="w-3.5 h-3.5 text-[#B50E30]" />
                      {c.role} @ <strong className="text-black font-extrabold">{c.company}</strong>
                    </span>
                  </div>

                  <p className="text-gray-600 font-medium leading-relaxed text-xs md:text-sm mb-5 line-clamp-2">
                    {c.bio}
                  </p>

                  <div className="mb-5">
                    <span className="text-[10px] font-black text-[#B50E30] uppercase tracking-widest block mb-2">
                      Compatibilidad:
                    </span>
                    <div className="flex items-center gap-1.5 bg-gray-50 border border-gray-200 text-black font-bold uppercase text-[10px] px-3 py-2">
                      <Sparkles className="h-4 w-4 text-[#B50E30] shrink-0 fill-[#B50E30]" />
                      <span>{c.compatibilityText}</span>
                    </div>
                  </div>

                  <hr className="border-gray-200 mb-5 group-hover:border-[#B50E30]/20 transition-colors" />

                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mt-auto">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => openProfile(c.name)}
                      className="text-xs font-black uppercase tracking-wider rounded-lg border-gray-200 text-gray-700 hover:text-[#B50E30] hover:border-[#B50E30]"
                    >
                      Ver Perfil
                    </Button>

                    {c.isConnected ? (
                      <div className="w-full md:w-auto bg-neutral-100 text-neutral-500 border border-neutral-200 text-xs font-black uppercase tracking-widest px-6 py-3 flex items-center justify-center gap-2 shrink-0 select-none">
                        <Check className="h-4 w-4 text-[#B50E30] stroke-[3]" />
                        Conectado
                      </div>
                    ) : c.isPending ? (
                      <div className="w-full md:w-auto bg-neutral-50 text-neutral-400 border border-gray-200 text-xs font-black uppercase tracking-widest px-6 py-3 flex items-center justify-center gap-2 shrink-0 select-none">
                        Solicitado
                      </div>
                    ) : (
                      <motion.button
                        type="button"
                        onClick={() => handleConnect(c.id)}
                        whileTap={{ scale: 0.97 }}
                        className="group/btn w-full md:w-auto bg-black text-white font-black uppercase tracking-widest text-[11px] px-6 py-3 flex items-center justify-center gap-2 hover:bg-[#B50E30] hover:shadow-[0_8px_20px_rgba(181,14,48,0.3)] transition-all duration-300 shrink-0 cursor-pointer"
                      >
                        Conectar
                      </motion.button>
                    )}
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* PROFESSIONAL PROFILE POPUP MODAL */}
      <AnimatePresence>
        {selectedUserProfile && (
          <ProfileModalContent
            profile={selectedUserProfile}
            onClose={() => setSelectedUserProfile(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

/* ── Inline SVG icon components (from iconos-empleabilidad-utp) ── */
function InfoSvg({ className }: { className?: string }) {
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <circle cx="12" cy="12" r="10" />
    <line x1="12" y1="16" x2="12" y2="12" />
    <line x1="12" y1="8" x2="12.01" y2="8" />
  </svg>;
}
function SkillsSvg({ className }: { className?: string }) {
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M12 4V2 M20 12h2 M4 12H2 M12 22v-2" />
    <path d="M11 7H6a2 2 0 0 0-2 2v5a2 2 0 0 0 2 2h4" />
    <path d="M18 11v5a2 2 0 0 1-2 2h-5" />
    <path d="M14 4h4a2 2 0 0 1 2 2v5" />
    <rect x="11" y="10" width="4" height="4" rx="1" />
  </svg>;
}
function GrowthSvg({ className }: { className?: string }) {
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <rect x="3" y="14" width="3" height="7" rx="0.5" />
    <rect x="9" y="10" width="3" height="11" rx="0.5" />
    <rect x="15" y="5" width="3" height="16" rx="0.5" />
    <path d="M4 11l6-5 6 4 5-8" />
    <polyline points="17 2 21 2 21 6" />
  </svg>;
}
function StarSvg({ className }: { className?: string }) {
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <circle cx="12" cy="9" r="6" />
    <path d="M8.5 14.5L6 21l6-3 6 3-2.5-6.5" />
    <polygon points="12 6 13 8 15 8 13.5 9.5 14 11.5 12 10.5 10 11.5 10.5 9.5 9 8 11 8" />
  </svg>;
}
function TargetSvg({ className }: { className?: string }) {
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <circle cx="12" cy="12" r="10" />
    <circle cx="12" cy="12" r="6" />
    <circle cx="12" cy="12" r="2" />
    <path d="M22 2l-7.5 7.5" />
    <polygon points="22 2 18 2 22 6 22 2" />
  </svg>;
}
function NetworkSvg({ className }: { className?: string }) {
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <circle cx="12" cy="12" r="3" />
    <circle cx="4" cy="4" r="2" />
    <circle cx="20" cy="4" r="2" />
    <circle cx="4" cy="20" r="2" />
    <circle cx="20" cy="20" r="2" />
    <line x1="6" y1="6" x2="9.5" y2="9.5" />
    <line x1="18" y1="6" x2="14.5" y2="9.5" />
    <line x1="6" y1="20" x2="9.5" y2="14.5" />
    <line x1="18" y1="20" x2="14.5" y2="14.5" />
  </svg>;
}
function ProfileSvg({ className }: { className?: string }) {
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>;
}
function ConfigSvg({ className }: { className?: string }) {
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <circle cx="12" cy="12" r="3" />
    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
  </svg>;
}
function DownloadSvg({ className }: { className?: string }) {
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
    <polyline points="7 10 12 15 17 10" />
    <line x1="12" y1="15" x2="12" y2="3" />
  </svg>;
}
