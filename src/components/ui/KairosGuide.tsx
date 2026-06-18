import { motion, AnimatePresence } from "motion/react";
import { X } from "lucide-react";
import kairosAvatar from "../assets/Avatar.png";

export type KairosCard = {
  title: string;
  text: string;
};

export function getKairosWizardCards(
  step: number,
  cvMode: "upload" | "harvard",
  skillsTab: "hard" | "soft",
): KairosCard[] {
  if (step === 1 && cvMode === "upload") {
    return [
      {
        title: "Tu CV",
        text: "Este es tu punto de partida. Cuanto más claro y actualizado esté tu CV, mejor personalizaremos tu ruta y oportunidades.",
      },
      {
        title: "Sube tu PDF",
        text: "Arrastra o selecciona un PDF legible, idealmente de 1 a 2 páginas. Evita escaneos borrosos o archivos protegidos.",
      },
      {
        title: "Contacto",
        text: "Completa email y teléfono: son lo primero que revisan los reclutadores antes de leer tu experiencia.",
      },
      {
        title: "Atajo con IA",
        text: "Si tienes código UTP, usa «Extraer datos con IA» para completar tu información automáticamente y ahorrar tiempo.",
      },
    ];
  }

  if (step === 1 && cvMode === "harvard") {
    return [
      {
        title: "Plantilla Harvard",
        text: "Si es tu primera vez, esta plantilla te guía paso a paso. No necesitas experiencia laboral formal para empezar.",
      },
      {
        title: "Resumen",
        text: "Escribe un resumen breve: quién eres, qué estudias y qué tipo de oportunidad buscas.",
      },
      {
        title: "Proyectos",
        text: "Incluye proyectos académicos, hackathons y voluntariados como experiencia real. Usa verbos de acción: diseñé, implementé, coordiné…",
      },
      {
        title: "Contacto",
        text: "Verifica tu correo UTP y agrega teléfono. Un perfil completo genera mejores recomendaciones.",
      },
    ];
  }

  if (step === 2) {
    return [
      {
        title: "Experiencia",
        text: "Sé honesto con tu nivel actual. No hay respuesta incorrecta: esto calibra las vacantes y recomendaciones que verás.",
      },
      {
        title: "Primer empleo",
        text: "Ideal si vienes de proyectos universitarios o aún no tienes práctica formal. Tu potencial también cuenta.",
      },
      {
        title: "Prácticas",
        text: "Incluye labs, hackathons, voluntariados y proyectos académicos relevantes para tu carrera.",
      },
      {
        title: "Profesional",
        text: "Selecciona esta opción si ya completaste prácticas pre-profesionales o tienes experiencia laboral formal.",
      },
    ];
  }

  if (step === 3) {
    return [
      {
        title: "Tus metas",
        text: "Elige entre 2 y 4 áreas donde quieres especializarte. Esto define tu rol objetivo y las vacantes que te mostraremos.",
      },
      {
        title: "Sugerencias",
        text: "Prioriza áreas alineadas a tu carrera y a lo que realmente te interesa desarrollar.",
      },
      {
        title: "Combina áreas",
        text: "Puedes mezclar especializaciones, por ejemplo Backend + Cloud o UX + Research.",
      },
      {
        title: "Área propia",
        text: "Si no encuentras la tuya en las sugerencias, escríbela en el campo de abajo y presiona Enter.",
      },
    ];
  }

  if (step === 4 && skillsTab === "hard") {
    return [
      {
        title: "Habilidades técnicas",
        text: "Son herramientas concretas que usarías en un puesto: lenguajes, frameworks, software o metodologías.",
      },
      {
        title: "Sé preciso",
        text: "Incluye solo lo que realmente dominas o has usado en proyectos. Un perfil honesto convence más.",
      },
      {
        title: "Sugerencias",
        text: "Prioriza tecnologías demandadas en tu área de especialización. Quita las que no apliquen.",
      },
      {
        title: "Siguiente paso",
        text: "Después confirma también tus habilidades blandas en la otra pestaña para continuar.",
      },
    ];
  }

  if (step === 4 && skillsTab === "soft") {
    return [
      {
        title: "Habilidades blandas",
        text: "Muestran cómo trabajas con otros: comunicación, liderazgo, adaptabilidad y resolución de problemas.",
      },
      {
        title: "Ejemplos reales",
        text: "Piensa en situaciones concretas: ¿cómo colaboraste en equipo, lideraste o resolviste un conflicto?",
      },
      {
        title: "Recomendadas",
        text: "Comunicación efectiva, pensamiento crítico y trabajo en equipo son muy valoradas por reclutadores.",
      },
      {
        title: "Mínimo requerido",
        text: "Confirma al menos una habilidad blanca además de las técnicas para poder avanzar al resumen.",
      },
    ];
  }

  if (step === 5) {
    return [
      {
        title: "Resumen",
        text: "Última revisión antes de generar tu CV. Si algo no cuadra, vuelve atrás y corrígelo sin perder tu progreso.",
      },
      {
        title: "Contacto",
        text: "Verifica email, teléfono y LinkedIn: son tu primera impresión profesional ante reclutadores.",
      },
      {
        title: "Stack",
        text: "Confirma que habilidades y especialización reflejen lo que realmente sabes y quieres desarrollar.",
      },
      {
        title: "Generar CV",
        text: "Al continuar, creamos tu CV profesional y pasas al análisis ATS inteligente de Despega UTP.",
      },
    ];
  }

  return [];
}

interface KairosGuideProps {
  cards: KairosCard[];
  cardIndex: number;
  onCardIndexChange: (index: number) => void;
  open: boolean;
  onClose: () => void;
  onOpen: () => void;
  placement?: "docked" | "floating";
}

