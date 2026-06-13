import { useState } from "react";
import { cn } from "@/src/lib/utils";
import { SocialPost } from "@/src/types";
import {
  ThumbsUp,
  MessageSquare,
  Share2,
  HeartHandshake,
  ChevronLeft,
  ChevronRight,
  Send,
  X,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

const CATEGORY_STYLES: Record<string, string> = {
  proyecto: "bg-black text-white",
  logro: "bg-[#B50E30] text-white",
  ayuda: "bg-amber-600 text-white",
  evento: "bg-emerald-700 text-white",
  general: "bg-neutral-500 text-white",
};

function timeAgo(dateStr: string): string {
  if (dateStr === "Ahora mismo" || dateStr.includes("instante")) return "Ahora mismo";
  if (dateStr.includes("minuto")) return dateStr;
  if (dateStr.includes("hora")) return dateStr;
  if (dateStr.includes("día")) return dateStr;
  return dateStr;
}

interface FeedViewProps {
  posts: SocialPost[];
  onLike: (id: string) => void;
  onComment: (id: string, text: string) => void;
  onOpenProfile?: (name: string) => void;
}

const POSTS_PER_PAGE = 5;

export function FeedView({ posts, onLike, onComment, onOpenProfile }: FeedViewProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [expandedComments, setExpandedComments] = useState<Record<string, boolean>>({});
  const [commentTexts, setCommentTexts] = useState<Record<string, string>>({});
  const [sharedId, setSharedId] = useState<string | null>(null);

  const totalPages = Math.max(1, Math.ceil(posts.length / POSTS_PER_PAGE));
  const safePage = Math.min(currentPage, totalPages);
  const startIdx = (safePage - 1) * POSTS_PER_PAGE;
  const pagePosts = posts.slice(startIdx, startIdx + POSTS_PER_PAGE);

  const paginate = (page: number) => {
    if (page >= 1 && page <= totalPages) setCurrentPage(page);
  };

  return (
    <div className="space-y-4">
      {/* Posts */}
      <AnimatePresence mode="wait">
        <motion.div
          key={safePage}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          transition={{ duration: 0.2 }}
          className="space-y-4"
        >
          {pagePosts.map((post) => {
            const isExpanded = expandedComments[post.id] ?? false;
            const catStyle = CATEGORY_STYLES[post.category] || "bg-neutral-500 text-white";

            return (
              <div key={post.id} className="bg-white rounded-xl border border-gray-200/80 shadow-sm overflow-hidden">
                {/* Post Card */}
                <div className="p-5">
                  {/* Header */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3 min-w-0 flex-1">
                      <img
                        src={`https://ui-avatars.com/api/?name=${encodeURIComponent(post.authorName.replace(" (Tú)", ""))}&background=000&color=fff&size=80`}
                        alt={post.authorName}
                        className="h-11 w-11 rounded-full bg-black border border-gray-200 object-cover shrink-0 mt-0.5"
                      />
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span
                            onClick={() => onOpenProfile?.(post.authorName)}
                            className="text-sm font-semibold text-gray-900 hover:text-[#B50E30] hover:underline cursor-pointer transition-colors"
                          >
                            {post.authorName}
                          </span>
                          <span className={cn("text-[9px] font-bold px-2 py-0.5 rounded-md uppercase tracking-wide", catStyle)}>
                            {post.category}
                          </span>
                        </div>
                        <p className="text-[12px] text-gray-500 font-medium mt-0.5">
                          {post.authorCareer} • {post.authorSemester}º ciclo
                        </p>
                        <p className="text-[11px] text-gray-400 font-medium mt-0.5">
                          {timeAgo(post.date)}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Content */}
                  <p className="text-sm text-gray-800 leading-relaxed mt-4 font-[425] whitespace-pre-line">
                    {post.content}
                  </p>

                  {/* Action Bar */}
                  <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-100">
                    <div className="flex items-center gap-1">
                      {/* Like */}
                      <button
                        type="button"
                        onClick={() => onLike(post.id)}
                        className={cn(
                          "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer",
                          post.likedByUser
                            ? "text-[#B50E30] bg-[#B50E30]/5"
                            : "text-gray-500 hover:text-gray-700 hover:bg-gray-100"
                        )}
                      >
                        <motion.span whileTap={{ scale: 1.25 }} className="flex">
                          <ThumbsUp
                            className={cn(
                              "h-4 w-4",
                              post.likedByUser && "fill-[#B50E30] text-[#B50E30]"
                            )}
                          />
                        </motion.span>
                        <span>{post.likes > 0 ? post.likes : ""} Me gusta</span>
                      </button>

                      {/* Comment */}
                      <button
                        type="button"
                        onClick={() => setExpandedComments((prev) => ({ ...prev, [post.id]: !isExpanded }))}
                        className={cn(
                          "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer",
                          isExpanded
                            ? "text-gray-700 bg-gray-100"
                            : "text-gray-500 hover:text-gray-700 hover:bg-gray-100"
                        )}
                      >
                        <MessageSquare className="h-4 w-4" />
                        <span>{post.comments.length > 0 ? post.comments.length : ""} Comentar</span>
                      </button>
                    </div>

                    <div className="flex items-center gap-1">
                      {/* Share */}
                      <button
                        type="button"
                        onClick={() => {
                          setSharedId(post.id);
                          navigator.clipboard?.writeText(`${window.location.origin}/post/${post.id}`);
                          setTimeout(() => setSharedId(null), 1500);
                        }}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-gray-500 hover:text-gray-700 hover:bg-gray-100 transition cursor-pointer"
                      >
                        <Share2 className="h-4 w-4" />
                        {sharedId === post.id ? "¡Copiado!" : "Compartir"}
                      </button>

                      {/* Connect — opens profile modal */}
                      <button
                        type="button"
                        onClick={() => onOpenProfile?.(post.authorName)}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-gray-500 hover:text-[#B50E30] hover:bg-[#B50E30]/5 transition cursor-pointer"
                      >
                        <HeartHandshake className="h-4 w-4" />
                        Conectar
                      </button>
                    </div>
                  </div>
                </div>

                {/* Inline Comments Section — expand/collapse */}
                <AnimatePresence initial={false}>
                  {isExpanded && (
                    <motion.div
                      key="comments"
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2, ease: "easeInOut" }}
                      className="overflow-hidden border-t border-gray-100"
                    >
                      <div className="px-5 py-4 bg-gray-50/50 space-y-4">
                        {/* Comment list */}
                        {post.comments.length === 0 && (
                          <p className="text-xs text-gray-400 text-center py-2 font-medium">
                            No hay comentarios aún. ¡Sé el primero!
                          </p>
                        )}
                        <div className="space-y-3 max-h-56 overflow-y-auto">
                          {post.comments.map((c, i) => (
                            <div key={i} className="flex items-start gap-2.5">
                              <img
                                src={`https://ui-avatars.com/api/?name=${encodeURIComponent(c.authorName.replace(" (Tú)", ""))}&background=000&color=fff&size=40`}
                                alt={c.authorName}
                                className="h-7 w-7 rounded-full bg-black border border-gray-200 object-cover shrink-0 mt-0.5"
                              />
                              <div className="flex-1 min-w-0">
                                <div className="bg-white rounded-xl px-3.5 py-2.5 border border-gray-200/80 shadow-sm">
                                  <div className="flex items-center justify-between gap-2">
                                    <span
                                      onClick={() => onOpenProfile?.(c.authorName)}
                                      className="text-xs font-semibold text-gray-800 hover:text-[#B50E30] cursor-pointer transition-colors"
                                    >
                                      {c.authorName}
                                    </span>
                                    <span className="text-[9px] text-gray-400 font-medium shrink-0">{c.date}</span>
                                  </div>
                                  <p className="text-xs text-gray-600 mt-0.5 font-[425]">{c.content}</p>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>

                        {/* Comment input */}
                        <form
                          onSubmit={(e) => {
                            e.preventDefault();
                            const text = commentTexts[post.id];
                            if (text?.trim()) {
                              onComment(post.id, text);
                              setCommentTexts((prev) => ({ ...prev, [post.id]: "" }));
                            }
                          }}
                          className="flex items-start gap-2.5"
                        >
                          <img
                            src="https://ui-avatars.com/api/?name=Valeria+Alva&background=000&color=fff&size=40"
                            alt="Tú"
                            className="h-7 w-7 rounded-full bg-black border border-gray-200 object-cover shrink-0 mt-0.5"
                          />
                          <div className="flex-1 flex items-end gap-2">
                            <textarea
                              value={commentTexts[post.id] || ""}
                              onChange={(e) =>
                                setCommentTexts((prev) => ({ ...prev, [post.id]: e.target.value }))
                              }
                              placeholder="Escribe tu comentario..."
                              className="flex-1 bg-white border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs outline-none focus:border-gray-400 resize-none transition font-[425]"
                              rows={2}
                            />
                            <button
                              type="submit"
                              disabled={!commentTexts[post.id]?.trim()}
                              className="bg-gray-900 hover:bg-black text-white rounded-xl px-4 py-2.5 text-xs font-semibold transition flex items-center gap-1.5 disabled:opacity-40 cursor-pointer shrink-0"
                            >
                              <Send className="h-3.5 w-3.5" />
                              Publicar
                            </button>
                          </div>
                        </form>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </motion.div>
      </AnimatePresence>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-1 pt-2 pb-1">
          <button
            type="button"
            onClick={() => paginate(safePage - 1)}
            disabled={safePage <= 1}
            className="p-2 rounded-lg text-gray-500 hover:text-gray-700 hover:bg-gray-100 transition disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>

          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              type="button"
              onClick={() => paginate(page)}
              className={cn(
                "min-w-[36px] h-9 rounded-lg text-xs font-semibold transition cursor-pointer",
                page === safePage
                  ? "bg-[#B50E30] text-white shadow-sm"
                  : "text-gray-500 hover:text-gray-700 hover:bg-gray-100"
              )}
            >
              {page}
            </button>
          ))}

          <button
            type="button"
            onClick={() => paginate(safePage + 1)}
            disabled={safePage >= totalPages}
            className="p-2 rounded-lg text-gray-500 hover:text-gray-700 hover:bg-gray-100 transition disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      )}
    </div>
  );
}
