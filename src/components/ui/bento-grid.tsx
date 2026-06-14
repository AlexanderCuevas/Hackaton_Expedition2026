import { cn } from "@/src/lib/utils";
import {
  CheckCircle,
  Clock,
  Star,
  TrendingUp,
  Video,
  Globe,
} from "lucide-react";

export interface BentoItem {
  title: string;
  description: string;
  icon: React.ReactNode;
  status?: string;
  tags?: string[];
  meta?: string;
  cta?: string;
  colSpan?: number;
  hasPersistentHover?: boolean;
}

interface BentoGridProps {
  items: BentoItem[];
  className?: string;
  itemClassName?: string;
}

function BentoGrid({ items, className, itemClassName }: BentoGridProps) {
  return (
    <div className={cn("grid grid-cols-1 gap-3", className)}>
      {items.map((item, index) => (
        <div
          key={index}
          className={cn(
            "group relative p-4 overflow-hidden transition-all duration-200 border bg-white",
            "hover:-translate-y-0.5 will-change-transform h-full flex flex-col",
            item.colSpan || "col-span-1",
            item.colSpan === 2 ? "md:col-span-2" : "",
            {
              "border-black": item.hasPersistentHover || !item.status,
              "border-utp-border": !item.hasPersistentHover,
              "-translate-y-0.5": item.hasPersistentHover,
            },
            itemClassName
          )}
        >
          {/* Accent line on the left for persistent hover items */}
          {item.hasPersistentHover && (
            <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#B50E30]" />
          )}

          <div className="relative flex flex-col flex-1 gap-2.5">
            {/* Header: icon + status */}
            <div className="flex items-center justify-between">
              <div className="w-7 h-7 flex items-center justify-center bg-black/5 group-hover:bg-black/10 transition-colors">
                {item.icon}
              </div>
              {item.status && (
                <span
                  className={cn(
                    "text-[9px] utp-hero px-1.5 py-0.5 uppercase tracking-wider",
                    item.status === "Critica" || item.status === "alta"
                      ? "bg-[#B50E30] text-white"
                      : item.status === "Media" || item.status === "media"
                        ? "bg-black text-white"
                        : "bg-neutral-200 text-black"
                  )}
                >
                  {item.status}
                </span>
              )}
            </div>

            {/* Title */}
            <h3 className="utp-hero text-xs text-black uppercase tracking-tight leading-tight">
              {item.title}
            </h3>

            {/* Description */}
            <p className="text-[11px] text-neutral-600 utp-body leading-relaxed line-clamp-3">
              {item.description}
            </p>

            {/* Footer: tags + meta */}
            <div className="flex items-center justify-between gap-2 mt-auto pt-2 border-t border-utp-border">
              <div className="flex items-center gap-1.5 flex-wrap">
                {item.tags?.map((tag, i) => (
                  <span
                    key={i}
                    className="text-[8px] utp-cta text-neutral-500 uppercase tracking-wider"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
              {item.meta && (
                <span className="text-[9px] text-neutral-400 utp-subtitle truncate max-w-[60%] text-right">
                  {item.meta}
                </span>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export { BentoGrid }
