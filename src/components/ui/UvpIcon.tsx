import { useMemo } from "react";
import iconData from "@/Icons/iconos-empleabilidad-utp.json";

type IconId = string;

const ALL_ICONS: Record<IconId, string> = {};
for (const category of Object.values(iconData)) {
  for (const icon of category.icons) {
    ALL_ICONS[icon.id] = icon.svg;
  }
}

interface UvpIconProps {
  name: IconId;
  className?: string;
  size?: number;
}

export default function UvpIcon({ name, className = "", size = 24 }: UvpIconProps) {
  const svg = ALL_ICONS[name];

  const wrapped = useMemo(() => {
    if (!svg) return null;
    return svg
      .replace('class="w-full h-full"', `class="w-full h-full"`)
      .replace(/width="\d+"/, "")
      .replace(/height="\d+"/, "");
  }, [svg]);

  if (!wrapped) return null;

  return (
    <span
      className={`inline-flex items-center justify-center shrink-0 ${className}`}
      style={{ width: size, height: size }}
      dangerouslySetInnerHTML={{ __html: wrapped }}
    />
  );
}
