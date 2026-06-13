import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Github,
  Twitter,
  Youtube,
  Linkedin,
  ChevronLeft,
  ChevronRight,
  ThumbsUp,
  MessageSquare,
} from "lucide-react";
import { cn } from "@/src/lib/utils";

interface TestimonialItem {
  id: string | number;
  name: string;
  title: string;
  description: string;
  imageUrl: string;
  likes?: number;
  likedByUser?: boolean;
  commentsCount?: number;
  comments?: { authorName: string; content: string; date: string }[];
}

interface TestimonialCarouselProps {
  testimonials: TestimonialItem[];
  onLike?: (id: string | number) => void;
  onComment?: (id: string | number, text: string) => void;
  className?: string;
}

export function TestimonialCarousel({ testimonials: items, onLike, onComment, className }: TestimonialCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showCommentModal, setShowCommentModal] = useState(false);
  const [commentText, setCommentText] = useState("");

  if (items.length === 0) return null;

  const handleNext = () =>
    setCurrentIndex((index) => (index + 1) % items.length);
  const handlePrevious = () =>
    setCurrentIndex(
      (index) => (index - 1 + items.length) % items.length
    );

  const current = items[currentIndex];

  const socialIcons = [
    { icon: Github, url: "#", label: "GitHub" },
    { icon: Twitter, url: "#", label: "Twitter" },
    { icon: Youtube, url: "#", label: "YouTube" },
    { icon: Linkedin, url: "#", label: "LinkedIn" },
  ];

  return (
    <div className={cn("w-full max-w-5xl mx-auto px-4 py-8", className)}>
      {/* Desktop layout */}
      <div className="hidden md:flex relative items-center">
        {/* Avatar */}
        <div className="w-[470px] h-[470px] rounded-3xl overflow-hidden bg-gray-200 flex-shrink-0">
          <AnimatePresence mode="wait">
            <motion.div
              key={current.imageUrl}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4, ease: "easeInOut" }}
              className="w-full h-full"
            >
              <img
                src={current.imageUrl}
                alt={current.name}
                className="w-full h-full object-cover"
                draggable={false}
              />
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Card */}
        <div className="bg-white rounded-3xl shadow-2xl p-8 ml-[-80px] z-10 max-w-xl flex-1">
          <AnimatePresence mode="wait">
            <motion.div
              key={current.name}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4, ease: "easeInOut" }}
            >
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  {current.name}
                </h2>
                <p className="text-sm font-medium text-gray-700">
                  {current.title}
                </p>
              </div>

              <p className="text-black text-base leading-relaxed mb-8">
                {current.description}
              </p>

              {/* Like & Comment buttons */}
              <div className="flex items-center gap-4 mb-6">
                <button
                  type="button"
                  onClick={() => onLike?.(current.id)}
                  className={`flex items-center gap-1.5 text-xs font-black uppercase tracking-wider transition cursor-pointer ${
                    current.likedByUser ? "text-[#B50E30]" : "text-neutral-500 hover:text-[#B50E30]"
                  }`}
                >
                  <ThumbsUp className={`h-4 w-4 ${current.likedByUser ? "fill-[#B50E30] text-[#B50E30]" : ""}`} />
                  <span>{current.likes ?? 0} Likes</span>
                </button>
                <button
                  type="button"
                  onClick={() => setShowCommentModal(true)}
                  className="flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-neutral-500 hover:text-[#B50E30] transition cursor-pointer"
                >
                  <MessageSquare className="h-4 w-4" />
                  <span>{current.commentsCount ?? 0} Comentarios</span>
                </button>
              </div>

              <div className="flex space-x-4">
                {socialIcons.map(({ icon: IconComponent, url, label }) => (
                  <a
                    key={label}
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-12 h-12 bg-gray-900 rounded-full flex items-center justify-center transition-colors hover:bg-gray-800 hover:scale-105 cursor-pointer"
                    aria-label={label}
                  >
                    <IconComponent className="w-5 h-5 text-white" />
                  </a>
                ))}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Mobile layout */}
      <div className="md:hidden max-w-sm mx-auto text-center bg-transparent">
        <div className="w-full aspect-square bg-gray-200 rounded-3xl overflow-hidden mb-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={current.imageUrl}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4, ease: "easeInOut" }}
              className="w-full h-full"
            >
              <img
                src={current.imageUrl}
                alt={current.name}
                className="w-full h-full object-cover"
                draggable={false}
              />
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="px-4">
          <AnimatePresence mode="wait">
            <motion.div
              key={current.name}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4, ease: "easeInOut" }}
            >
              <h2 className="text-xl font-bold text-gray-900 mb-2">
                {current.name}
              </h2>
              <p className="text-sm font-medium text-gray-600 mb-4">
                {current.title}
              </p>
              <p className="text-black text-sm leading-relaxed mb-6">
                {current.description}
              </p>

              <div className="flex justify-center gap-4 mb-6">
                <button
                  type="button"
                  onClick={() => onLike?.(current.id)}
                  className={`flex items-center gap-1.5 text-xs font-black uppercase tracking-wider transition cursor-pointer ${
                    current.likedByUser ? "text-[#B50E30]" : "text-neutral-500 hover:text-[#B50E30]"
                  }`}
                >
                  <ThumbsUp className={`h-4 w-4 ${current.likedByUser ? "fill-[#B50E30] text-[#B50E30]" : ""}`} />
                  <span>{current.likes ?? 0}</span>
                </button>
                <button
                  type="button"
                  onClick={() => setShowCommentModal(true)}
                  className="flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-neutral-500 hover:text-[#B50E30] transition cursor-pointer"
                >
                  <MessageSquare className="h-4 w-4" />
                  <span>{current.commentsCount ?? 0}</span>
                </button>
              </div>

              <div className="flex justify-center space-x-4">
                {socialIcons.map(({ icon: IconComponent, url, label }) => (
                  <a
                    key={label}
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-12 h-12 bg-gray-900 rounded-full flex items-center justify-center transition-colors hover:bg-gray-800 cursor-pointer"
                    aria-label={label}
                  >
                    <IconComponent className="w-5 h-5 text-white" />
                  </a>
                ))}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Comment Modal */}
      <AnimatePresence>
        {showCommentModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4"
            onClick={() => setShowCommentModal(false)}
          >
            <motion.div
              initial={{ scale: 0.95, y: 10 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 10 }}
              className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-xl"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-lg font-bold text-gray-900 mb-1">Comentarios</h3>
              <p className="text-sm text-gray-500 mb-4">
                {current.name} • {current.title}
              </p>

              {/* Existing comments */}
              {current.comments && current.comments.length > 0 && (
                <div className="mb-4 max-h-48 overflow-y-auto space-y-2 border-b border-gray-100 pb-4">
                  {current.comments.map((c, i) => (
                    <div key={i} className="bg-gray-50 rounded-xl p-3 text-sm">
                      <div className="flex items-center justify-between text-xs font-bold text-gray-500 mb-1">
                        <span>{c.authorName}</span>
                        <span>{c.date}</span>
                      </div>
                      <p className="text-gray-800">{c.content}</p>
                    </div>
                  ))}
                </div>
              )}

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (commentText.trim()) {
                    onComment?.(current.id, commentText);
                    setCommentText("");
                    setShowCommentModal(false);
                  }
                }}
              >
                <textarea
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  placeholder="Escribe un comentario..."
                  className="w-full p-3 border border-gray-200 rounded-xl text-sm outline-none focus:border-black resize-none"
                  rows={3}
                  autoFocus
                />
                <div className="flex justify-end gap-2 mt-3">
                  <button
                    type="button"
                    onClick={() => setShowCommentModal(false)}
                    className="px-4 py-2 text-sm font-semibold text-gray-600 hover:text-black transition"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    disabled={!commentText.trim()}
                    className="px-5 py-2 bg-black text-white text-sm font-semibold rounded-xl hover:bg-neutral-900 disabled:opacity-40 transition"
                  >
                    Enviar
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Bottom navigation */}
      <div className="flex justify-center items-center gap-6 mt-8">
        <button
          onClick={handlePrevious}
          aria-label="Previous testimonial"
          className="w-12 h-12 rounded-full bg-gray-100 border border-gray-300 shadow-md flex items-center justify-center hover:bg-gray-200 transition-colors cursor-pointer"
        >
          <ChevronLeft className="w-6 h-6 text-gray-700" />
        </button>

        <div className="flex gap-2">
          {items.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={cn(
                "w-3 h-3 rounded-full transition-colors cursor-pointer",
                index === currentIndex
                  ? "bg-gray-900"
                  : "bg-gray-400"
              )}
              aria-label={`Go to testimonial ${index + 1}`}
            />
          ))}
        </div>

        <button
          onClick={handleNext}
          aria-label="Next testimonial"
          className="w-12 h-12 rounded-full bg-gray-100 border border-gray-300 shadow-md flex items-center justify-center hover:bg-gray-200 transition-colors cursor-pointer"
        >
          <ChevronRight className="w-6 h-6 text-gray-700" />
        </button>
      </div>
    </div>
  );
}
