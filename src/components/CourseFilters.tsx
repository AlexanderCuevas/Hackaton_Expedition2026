import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Search, X, ChevronDown, GraduationCap, Briefcase } from "lucide-react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";

interface CourseFiltersProps {
  uniqueCompanies: string[];
  companyFilter: string;
  onCompanyFilterChange: (v: string) => void;
  sortOrder: "asc" | "desc";
  onSortOrderChange: (v: "asc" | "desc") => void;
  searchTerm?: string;
  onSearchTermChange?: (v: string) => void;
}

const EVENT_CATEGORIES = [
  "Feria Laboral",
  "Hackathones",
  "Talleres",
  "Seminarios",
  "Feria de Emprendimiento",
];

export default function CourseFilters({
  uniqueCompanies,
  companyFilter,
  onCompanyFilterChange,
  sortOrder,
  onSortOrderChange,
  searchTerm: externalSearchTerm,
  onSearchTermChange: externalOnSearchTermChange,
}: CourseFiltersProps) {
  const [activeTab, setActiveTab] = useState<"cursos" | "capacitaciones">("cursos");
  const [eventFilter, setEventFilter] = useState<string>("todas");
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [internalSearch, setInternalSearch] = useState("");

  const searchTerm = externalSearchTerm ?? internalSearch;
  const setSearchTerm = externalOnSearchTermChange ?? setInternalSearch;

  const filtersActive = companyFilter !== "todas" || eventFilter !== "todas" || searchTerm !== "";

  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpenDropdown(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const clearAll = () => {
    onCompanyFilterChange("todas");
    setEventFilter("todas");
    setSearchTerm("");
  };

  const TABS = [
    { key: "cursos" as const, label: "Cursos", icon: GraduationCap },
    { key: "capacitaciones" as const, label: "Capacitaciones", icon: Briefcase },
  ];

  const renderDropdown = (
    id: string,
    triggerLabel: string,
    options: { value: string; label: string; active: boolean }[],
    onSelect: (v: string) => void,
  ) => (
    <div className="relative">
      <Button
        variant="outline"
        size="sm"
        onClick={() => setOpenDropdown(openDropdown === id ? null : id)}
        className="h-8 text-[10px] font-black uppercase tracking-widest border-neutral-200 bg-white hover:bg-neutral-50 flex items-center gap-1.5 px-2 cursor-pointer shrink-0"
      >
        <span>{triggerLabel}</span>
        <ChevronDown className={`h-3 w-3 text-neutral-400 shrink-0 transition-transform ${openDropdown === id ? "rotate-180" : ""}`} />
      </Button>
      <AnimatePresence>
        {openDropdown === id && (
          <motion.div
            initial={{ opacity: 0, y: -4, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -4, scale: 0.96 }}
            transition={{ duration: 0.12 }}
            className="absolute top-full mt-1 left-0 z-50"
          >
            <Card className="p-1.5 shadow-lg border-neutral-200 overflow-visible w-max">
              {options.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => { onSelect(opt.value); setOpenDropdown(null); }}
                  className={`w-full text-left px-3 py-2 text-[11px] font-bold uppercase tracking-wider whitespace-nowrap transition cursor-pointer ${
                    opt.active
                      ? "bg-[#B50E30] text-white"
                      : "text-neutral-600 hover:bg-neutral-100 hover:text-black"
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );

  const companyOptions = [
    { value: "todas", label: "Todas las empresas", active: companyFilter === "todas" },
    ...uniqueCompanies.map((c) => ({
      value: c,
      label: c,
      active: companyFilter === c,
    })),
  ];

  const sortOptions = [
    { value: "asc", label: "Menor XP → Mayor XP", active: sortOrder === "asc" },
    { value: "desc", label: "Mayor XP → Menor XP", active: sortOrder === "desc" },
  ];

  const eventOptions = [
    { value: "todas", label: "Todos los tipos", active: eventFilter === "todas" },
    ...EVENT_CATEGORIES.map((cat) => ({
      value: cat,
      label: cat,
      active: eventFilter === cat,
    })),
  ];

  const activeChips: { label: string; onRemove: () => void; key: string }[] = [];

  if (companyFilter !== "todas") {
    activeChips.push({
      label: companyFilter,
      onRemove: () => onCompanyFilterChange("todas"),
      key: `company-${companyFilter}`,
    });
  }

  if (activeTab === "capacitaciones" && eventFilter !== "todas") {
    activeChips.push({
      label: eventFilter,
      onRemove: () => setEventFilter("todas"),
      key: `event-${eventFilter}`,
    });
  }
  if (searchTerm) {
    activeChips.push({
      label: `"${searchTerm}"`,
      onRemove: () => setSearchTerm(""),
      key: "search",
    });
  }

  return (
    <div className="relative" ref={containerRef}>
      {/* Tab bar */}
      <div className="flex w-full border-b border-neutral-200">
        {TABS.map((tab) => {
          const isActive = activeTab === tab.key;
          return (
            <div key={tab.key} className="relative">
              {isActive && (
                <motion.div
                  layoutId="active-filter-tab"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#B50E30]"
                  transition={{ type: "spring", bounce: 0, duration: 0.35 }}
                />
              )}
              <button
                type="button"
                onClick={() => setActiveTab(tab.key)}
                className={`relative flex items-center gap-1.5 px-3 md:px-4 py-2 transition cursor-pointer ${
                  isActive ? "text-[#B50E30]" : "text-neutral-400 hover:text-neutral-600"
                }`}
              >
                <tab.icon className="h-3.5 w-3.5" />
                <span className="text-[10px] md:text-[11px] font-black uppercase tracking-widest">
                  {tab.label}
                </span>
              </button>
            </div>
          );
        })}
      </div>

      {/* Search + dropdowns row */}
      <div className="flex items-center gap-1.5 py-2 bg-white">
        {/* Search */}
        <div className="relative flex-1 min-w-0">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-neutral-400 pointer-events-none" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder={activeTab === "cursos" ? "Buscar cursos..." : "Buscar capacitaciones..."}
            className="w-full h-8 pl-8 pr-2 text-[11px] font-semibold border border-neutral-200 bg-white placeholder:text-neutral-400 focus:outline-none focus:ring-1 focus:ring-[#B50E30] focus:border-[#B50E30] transition"
          />
        </div>

        {/* Company dropdown */}
        {renderDropdown(
          "company",
          companyFilter === "todas" ? "Empresa" : companyFilter,
          companyOptions,
          onCompanyFilterChange,
        )}

        {/* Sort by XP dropdown */}
        {renderDropdown(
          "sort",
          sortOrder === "asc" ? "Menor XP → Mayor XP" : "Mayor XP → Menor XP",
          sortOptions,
          (v) => onSortOrderChange(v as "asc" | "desc"),
        )}

        {/* Event type dropdown (only on capacitaciones tab) */}
        {activeTab === "capacitaciones" && renderDropdown(
          "event",
          eventFilter === "todas" ? "Tipo" : eventFilter,
          eventOptions,
          setEventFilter,
        )}

        {/* Clear button */}
        <AnimatePresence>
          {filtersActive && (
            <motion.div
              initial={{ opacity: 0, width: 0, scale: 0.8 }}
              animate={{ opacity: 1, width: "auto", scale: 1 }}
              exit={{ opacity: 0, width: 0, scale: 0.8 }}
              transition={{ duration: 0.12 }}
            >
              <Button
                variant="ghost"
                size="sm"
                onClick={clearAll}
                className="h-8 text-[9px] font-black uppercase tracking-widest text-neutral-400 hover:text-[#B50E30] px-2 cursor-pointer shrink-0"
              >
                <X className="h-3 w-3 mr-1" />
                Limpiar
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Active chips */}
      <AnimatePresence>
        {activeChips.length > 0 && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="flex flex-wrap gap-1.5 pb-2 overflow-hidden"
          >
            {activeChips.map((chip) => (
              <motion.span
                key={chip.key}
                initial={{ opacity: 0, scale: 0.85 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.85 }}
                transition={{ duration: 0.12 }}
                className="inline-flex items-center gap-1 bg-neutral-100 border border-neutral-200 px-2 py-0.5 text-[10px] font-bold text-neutral-600 uppercase tracking-wider"
              >
                {chip.label}
                <button
                  type="button"
                  onClick={chip.onRemove}
                  className="ml-0.5 hover:text-[#B50E30] transition cursor-pointer"
                >
                  <X className="h-3 w-3" />
                </button>
              </motion.span>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
