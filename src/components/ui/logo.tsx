function Logo({
  dark = false,
  showText = true,
  variant,
}: {
  dark?: boolean;
  showText?: boolean;
  variant?: "default" | "dark" | "brand" | "sidebar";
}) {
  const resolved = variant ?? (dark ? "dark" : "default");
  const onBrand = resolved === "brand";
  const onSidebar = resolved === "sidebar";
  const onDark = resolved === "dark" || onBrand || onSidebar;
  const iconStroke = "#B50E30";
  const iconFill = onBrand ? "#FFFFFF" : onSidebar ? "#FFFFFF" : onDark ? "#111" : "#fff";

  return (
    <div className="flex items-center gap-2.5">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 250 250" className="h-9 w-9 shrink-0">
        <g fill="none" stroke={iconStroke} strokeWidth="12" strokeLinecap="round" strokeLinejoin="round">
          <path d="M 40,210 C 40,160 80,160 80,130 L 80,105" />
          <path d="M 55,105 C 55,125 105,125 105,105" />
          <polygon points="80,45 135,65 80,85 25,65" fill={iconFill} strokeWidth="10" />
          <path d="M 108,75 L 120,85 C 122,88 122,95 120,98" strokeWidth="8" />
        </g>
        <circle cx="120" cy="102" r="7" fill={iconStroke} />
      </svg>
      {showText && (
        <div>
          <p className={`font-black text-[15px] uppercase tracking-tight leading-none ${onDark ? "text-white" : "text-black"}`}>
            Despega <span className={onBrand ? "text-white" : "text-[#B50E30]"}>UTP</span>
          </p>
          <p className={`text-[9px] font-bold uppercase tracking-widest mt-0.5 ${onSidebar ? "text-white/50" : onBrand ? "text-white/60" : onDark ? "text-white/30" : "text-neutral-400"}`}>
            Tu ruta de empleabilidad
          </p>
        </div>
      )}
    </div>
  );
}

export { Logo };
