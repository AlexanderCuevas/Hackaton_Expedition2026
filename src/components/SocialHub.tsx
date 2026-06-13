import React, { useState } from "react";
import { SocialPost, NetworkingContact } from "../types";
import { 
  Users, MessageSquare, ThumbsUp, Sparkles, Send, Tag, Share2, 
  Search, PlusCircle, Check, Briefcase, GraduationCap, Trophy,
  User, HeartHandshake, Award, X, LayoutGrid, List
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { INITIAL_COMMUNITY_POSTS, INITIAL_NETWORKING_CONTACTS } from "../data";
import { TestimonialCarousel } from "./ui/profile-card-testimonial-carousel";
import { NavBar } from "./ui/tubelight-navbar";

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
  const [posts, setPosts] = useState<SocialPost[]>(INITIAL_COMMUNITY_POSTS);
  const [contacts, setContacts] = useState<NetworkingContact[]>(INITIAL_NETWORKING_CONTACTS);
  
  const [selectedUserProfile, setSelectedUserProfile] = useState<any | null>(null);
  
  const [connectedProfiles, setConnectedProfiles] = useState<Record<string, boolean>>({});

  const [newPostContent, setNewPostContent] = useState("");
  const [newPostCategory, setNewPostCategory] = useState<SocialPost["category"]>("proyecto");
  const [showCreateModal, setShowCreateModal] = useState(false);

  const [activeCategory, setActiveCategory] = useState<"todo" | SocialPost["category"]>("todo");
  const [postViewMode, setPostViewMode] = useState<"list" | "testimonials">("testimonials");

  const [activeSegment, setActiveSegment] = useState<"comunidad" | "networking">("comunidad");

  const [commentInputs, setCommentInputs] = useState<Record<string, string>>({});
  const [expandedComments, setExpandedComments] = useState<Record<string, boolean>>({});

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

  const handleCommentSubmit = (e: React.FormEvent, postId: string) => {
    e.preventDefault();
    const commentText = commentInputs[postId];
    if (!commentText?.trim()) return;

    setPosts(prevPosts =>
      prevPosts.map(p => {
        if (p.id === postId) {
          return {
            ...p,
            comments: [
              ...p.comments,
              {
                authorName: "Valeria Alva (Tú)",
                content: commentText,
                date: "Ahora mismo"
              }
            ]
          };
        }
        return p;
      })
    );

    setCommentInputs(prev => ({ ...prev, [postId]: "" }));
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
    setContacts(prev =>
      prev.map(c => {
        if (c.id === contactId) {
          if (!c.isConnected && !c.isPending) {
            return { ...c, isPending: true };
          }
        }
        return c;
      })
    );
  };

  const filteredPosts = activeCategory === "todo" 
    ? posts 
    : posts.filter(p => p.category === activeCategory);

  const carouselData = filteredPosts.map((p) => ({
    id: p.id,
    name: p.authorName.replace(" (Tú)", ""),
    title: `${p.authorCareer} • ${p.authorSemester}º ciclo`,
    description: p.content,
    imageUrl: `https://ui-avatars.com/api/?name=${encodeURIComponent(p.authorName.replace(" (Tú)", ""))}&background=B50E30&color=fff&size=200`,
    likes: p.likes,
    likedByUser: p.likedByUser,
    commentsCount: p.comments.length,
    comments: p.comments,
  }));

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
                    onClick={() => setPostViewMode(postViewMode === "list" ? "testimonials" : "list")}
                    className={`p-2.5 border transition cursor-pointer rounded-none ${
                      postViewMode === "testimonials"
                        ? "bg-black text-white border-black"
                        : "bg-white text-black border-utp-border hover:border-black"
                    }`}
                    title={postViewMode === "list" ? "Vista Testimonios" : "Vista Lista"}
                  >
                    {postViewMode === "list" ? <LayoutGrid className="h-4 w-4" /> : <List className="h-4 w-4" />}
                  </button>
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
                  className="bg-black text-white rounded-none p-6 border border-neutral-900 space-y-4"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] uppercase tracking-widest font-black text-[#B50E30] flex items-center gap-1.5">
                      <Sparkles className="h-4 w-4 fill-white text-white" />
                      Anuncia tu crecimiento a la red académica
                    </span>
                    <button 
                      type="button" 
                      onClick={() => setShowCreateModal(false)}
                      className="text-xs text-neutral-400 hover:text-white font-extrabold uppercase tracking-wide"
                    >
                      Cancelar
                    </button>
                  </div>

                  <textarea
                    required
                    value={newPostContent}
                    onChange={(e) => setNewPostContent(e.target.value)}
                    placeholder="Comparte tu avance corporativo, un proyecto académico de la UTP o solicita retroalimentación de verbos en el CV..."
                    className="w-full p-4 bg-neutral-950 text-white text-xs font-semibold outline-none rounded-none border border-neutral-800 focus:border-[#B50E30] placeholder-neutral-500 font-mono"
                    rows={4}
                  />

                  <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                    <div className="flex items-center gap-2">
                      <span className="text-[9px] uppercase font-black text-neutral-400">Categoría:</span>
                      <select
                        value={newPostCategory}
                        onChange={(e) => setNewPostCategory(e.target.value as SocialPost["category"])}
                        className="bg-neutral-950 border border-neutral-800 text-xs text-white rounded-none px-2.5 py-1.5 uppercase font-bold"
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

              {/* POST LIST / TESTIMONIALS VIEW */}
              {postViewMode === "testimonials" ? (
                <div className="bg-white rounded-none border border-utp-border">
                  <TestimonialCarousel
                    testimonials={carouselData}
                    onLike={(id) => handleLike(id as string)}
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
                  />
                </div>
              ) : filteredPosts.length === 0 ? (
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
              <motion.div
                initial="hidden"
                animate="visible"
                variants={{ visible: { transition: { staggerChildren: 0.05 } } }}
                className="space-y-4"
              >
                {filteredPosts.map((post) => {
                  const categoryColors: Record<string, string> = {
                    proyecto: "bg-black text-white",
                    logro: "bg-[#B50E30] text-white",
                    ayuda: "bg-amber-600 text-white",
                    evento: "bg-emerald-700 text-white",
                    general: "bg-neutral-500 text-white",
                  };
                  const catColor = categoryColors[post.category] || "bg-black text-[#B50E30]";
                  const isExpanded = expandedComments[post.id] ?? (post.comments.length > 0);

                  return (
                  <motion.div
                    key={post.id}
                    variants={{ hidden: { opacity: 0, y: 14 }, visible: { opacity: 1, y: 0 } }}
                    className="bg-white rounded-none border border-utp-border p-6 space-y-4"
                  >
                    {/* Header */}
                    <div className="flex items-center justify-between">
                      <div 
                        onClick={() => openProfile(post.authorName, { career: post.authorCareer, semester: post.authorSemester, avatarColor: post.avatarColor })}
                        className="flex items-center gap-3 cursor-pointer group"
                        title="Ver Perfil Profesional"
                      >
                        <img
                          src={`https://ui-avatars.com/api/?name=${encodeURIComponent(post.authorName.replace(" (Tú)", ""))}&background=000&color=fff&size=80`}
                          alt={post.authorName}
                          className="h-10 w-10 bg-black border border-black object-cover rounded-none transition-transform group-hover:scale-105"
                        />
                        <div>
                          <div className="text-xs font-extrabold text-black uppercase tracking-wide flex items-center gap-1.5 transition-colors">
                            <span>{post.authorName}</span>
                            <span className={`${catColor} text-[8px] font-black px-1.5 py-0.5 rounded-none`}>
                              {post.category.toUpperCase()}
                            </span>
                          </div>
                          <div className="text-[10px] text-neutral-400 font-semibold mt-0.5 uppercase tracking-wide">
                            {post.authorCareer} • {post.authorSemester}º ciclo
                          </div>
                        </div>
                      </div>

                      <span className="text-[10px] text-neutral-450 font-bold uppercase">{post.date}</span>
                    </div>

                    {/* Content */}
                    <p className="text-xs text-black leading-relaxed font-semibold">
                      {post.content}
                    </p>

                    {/* Footer Likes / Comments */}
                    <div className="flex items-center justify-between pt-3 border-t border-utp-border text-[11px] font-black uppercase tracking-wider text-neutral-500">
                      <div className="flex items-center gap-4">
                        <button
                          type="button"
                          onClick={() => handleLike(post.id)}
                          className={`flex items-center gap-1.5 transition cursor-pointer hover:text-[#B50E30] ${
                            post.likedByUser ? "text-[#B50E30]" : ""
                          }`}
                        >
                          <motion.span whileTap={{ scale: 1.3 }} className="flex items-center gap-1.5">
                            <ThumbsUp className={`h-4 w-4 ${post.likedByUser ? "fill-[#B50E30] text-[#B50E30]" : ""}`} />
                          </motion.span>
                          <span>{post.likes} Likes</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => setExpandedComments(prev => ({ ...prev, [post.id]: !isExpanded }))}
                          className="flex items-center gap-1.5 hover:text-black transition cursor-pointer"
                        >
                          <MessageSquare className="h-4 w-4 text-[#B50E30]" />
                          <span>{post.comments.length} Comentarios</span>
                        </button>
                      </div>
                    </div>

                    {/* Preview last comment (when collapsed) */}
                    {!isExpanded && post.comments.length > 0 && (
                      <div
                        onClick={() => setExpandedComments(prev => ({ ...prev, [post.id]: true }))}
                        className="bg-neutral-50 px-4 py-2.5 border border-utp-border cursor-pointer hover:bg-neutral-100 transition"
                      >
                        <span className="text-[10px] text-neutral-400 font-bold uppercase">
                          Último comentario por <strong className="text-black">{post.comments[post.comments.length - 1].authorName}</strong>
                        </span>
                        <p className="text-[11px] text-neutral-600 font-semibold truncate mt-0.5">
                          {post.comments[post.comments.length - 1].content}
                        </p>
                      </div>
                    )}

                    {/* Comments List Panel */}
                    <AnimatePresence initial={false}>
                      {isExpanded && (
                        <motion.div
                          key="comments"
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.2, ease: "easeInOut" }}
                          className="bg-neutral-50 rounded-none border border-utp-border overflow-hidden"
                        >
                          <div className="p-4 space-y-3">
                            {post.comments.length === 0 && (
                              <p className="text-[10px] text-neutral-400 font-bold uppercase text-center py-2">
                                Sin comentarios aún. ¡Sé el primero en apoyar!
                              </p>
                            )}
                            {post.comments.map((comm, cIdx) => (
                              <div key={cIdx} className="text-xs space-y-1 pb-2.5 border-b border-utp-border last:border-b-0 last:pb-0">
                                <div className="flex justify-between items-center text-[9px] font-black uppercase tracking-wider">
                                  <span 
                                    onClick={() => openProfile(comm.authorName)}
                                    className="font-black text-black hover:text-[#B50E30] hover:underline cursor-pointer transition-colors"
                                    title="Ver Perfil Profesional"
                                  >
                                    {comm.authorName}
                                  </span>
                                  <span className="text-neutral-400">{comm.date}</span>
                                </div>
                                <p className="text-neutral-700 font-semibold pl-1">{comm.content}</p>
                              </div>
                            ))}

                            {/* Add comment form */}
                            <form onSubmit={(e) => handleCommentSubmit(e, post.id)} className="pt-1">
                              <div className="flex items-end gap-2">
                                <textarea
                                  value={commentInputs[post.id] || ""}
                                  onChange={(e) => setCommentInputs({ ...commentInputs, [post.id]: e.target.value })}
                                  placeholder="Escribe un comentario de apoyo académico..."
                                  className="flex-1 bg-white outline-none border border-utp-border rounded-none px-3 py-2 text-xs font-semibold text-black resize-none"
                                  rows={2}
                                />
                                <button
                                  type="submit"
                                  className="bg-[#B50E30] hover:bg-[#85061B] text-white shrink-0 p-2.5 rounded-none transition flex items-center justify-center cursor-pointer"
                                >
                                  <Send className="h-3.5 w-3.5" />
                                </button>
                              </div>
                            </form>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                  );
                })}
              </motion.div>
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
                  <button
                    type="button"
                    onClick={() => openProfile(c.name)}
                    className="text-black hover:text-[#B50E30] text-xs font-black uppercase tracking-wider px-3 py-1.5 rounded-none hover:bg-neutral-50 transition cursor-pointer"
                  >
                    Ver Perfil
                  </button>
                  <button
                    type="button"
                    onClick={() => handleConnect(c.id)}
                    disabled={c.isConnected || c.isPending}
                    className={`px-4 py-2.5 rounded-none text-xs font-black uppercase tracking-widest transition flex items-center gap-1 cursor-pointer border ${
                      c.isConnected 
                        ? "bg-neutral-100 text-neutral-500 border-neutral-200" 
                        : c.isPending 
                          ? "bg-neutral-50 text-neutral-400 border-utp-border" 
                          : "bg-[#B50E30] hover:bg-[#85061B] text-white border-[#B50E30] shadow-none"
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
                  </button>
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
            className="fixed inset-0 bg-neutral-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4 overflow-y-auto"
            onClick={() => setSelectedUserProfile(null)}
          >
            <motion.div
              initial={{ scale: 0.95, y: 15 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 15 }}
              transition={{ type: "spring", duration: 0.4 }}
              className="bg-white rounded-none max-w-md w-full p-6 shadow-none border-l-4 border-l-[#B50E30] border-t border-b border-r border-utp-border relative space-y-5"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button */}
              <button
                type="button"
                onClick={() => setSelectedUserProfile(null)}
                className="absolute top-4 right-4 p-1.5 rounded-none text-neutral-450 hover:text-black hover:bg-neutral-50 transition cursor-pointer border border-utp-border"
              >
                <X className="h-4.5 w-4.5" />
              </button>

              {/* Top decoration segment */}
              <div className="flex items-center gap-1.5 pb-2 border-b border-utp-border">
                <span className="text-[10px] uppercase font-black px-2.5 py-0.5 rounded-none tracking-wide bg-black text-white">
                  {selectedUserProfile.type}
                </span>
                <span className="text-[10px] font-black text-neutral-400">ID: UTP-{selectedUserProfile.xp + 1092}</span>
              </div>

              {/* Main Avatar & General Stats Info */}
              <div className="flex items-center gap-4">
                <div className="h-16 w-16 bg-black text-white rounded-none flex items-center justify-center text-lg font-black shrink-0 border border-black relative">
                  {selectedUserProfile.name.replace("Ing. ", "").replace("Lic. ", "").slice(0, 2).toUpperCase()}
                  <div className="absolute -bottom-1.5 -right-1.5 h-6 w-6 bg-[#B50E30] border border-white rounded-none flex items-center justify-center text-[10px] font-black text-white">
                    {selectedUserProfile.level}
                  </div>
                </div>

                <div className="space-y-0.5 min-w-0">
                  <h3 className="text-base font-black uppercase text-black tracking-tight truncate">{selectedUserProfile.name}</h3>
                  <p className="text-xs font-extrabold text-[#B50E30] uppercase tracking-wider truncate">{selectedUserProfile.targetRole}</p>
                  <p className="text-[11px] text-neutral-500 font-bold uppercase tracking-tight truncate">{selectedUserProfile.career} • {selectedUserProfile.semester}º Ciclo</p>
                </div>
              </div>

              {/* Bio block */}
              <div className="bg-neutral-50 p-4 rounded-none border border-utp-border">
                <h4 className="text-[9px] font-black text-neutral-450 uppercase tracking-wider mb-1">Acerca de</h4>
                <p className="text-xs text-neutral-800 leading-relaxed font-semibold italic">
                  "{selectedUserProfile.bio}"
                </p>
              </div>

              {/* Skill chips container */}
              <div className="space-y-2">
                <h4 className="text-[9px] font-black text-[#B50E30] uppercase tracking-wider flex items-center gap-1">
                  <Award className="h-4 w-4" />
                  Habilidades Destacadas
                </h4>
                <div className="flex flex-wrap gap-1">
                  {selectedUserProfile.skills.map((s: string) => (
                    <span
                      key={s}
                      className="bg-black text-white text-[10px] font-bold px-2.5 py-1 uppercase tracking-tight rounded-none"
                    >
                      {s}
                    </span>
                  ))}
                </div>
              </div>

              {/* Dynamic stats row */}
              <div className="grid grid-cols-2 gap-3 py-1 border-t border-b border-utp-border">
                <div className="text-center py-2.5 bg-neutral-50 rounded-none border border-utp-border">
                  <span className="text-[9px] font-black uppercase text-neutral-400 block pb-0.5">Puntos de XP</span>
                  <span className="text-xs font-black text-black uppercase">{selectedUserProfile.xp} XP</span>
                </div>
                <div className="text-center py-2.5 bg-neutral-50 rounded-none border border-utp-border">
                  <span className="text-[9px] font-black uppercase text-neutral-450 block pb-0.5">Rango Académico</span>
                  <span className="text-xs font-black text-[#B50E30] uppercase">MEMBER L{selectedUserProfile.level}</span>
                </div>
              </div>

              {/* CTA Action Panel */}
              <div className="flex justify-end gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setSelectedUserProfile(null)}
                  className="px-4 py-2 border border-black text-black hover:bg-neutral-50 rounded-none text-xs font-black uppercase tracking-wider transition cursor-pointer"
                >
                  Cerrar
                </button>

                {selectedUserProfile.name.includes("Tú") ? (
                  <div className="px-4 py-2 bg-neutral-100 text-neutral-400 border border-neutral-200 rounded-none text-xs font-bold uppercase select-none">
                    Tú (Estudiante)
                  </div>
                ) : connectedProfiles[selectedUserProfile.name] || selectedUserProfile.name.includes("Andrea Salazar") ? (
                  <div className="px-4 py-2 bg-neutral-50 text-black border border-utp-border rounded-none text-xs font-black uppercase tracking-widest flex items-center gap-1.5 select-none">
                    <Check className="h-3.5 w-3.5 text-[#B50E30] stroke-[3]" />
                    Conectados
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => handleUserProfileConnect(selectedUserProfile.name)}
                    className="px-5 py-2 bg-[#B50E30] hover:bg-[#85061B] text-white rounded-none text-xs font-black uppercase tracking-widest transition flex items-center gap-1.5 cursor-pointer shadow-none"
                  >
                    <HeartHandshake className="h-3.5 w-3.5" />
                    Conectar
                  </button>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
