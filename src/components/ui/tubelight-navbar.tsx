import { motion } from "motion/react";
import { cn } from "@/src/lib/utils";

interface NavItem {
  name: string;
  icon: React.ReactNode;
}

interface NavBarProps {
  items: NavItem[];
  activeTab: string;
  onTabChange: (name: string) => void;
  className?: string;
}

export function NavBar({ items, activeTab, onTabChange, className }: NavBarProps) {
  return (
    <div className={cn("flex items-center gap-1 bg-neutral-100 border border-utp-border rounded-full py-1 px-1", className)}>
      {items.map((item) => {
        const isActive = activeTab === item.name;

        return (
          <button
            key={item.name}
            type="button"
            onClick={() => onTabChange(item.name)}
            className={cn(
              "relative cursor-pointer text-[10px] font-black uppercase tracking-wider px-4 py-1.5 rounded-full transition-colors",
              "text-neutral-500 hover:text-black",
              isActive && "text-black",
            )}
          >
            <span className="flex items-center gap-1.5">
              {item.icon}
              {item.name}
            </span>
            {isActive && (
              <motion.div
                layoutId="tubelamp"
                className="absolute inset-0 w-full bg-white rounded-full -z-10 shadow-sm border border-utp-border"
                initial={false}
                transition={{
                  type: "spring",
                  stiffness: 300,
                  damping: 30,
                }}
              >
                <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-8 h-1 bg-[#B50E30] rounded-t-full">
                  <div className="absolute w-12 h-6 bg-[#B50E30]/20 rounded-full blur-md -top-2 -left-2" />
                  <div className="absolute w-8 h-6 bg-[#B50E30]/20 rounded-full blur-md -top-1" />
                  <div className="absolute w-4 h-4 bg-[#B50E30]/20 rounded-full blur-sm top-0 left-2" />
                </div>
              </motion.div>
            )}
          </button>
        );
      })}
    </div>
  );
}