function KairosPanel({
  card,
  safeIndex,
  total,
  cards,
  onCardIndexChange,
  onClose,
  docked,
}: {
  card: KairosCard;
  safeIndex: number;
  total: number;
  cards: KairosCard[];
  onCardIndexChange: (index: number) => void;
  onClose: () => void;
  docked: boolean;
}) {
  return (
    <>
      <div
        className={`bg-white border border-neutral-300 shadow-2xl rounded-2xl p-4 sm:p-5 w-full relative z-10 ${
          docked ? "shadow-md" : ""
        }`}
      >
        <div className="absolute -bottom-[7px] left-8 h-3.5 w-3.5 bg-white border-r border-b border-neutral-300 rotate-45 rounded-br-sm" />

        <div className="flex items-center justify-between mb-2 gap-3">
          <span className="text-[9px] sm:text-[10px] font-black uppercase tracking-[0.18em] text-[#B50E30]">
            {card.title}
          </span>
          <span className="text-[9px] font-black text-neutral-300 shrink-0">
            {safeIndex + 1}/{total}
          </span>
        </div>

        <AnimatePresence mode="wait">
          <motion.p
            key={`${card.title}-${safeIndex}`}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.2 }}
            className="text-xs text-neutral-700 leading-relaxed font-semibold"
          >
            {card.text}
          </motion.p>
        </AnimatePresence>

        <div className="flex items-center justify-between mt-4 pt-3 border-t border-neutral-100 gap-2">
          <div className="flex items-center gap-1.5">
            {cards.map((_, i) => (
              <span
                key={i}
                className={`h-1.5 transition-all duration-200 ${
                  i === safeIndex ? "bg-[#B50E30] w-4" : "bg-neutral-200 w-1.5"
                }`}
              />
            ))}
          </div>
          <div className="flex items-center gap-1.5 sm:gap-2">
            <button
              type="button"
              onClick={() => onCardIndexChange(Math.max(0, safeIndex - 1))}
              disabled={safeIndex === 0}
              className="px-2 sm:px-3 py-1.5 text-[9px] font-black uppercase tracking-wider text-neutral-500 hover:text-black border border-neutral-200 hover:border-neutral-400 transition disabled:opacity-30 disabled:cursor-not-allowed"
            >
              ← Anterior
            </button>
            <button
              type="button"
              onClick={() =>
                safeIndex < total - 1 ? onCardIndexChange(safeIndex + 1) : onClose()
              }
              className="px-3 sm:px-4 py-1.5 text-[9px] font-black uppercase tracking-wider text-white bg-[#B50E30] hover:bg-[#85061B] transition"
            >
              {safeIndex < total - 1 ? "Siguiente →" : "Entendido"}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="h-7 w-7 flex items-center justify-center text-neutral-400 hover:text-neutral-900 border border-neutral-200 hover:border-neutral-400 transition shrink-0"
              aria-label="Cerrar guía de Kairos"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </div>

      <div className={`relative shrink-0 -mt-1 ${docked ? "pl-2" : "pl-3 sm:pl-4"}`}>
        <motion.img
          src={kairosAvatar}
          alt=""
          className={`w-auto object-contain object-top drop-shadow-lg select-none ${
            docked ? "h-36 xl:h-44 mx-auto" : "h-32 sm:h-44 md:h-48"
          }`}
          draggable={false}
          animate={{ y: [0, -3, 0] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        />
        <span className="absolute top-1 right-2 h-2.5 w-2.5 bg-emerald-400 border-2 border-white rounded-full" />
      </div>
    </>
  );
}

export default function KairosGuide({
  cards,
  cardIndex,
  onCardIndexChange,
  open,
  onClose,
  onOpen,
  placement = "floating",
}: KairosGuideProps) {
  if (cards.length === 0) return null;

  const safeIndex = Math.min(cardIndex, cards.length - 1);
  const card = cards[safeIndex];
  const total = cards.length;
  const docked = placement === "docked";

  const rootClass = docked
    ? "w-full"
    : "fixed bottom-4 left-3 sm:bottom-6 sm:left-6 z-[55] pointer-events-none lg:hidden";

  return (
    <div className={rootClass}>
      <AnimatePresence mode="wait">
        {open ? (
          <motion.div
            key="kairos-open"
            initial={{ opacity: 0, y: docked ? 12 : 24, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: docked ? 8 : 16, scale: 0.96 }}
            transition={{ duration: 0.28, ease: "easeOut" }}
            className={`flex flex-col items-start w-full ${docked ? "" : "pointer-events-auto max-w-[min(100vw-1.5rem,340px)]"}`}
            role="dialog"
            aria-label="Guía de Kairos"
          >
            <KairosPanel
              card={card}
              safeIndex={safeIndex}
              total={total}
              cards={cards}
              onCardIndexChange={onCardIndexChange}
              onClose={onClose}
              docked={docked}
            />
          </motion.div>
        ) : (
          <motion.button
            key="kairos-fab"
            type="button"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            onClick={onOpen}
            className={`relative group ${docked ? "mx-auto block" : "pointer-events-auto"}`}
            aria-label="Abrir guía de Kairos"
          >
            <img
              src={kairosAvatar}
              alt=""
              className="h-20 w-20 sm:h-24 sm:w-24 object-contain drop-shadow-lg select-none"
              draggable={false}
            />
            <span className="absolute top-0 right-0 h-3 w-3 bg-emerald-400 border-2 border-white rounded-full" />
            <span className="absolute -top-8 left-1/2 -translate-x-1/2 whitespace-nowrap px-2 py-1 bg-black text-white text-[10px] font-bold rounded-lg opacity-0 group-hover:opacity-100 transition pointer-events-none">
              Kairos
            </span>
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}
