import { useState } from "react";
import { ChevronLeft, ChevronRight, ThumbsUp, MessageSquare } from "lucide-react";

interface EditorialItem {
  id: string | number;
  quote: string;
  author: string;
  role: string;
  company: string;
  image: string;
  likes?: number;
  likedByUser?: boolean;
  commentsCount?: number;
}

interface EditorialTestimonialProps {
  testimonials: EditorialItem[];
  onLike?: (id: string | number) => void;
  onComment?: (id: string | number) => void;
}

export default function TestimonialsEditorial({ testimonials, onLike, onComment }: EditorialTestimonialProps) {
  const [active, setActive] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const handleChange = (index: number) => {
    if (index === active || isTransitioning) return;
    setIsTransitioning(true);
    setTimeout(() => {
      setActive(index);
      setTimeout(() => setIsTransitioning(false), 50);
    }, 300);
  };

  const handlePrev = () => {
    const newIndex = active === 0 ? testimonials.length - 1 : active - 1;
    handleChange(newIndex);
  };

  const handleNext = () => {
    const newIndex = active === testimonials.length - 1 ? 0 : active + 1;
    handleChange(newIndex);
  };

  if (testimonials.length === 0) return null;

  const current = testimonials[active];

  return (
    <div className="w-full max-w-2xl mx-auto px-6 py-8">
      <div className="flex items-start gap-8">
        <span
          className="text-[120px] font-light leading-none text-black/10 select-none transition-all duration-500"
          style={{ fontFeatureSettings: '"tnum"' }}
        >
          {String(active + 1).padStart(2, "0")}
        </span>

        <div className="flex-1 pt-6">
          <blockquote
            className={`text-2xl md:text-3xl font-light leading-relaxed text-black tracking-tight transition-all duration-300 ${
              isTransitioning ? "opacity-0 translate-x-4" : "opacity-100 translate-x-0"
            }`}
          >
            {current.quote}
          </blockquote>

          <div
            className={`mt-10 group cursor-default transition-all duration-300 delay-100 ${
              isTransitioning ? "opacity-0" : "opacity-100"
            }`}
          >
            <div className="flex items-center gap-4">
              <div className="relative w-12 h-12 rounded-full overflow-hidden ring-2 ring-black/10 group-hover:ring-black/30 transition-all duration-300">
                <img
                  src={current.image}
                  alt={current.author}
                  className="object-cover w-full h-full grayscale group-hover:grayscale-0 transition-all duration-500"
                />
              </div>
              <div>
                <p className="font-medium text-black">{current.author}</p>
                <p className="text-sm text-neutral-500">
                  {current.role}
                  <span className="mx-2 text-black/20">/</span>
                  <span className="group-hover:text-black transition-colors duration-300">{current.company}</span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Like & Comment buttons */}
      <div className={`flex items-center gap-4 mt-8 transition-all duration-300 delay-150 ${
        isTransitioning ? "opacity-0" : "opacity-100"
      }`}>
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
          onClick={() => onComment?.(current.id)}
          className="flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-neutral-500 hover:text-[#B50E30] transition cursor-pointer"
        >
          <MessageSquare className="h-4 w-4" />
          <span>{current.commentsCount ?? 0} Comentarios</span>
        </button>
      </div>

      {/* Navigation */}
      <div className="mt-8 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-3">
            {testimonials.map((_, index) => (
              <button key={index} onClick={() => handleChange(index)} className="group relative py-4">
                <span
                  className={`block h-px transition-all duration-500 ease-out ${
                    index === active
                      ? "w-12 bg-black"
                      : "w-6 bg-black/20 group-hover:w-8 group-hover:bg-black/40"
                  }`}
                />
              </button>
            ))}
          </div>
          <span className="text-xs text-neutral-500 tracking-widest uppercase">
            {String(active + 1).padStart(2, "0")} / {String(testimonials.length).padStart(2, "0")}
          </span>
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={handlePrev}
            className="p-2 rounded-full text-black/40 hover:text-black hover:bg-black/5 transition-all duration-300"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={handleNext}
            className="p-2 rounded-full text-black/40 hover:text-black hover:bg-black/5 transition-all duration-300"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
