import { useState } from "react";
import { cn } from "@/src/lib/utils";
import { SocialPost } from "@/src/types";
import {
  ThumbsUp,
  MessageSquare,
  Share2,
  ChevronDown,
  ChevronUp,
  X,
  Send,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

const CATEGORY_STYLES: Record<string, string> = {
  proyecto: "bg-black text-white",
  logro: "bg-[#B50E30] text-white",
  ayuda: "bg-amber-600 text-white",
  evento: "bg-emerald-700 text-white",
  general: "bg-neutral-500 text-white",
};

interface PostGridProps {
  posts: SocialPost[];
  onLike: (id: string) => void;
  onComment: (id: string, text: string) => void;
  onOpenProfile?: (name: string) => void;
}

export function PostGrid({ posts, onLike, onComment, onOpenProfile }: PostGridProps) {
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});
  const [commentModalId, setCommentModalId] = useState<string | null>(null);
  const [commentText, setCommentText] = useState("");
  const [sharedId, setSharedId] = useState<string | null>(null);

  const modalPost = commentModalId
    ? posts.find((p) => p.id === commentModalId)
    : null;

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {posts.map((post) => {
          const isExpanded = expanded[post.id] ?? false;
          const catStyle = CATEGORY_STYLES[post.category] || "bg-neutral-500 text-white";

          return (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25 }}
              onClick={() => onOpenProfile?.(post.authorName)}
              className="group relative flex flex-col bg-white rounded-xl border border-gray-200/80 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 will-change-transform cursor-pointer"
            >
              {/* Dot pattern background */}
              <div className="absolute inset-0 opacity-[0.015] pointer-events-none">
                <div className="w-full h-full bg-[radial-gradient(circle_at_center,rgba(0,0,0,0.3)_1px,transparent_1px)] bg-[length:4px_4px]" />
              </div>

              {/* Category badge */}
              <div className="absolute top-3 right-3 z-10">
                <span className={cn("text-[9px] font-bold px-2 py-0.5 rounded-md uppercase tracking-wide", catStyle)}>
                  {post.category}
                </span>
              </div>

              <div className="p-4 flex flex-col flex-1 gap-2.5 relative">
                {/* Header: avatar + name + career */}
                <div className="flex items-center gap-2.5">
                  <img
                    src={`https://ui-avatars.com/api/?name=${encodeURIComponent(post.authorName.replace(" (Tú)", ""))}&background=000&color=fff&size=64`}
                    alt={post.authorName}
                    className="h-8 w-8 rounded-lg bg-black border border-gray-200 object-cover shrink-0"
                  />
                  <div className="min-w-0 flex-1">
                    <p className="text-[13px] font-semibold text-gray-900 leading-tight truncate">
                      {post.authorName}
                    </p>
                    <p className="text-[10px] text-gray-500 font-medium truncate">
                      {post.authorCareer} • {post.authorSemester}º ciclo
                    </p>
                  </div>
                </div>

                {/* Content */}
                <div className="flex-1">
                  <p
                    className={cn(
                      "text-xs text-gray-700 leading-relaxed font-[425]",
                      !isExpanded && "line-clamp-3"
                    )}
                  >
                    {post.content}
                  </p>
                  {post.content.length > 120 && (
                    <button
                      type="button"
                      onClick={() =>
                        setExpanded((prev) => ({ ...prev, [post.id]: !isExpanded }))
                      }
                      className="mt-1 text-[10px] font-semibold text-gray-400 hover:text-gray-700 transition-colors flex items-center gap-0.5 cursor-pointer"
                    >
                      {isExpanded ? (
                        <>Mostrar menos <ChevronUp className="h-3 w-3" /></>
                      ) : (
                        <>Ver más <ChevronDown className="h-3 w-3" /></>
                      )}
                    </button>
                  )}
                </div>

                {/* Footer: actions */}
                <div className="flex items-center justify-between pt-2.5 border-t border-gray-100 mt-auto">
                  <div className="flex items-center gap-3">
                    {/* Like */}
                    <button
                      type="button"
                      onClick={() => onLike(post.id)}
                      className={cn(
                        "flex items-center gap-1 transition cursor-pointer",
                        post.likedByUser
                          ? "text-[#B50E30]"
                          : "text-gray-400 hover:text-gray-600"
                      )}
                    >
                      <motion.span whileTap={{ scale: 1.3 }} className="flex">
                        <ThumbsUp
                          className={cn(
                            "h-3.5 w-3.5",
                            post.likedByUser && "fill-[#B50E30] text-[#B50E30]"
                          )}
                        />
                      </motion.span>
                      <span className="text-[11px] font-semibold">{post.likes}</span>
                    </button>

                    {/* Comment */}
                    <button
                      type="button"
                      onClick={() => {
                        setCommentModalId(post.id);
                        setCommentText("");
                      }}
                      className="flex items-center gap-1 text-gray-400 hover:text-gray-600 transition cursor-pointer"
                    >
                      <MessageSquare className="h-3.5 w-3.5" />
                      <span className="text-[11px] font-semibold">{post.comments.length}</span>
                    </button>

                    {/* Share */}
                    <button
                      type="button"
                      onClick={() => {
                        setSharedId(post.id);
                        navigator.clipboard?.writeText(
                          `${window.location.origin}/post/${post.id}`
                        );
                        setTimeout(() => setSharedId(null), 1500);
                      }}
                      className="flex items-center gap-1 text-gray-400 hover:text-gray-600 transition cursor-pointer"
                    >
                      <Share2 className="h-3.5 w-3.5" />
                      {sharedId === post.id && (
                        <span className="text-[9px] text-emerald-600 font-semibold">¡Copiado!</span>
                      )}
                    </button>
                  </div>

                  {/* Hover arrow */}
                  <span className="text-[10px] text-gray-300 opacity-0 group-hover:opacity-100 transition-opacity font-medium">
                    Ver perfil →
                  </span>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Comment Modal */}
      <AnimatePresence>
        {modalPost && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-neutral-900/50 backdrop-blur-xs z-50 flex items-center justify-center p-4"
            onClick={() => setCommentModalId(null)}
          >
            <motion.div
              initial={{ scale: 0.95, y: 10 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 10 }}
              transition={{ type: "spring", duration: 0.35 }}
              className="bg-white rounded-xl max-w-md w-full shadow-xl border border-gray-200 overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="flex items-center justify-between px-5 py-3.5 border-b border-gray-100">
                <h3 className="text-sm font-semibold text-gray-900">
                  Comentarios
                </h3>
                <button
                  type="button"
                  onClick={() => setCommentModalId(null)}
                  className="p-1 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition cursor-pointer"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              {/* Comment list */}
              <div className="px-5 py-3 max-h-52 overflow-y-auto space-y-3">
                {modalPost.comments.length === 0 && (
                  <p className="text-xs text-gray-400 text-center py-4 font-medium">
                    Sin comentarios aún. ¡Sé el primero!
                  </p>
                )}
                {modalPost.comments.map((c, i) => (
                  <div key={i} className="text-xs space-y-0.5 pb-2.5 border-b border-gray-100 last:border-b-0 last:pb-0">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-gray-800">{c.authorName}</span>
                      <span className="text-[9px] text-gray-400">{c.date}</span>
                    </div>
                    <p className="text-gray-600 font-[425]">{c.content}</p>
                  </div>
                ))}
              </div>

              {/* Add comment */}
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (commentText.trim() && commentModalId) {
                    onComment(commentModalId, commentText);
                    setCommentText("");
                    setCommentModalId(null);
                  }
                }}
                className="px-5 py-3.5 border-t border-gray-100 bg-gray-50/50"
              >
                <div className="flex items-end gap-2">
                  <textarea
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    placeholder="Escribe un comentario..."
                    className="flex-1 bg-white border border-gray-200 rounded-lg px-3 py-2 text-xs outline-none focus:border-gray-400 resize-none transition"
                    rows={2}
                    autoFocus
                  />
                  <button
                    type="submit"
                    disabled={!commentText.trim()}
                    className="bg-gray-900 hover:bg-black text-white rounded-lg p-2.5 transition flex items-center justify-center disabled:opacity-40 cursor-pointer shrink-0"
                  >
                    <Send className="h-3.5 w-3.5" />
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
