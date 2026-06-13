import React, { useState } from "react";
import { SocialPost, NetworkingContact } from "../types";
import { useNotification } from "../context/NotificationContext";
import { 
  Users, MessageSquare, ThumbsUp, Sparkles, Send, Tag, Share2, 
  Search, PlusCircle, Check, Briefcase, GraduationCap, Trophy,
  User, HeartHandshake, Award, X, List
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { INITIAL_COMMUNITY_POSTS, INITIAL_NETWORKING_CONTACTS } from "../data";
import { NavBar } from "./ui/tubelight-navbar";
import { FeedView } from "./ui/feed-view";
import { Button } from "./ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "./ui/card";

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
  }
};

export default function SocialHub() {
  const { addNotification } = useNotification();
  const [posts, setPosts] = useState<SocialPost[]>(INITIAL_COMMUNITY_POSTS);
  const [contacts, setContacts] = useState<NetworkingContact[]>(INITIAL_NETWORKING_CONTACTS);
  
  const [selectedUserProfile, setSelectedUserProfile] = useState<any | null>(null);
  
  const [connectedProfiles, setConnectedProfiles] = useState<Record<string, boolean>>({});

  const [newPostContent, setNewPostContent] = useState("");
  const [newPostCategory, setNewPostCategory] = useState<SocialPost["category"]>("proyecto");
  const [showCreateModal, setShowCreateModal] = useState(false);

  const [activeCategory, setActiveCategory] = useState<"todo" | SocialPost["category"]>("todo");

  const [activeSegment, setActiveSegment] = useState<"comunidad" | "networking">("comunidad");

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

  const filteredPosts = activeCategory === "todo" 
    ? posts 
    : posts.filter(p => p.category === activeCategory);

  return (
    <div className="space-y-6">
      {/* Tab Select Controller */}
      <div className="bg-white rounded-none border border-utp-border p-2 flex select-none">
        <button
          type="button"
          onClick={() => setActiveSegment("comunidad")}
          className={`flex-1 py-3.5 text-xs font-black uppercase tracking-wider rounded-none transition flex items-center justify-center gap-1.5 cursor-pointer ${
            activeSegment === "comunidad"
              ? "bg-[#B50E30] text-white"
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
              ? "bg-[#B50E30] text-white"
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
                    className="bg-[#B50E30] hover:bg-[#85061B] text-white text-[11px] font-black uppercase tracking-widest px-4 py-2.5 flex items-center gap-1.5 transition cursor-pointer rounded-none"
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
                  className="inline-flex items-center gap-1.5 bg-[#B50E30] hover:bg-[#85061B] text-white text-[11px] font-black uppercase tracking-widest px-4 py-2.5 transition cursor-pointer rounded-none"
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
                <h3 className="text-xs font-black text-black uppercase tracking-widest flex items-center gap-2 pb-2 border-b border-utp-border">
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
                        <h4 className="font-black text-xs text-black uppercase tracking-tight group-hover:text-[#B50E30] transition-colors">{cont.name}</h4>
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
          /* NETWORKING CONNECTIONS SEGMENT */
          <motion.div
            key="networking"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-4"
          >
            {contacts.map((c) => (
              <div 
                key={c.id} 
                className="bg-white rounded-none border border-utp-border p-6 flex flex-col justify-between gap-4"
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <span className={`text-[9px] font-black px-2.5 py-1 uppercase tracking-wider rounded-none ${
                        c.type === "mentor"
                          ? "bg-black text-[#B50E30] border border-black"
                          : c.type === "reclutador"
                            ? "bg-[#B50E30] text-white border border-[#B50E30]"
                            : "bg-black text-white border border-black"
                      }`}>
                        {c.type}
                      </span>
                      <h3 className="font-extrabold text-sm uppercase text-black tracking-tight mt-3">{c.name}</h3>
                      <p className="text-xs text-neutral-500 font-bold uppercase">
                        {c.role} @ <span className="font-extrabold text-black">{c.company}</span>
                      </p>
                    </div>
                  </div>

                  <p className="text-xs text-neutral-700 leading-relaxed font-semibold">
                    {c.bio}
                  </p>

                  <div className="text-[10px] font-black uppercase tracking-wider text-black bg-neutral-50 p-3 rounded-none border border-utp-border flex items-center gap-1.5">
                    <Sparkles className="h-4 w-4 text-[#B50E30] shrink-0 fill-[#B50E30]" />
                    <span>{c.compatibilityText}</span>
                  </div>
                </div>

                <div className="border-t border-utp-border pt-4 flex items-center justify-between gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => openProfile(c.name)}
                    className="text-xs font-black uppercase tracking-wider rounded-lg border-gray-200 text-gray-700 hover:text-[#B50E30] hover:border-[#B50E30]"
                  >
                    Ver Perfil
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => handleConnect(c.id)}
                    disabled={c.isConnected || c.isPending}
                    className={`text-xs font-black uppercase tracking-widest rounded-lg ${
                      c.isConnected 
                        ? "bg-neutral-100 text-neutral-500 border-neutral-200 shadow-none hover:bg-neutral-100" 
                        : c.isPending 
                          ? "bg-neutral-50 text-neutral-400 border-utp-border shadow-none hover:bg-neutral-50" 
                          : "bg-[#B50E30] hover:bg-[#85061B] text-white shadow-none"
                    }`}
                  >
                    {c.isConnected ? (
                      <>
                        <Check className="h-3.5 w-3.5 text-[#B50E30] stroke-[3]" />
                        Conectado
                      </>
                    ) : c.isPending ? (
                      "Solicitado"
                    ) : (
                      "Conectar"
                    )}
                  </Button>
                </div>
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* PROFESSIONAL PROFILE POPUP MODAL */}
      <AnimatePresence>
        {selectedUserProfile && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-neutral-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto"
            onClick={() => setSelectedUserProfile(null)}
          >
            <motion.div
              initial={{ scale: 0.95, y: 15 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 15 }}
              transition={{ type: "spring", duration: 0.4 }}
              onClick={(e) => e.stopPropagation()}
              className="w-[90vw] max-w-lg"
            >
              <Card className="w-full bg-white shadow-xl border-gray-200 relative overflow-hidden rounded-2xl">
                {/* Close Button */}
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setSelectedUserProfile(null)}
                  className="absolute top-3 right-3 z-20 h-8 w-8 rounded-full bg-white/80 backdrop-blur-sm text-gray-500 hover:text-gray-800 hover:bg-white border border-gray-200"
                >
                  <X className="h-4 w-4" />
                </Button>

                {/* Cover Banner */}
                <div className="h-28 bg-gradient-to-r from-gray-900 via-neutral-800 to-gray-900 relative">
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(255,255,255,0.05)_0px,transparent_100px)]" />
                </div>

                {/* Avatar overlapping cover */}
                <div className="relative px-6">
                  <div className="relative -mt-12 mb-2 flex items-end gap-4">
                    <div className="relative shrink-0">
                      <img
                        src={`https://ui-avatars.com/api/?name=${encodeURIComponent(selectedUserProfile.name.replace(" (Tú)", "").replace("Ing. ", "").replace("Lic. ", ""))}&background=000&color=fff&size=128&bold=true`}
                        alt={selectedUserProfile.name}
                        className="h-20 w-20 rounded-2xl border-4 border-white bg-white object-cover shadow-lg"
                      />
                      <div className="absolute -bottom-1 -right-1 h-7 w-7 bg-[#B50E30] rounded-full flex items-center justify-center text-[11px] font-bold text-white shadow-md border-2 border-white">
                        {selectedUserProfile.level}
                      </div>
                    </div>

                    <div className="min-w-0 flex-1 pt-1">
                      <CardTitle className="text-lg font-bold text-gray-900 tracking-tight truncate">
                        {selectedUserProfile.name}
                      </CardTitle>
                      <p className="text-xs font-semibold text-[#B50E30] tracking-wide truncate">
                        {selectedUserProfile.targetRole}
                      </p>
                      <p className="text-[11px] text-gray-500 font-medium truncate">
                        {selectedUserProfile.career} • {selectedUserProfile.semester}º Ciclo
                      </p>
                    </div>
                  </div>

                  {/* Type badge + ID row */}
                  <div className="flex items-center gap-2 pb-4 border-b border-gray-100">
                    <span className="text-[9px] uppercase font-bold px-2.5 py-1 rounded-md tracking-wide bg-black text-white">
                      {selectedUserProfile.type}
                    </span>
                    <span className="text-[9px] font-semibold text-gray-400">ID: UTP-{selectedUserProfile.xp + 1092}</span>
                    <span className="ml-auto text-[9px] font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md">
                      ● Disponible para networking
                    </span>
                  </div>
                </div>

                <CardContent className="px-6 pt-4 pb-2 space-y-5">
                  {/* Bio block */}
                  <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                    <h4 className="text-[9px] font-bold text-gray-500 uppercase tracking-wider mb-1">Acerca de</h4>
                    <p className="text-xs text-gray-700 leading-relaxed font-[425] italic">
                      "{selectedUserProfile.bio}"
                    </p>
                  </div>

                  {/* Skill chips */}
                  <div className="space-y-2.5">
                    <h4 className="text-[9px] font-bold text-[#B50E30] uppercase tracking-wider flex items-center gap-1">
                      <Award className="h-4 w-4" />
                      Habilidades Destacadas
                    </h4>
                    <div className="flex flex-wrap gap-1.5">
                      {selectedUserProfile.skills.map((s: string) => (
                        <span
                          key={s}
                          className="bg-gray-900 text-white text-[10px] font-semibold px-3 py-1 rounded-md tracking-tight"
                        >
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Actividad */}
                  <div className="space-y-2.5">
                    <h4 className="text-[9px] font-bold text-gray-500 uppercase tracking-wider flex items-center gap-1">
                      <Briefcase className="h-4 w-4 text-[#B50E30]" />
                      Actividad reciente
                    </h4>
                    <div className="grid grid-cols-3 gap-2">
                      {[
                        { label: "Proyectos", value: posts.filter(p => p.category === "proyecto" && p.authorName.includes(selectedUserProfile.name.replace(" (Tú)", "").trim())).length },
                        { label: "Logros", value: posts.filter(p => p.category === "logro" && p.authorName.includes(selectedUserProfile.name.replace(" (Tú)", "").trim())).length },
                        { label: "Eventos", value: posts.filter(p => p.category === "evento" && p.authorName.includes(selectedUserProfile.name.replace(" (Tú)", "").trim())).length },
                      ].map((item, i) => (
                        <div key={i} className="text-center py-3 bg-gray-50 rounded-xl border border-gray-100">
                          <span className="text-sm font-bold text-gray-900 block">{item.value}</span>
                          <span className="text-[9px] font-semibold text-gray-400 uppercase">{item.label}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Stats row */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="text-center py-3 bg-gray-50 rounded-xl border border-gray-100">
                      <span className="text-[9px] font-bold uppercase text-gray-400 block pb-0.5">Puntos de XP</span>
                      <span className="text-xs font-bold text-gray-900">{selectedUserProfile.xp} XP</span>
                    </div>
                    <div className="text-center py-3 bg-gray-50 rounded-xl border border-gray-100">
                      <span className="text-[9px] font-bold uppercase text-gray-400 block pb-0.5">Rango Académico</span>
                      <span className="text-xs font-bold text-[#B50E30]">MEMBER L{selectedUserProfile.level}</span>
                    </div>
                  </div>

                  {/* Redes sociales */}
                  <div className="space-y-2.5">
                    <h4 className="text-[9px] font-bold text-gray-500 uppercase tracking-wider flex items-center gap-1">
                      <Share2 className="h-4 w-4 text-[#B50E30]" />
                      Redes y Portafolio
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {[
                        { icon: "in", label: "LinkedIn", color: "bg-blue-100 text-blue-700" },
                        { icon: "gh", label: "GitHub", color: "bg-gray-100 text-gray-700" },
                        { icon: "pf", label: "Portafolio", color: "bg-purple-100 text-purple-700" },
                      ].map((net, i) => (
                        <span
                          key={i}
                          className={`text-[10px] font-semibold px-3 py-1.5 rounded-lg ${net.color} flex items-center gap-1`}
                        >
                          {net.label}
                        </span>
                      ))}
                    </div>
                  </div>
                </CardContent>

                <CardFooter className="px-6 pb-5 pt-3 flex justify-end gap-2 border-t border-gray-100">
                  <Button
                    variant="outline"
                    onClick={() => setSelectedUserProfile(null)}
                    className="text-xs font-semibold rounded-lg border-gray-200 text-gray-600 hover:bg-gray-50"
                  >
                    Cerrar
                  </Button>

                  {selectedUserProfile.name.includes("Tú") ? (
                    <div className="px-4 py-2 bg-gray-100 text-gray-400 border border-gray-200 rounded-lg text-xs font-semibold select-none">
                      Tú (Estudiante)
                    </div>
                  ) : connectedProfiles[selectedUserProfile.name] || selectedUserProfile.name.includes("Andrea Salazar") ? (
                    <div className="px-4 py-2 bg-gray-50 text-gray-700 border border-gray-200 rounded-lg text-xs font-semibold flex items-center gap-1.5 select-none">
                      <Check className="h-3.5 w-3.5 text-[#B50E30] stroke-[3]" />
                      Conectados
                    </div>
                  ) : (
                    <Button
                      onClick={() => handleUserProfileConnect(selectedUserProfile.name)}
                      className="bg-[#B50E30] hover:bg-[#85061B] text-white text-xs font-semibold rounded-lg shadow-none"
                    >
                      <HeartHandshake className="h-3.5 w-3.5 mr-1" />
                      Conectar
                    </Button>
                  )}
                </CardFooter>
              </Card>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
