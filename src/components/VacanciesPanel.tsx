import React from "react";
import { motion } from "motion/react";
import { ArrowRight } from "lucide-react";
import type { Vacancy } from "../types";
import UvpIcon from "./ui/UvpIcon";

interface VacanciesPanelProps {
  vacancies: Vacancy[];
  career: string;
  onApply: (company: string, role: string) => void;
}

function MatchScoreRing({ score }: { score: number }) {
  const radius = 22;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;
  const color = score >= 85 ? "#B50E30" : score >= 70 ? "#EAB308" : "#6B7280";

  return (
    <div className="relative flex items-center justify-center w-14 h-14 shrink-0">
      <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 52 52">
        <circle cx="26" cy="26" r={radius} fill="none" stroke="#E5E5E5" strokeWidth="4" />
        <motion.circle
          cx="26"
          cy="26"
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth="4"
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1.2, ease: "easeOut" }}
        />
      </svg>
      <span className="text-xs font-black text-black">{score}%</span>
    </div>
  );
}

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

export default function VacanciesPanel({ vacancies, career, onApply }: VacanciesPanelProps) {
  return (
    <motion.div
      key="jobs_view"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="space-y-6"
    >
      <div className="bg-white border border-gray-200 p-6 md:p-8 relative overflow-hidden">
        <div className="absolute right-0 top-0 w-32 h-full utp-diagonal-pattern opacity-10 pointer-events-none" />
        <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-[#B50E30]" />
        <h2 className="heading-lg text-black tracking-widest flex items-center gap-2">
          <UvpIcon name="bolsa-trabajo" size={20} className="text-[#B50E30]" />
          Match Inteligente de Vacantes UTP+
        </h2>
        <p className="text-[#64748B] text-xs font-semibold mt-1">
          Solo mostramos vacantes acordes a tu carrera de {career}. El porcentaje indica tu nivel de compatibilidad.
        </p>
      </div>

      <motion.div
        className="grid grid-cols-1 md:grid-cols-2 gap-5"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {vacancies.map((vac) => (
          <motion.div
            key={vac.id}
            variants={cardVariants}
            whileHover={{ y: -4 }}
            className="relative group bg-white border border-gray-200 shadow-[0_4px_20px_rgba(0,0,0,0.05)] hover:shadow-[0_15px_40px_rgba(0,0,0,0.12)] transition-all duration-400 ease-out p-6 md:p-7 overflow-hidden flex flex-col"
          >
            <div className="absolute top-0 left-0 w-1.5 h-full bg-[#B50E30] transform -translate-x-full group-hover:translate-x-0 transition-transform duration-300" />

            <div className="flex justify-between items-start mb-4 gap-3">
              <span className="bg-black text-white text-[10px] md:text-xs font-bold px-3 py-1 uppercase tracking-widest mt-1 shadow-sm shrink-0">
                {vac.company}
              </span>
              <MatchScoreRing score={vac.matchScore} />
            </div>

            <h3 className="heading-lg text-black mb-2 group-hover:text-[#B50E30] transition-colors duration-300 pr-0 md:pr-6">
              {vac.role}
            </h3>

            <div className="flex flex-wrap items-center gap-3 text-gray-400 font-bold text-[10px] md:text-xs uppercase tracking-wider mb-4">
              <span className="flex items-center gap-1">
                <UvpIcon name="buscar" size={14} className="text-[#B50E30]" />
                {vac.location}
              </span>
              <span className="flex items-center gap-1">
                <UvpIcon name="oportunidades-para-ti" size={14} className="text-[#B50E30]" />
                {vac.salary}
              </span>
            </div>

            <p className="text-gray-600 font-medium leading-relaxed text-xs md:text-sm mb-5 line-clamp-2">
              {vac.description}
            </p>

            <div className="mb-5">
              <span className="text-[10px] font-black text-[#B50E30] uppercase tracking-widest block mb-2">
                Habilidades por adquirir:
              </span>
              <div className="flex flex-wrap gap-2">
                {vac.skillsMissing.map((sk) => (
                  <span
                    key={sk}
                    className="border border-gray-200 bg-gray-50 text-black font-bold uppercase text-[10px] px-3 py-1.5 hover:bg-black hover:text-white hover:border-black transition-all cursor-default"
                  >
                    {sk}
                  </span>
                ))}
              </div>
            </div>

            <hr className="border-gray-200 mb-5 group-hover:border-[#B50E30]/20 transition-colors" />

            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mt-auto">
              <div className="flex items-start gap-2 text-gray-400 text-[10px] md:text-xs uppercase font-bold tracking-wide md:max-w-[60%] leading-relaxed group-hover:text-gray-600 transition-colors">
                <UvpIcon name="creatividad-innovacion" size={16} className="text-[#B50E30] shrink-0 mt-0.5" />
                <span>{vac.tipsForApplying.slice(0, 80)}...</span>
              </div>

              <motion.button
                type="button"
                onClick={() => onApply(vac.company, vac.role)}
                whileTap={{ scale: 0.97 }}
                className="group/btn w-full md:w-auto bg-black text-white font-black uppercase tracking-widest text-[11px] px-6 py-3 flex items-center justify-center gap-2 hover:bg-[#B50E30] hover:shadow-[0_8px_20px_rgba(181,14,48,0.3)] transition-all duration-300 shrink-0 cursor-pointer"
              >
                Postular
                <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1.5 transition-transform duration-300" />
              </motion.button>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </motion.div>
  );
}
