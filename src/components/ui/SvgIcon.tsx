import type { SVGProps } from "react";
import iconData from "../../../Icons/iconos-empleabilidad-utp.json";

type IconEntry = { id: string; name: string; svg: string };
type Category = { category_name: string; icons: IconEntry[] };
type DataSet = Record<string, Category>;

const data = iconData as DataSet;

const iconMap = new Map<string, string>();
for (const cat of Object.values(data)) {
  for (const icon of cat.icons) {
    iconMap.set(icon.id, icon.svg);
  }
}

export function getIconSvg(id: string): string | undefined {
  return iconMap.get(id);
}

interface SvgIconProps extends SVGProps<SVGSVGElement> {
  iconId: string;
}

export function SvgIcon({ iconId, className = "w-5 h-5", ...props }: SvgIconProps) {
  const raw = iconMap.get(iconId);
  if (!raw) return null;

  const inner = raw.match(/<svg[^>]*>([\s\S]*?)<\/svg>/);
  const viewBox = raw.match(/viewBox="([^"]*)"/)?.[1] ?? "0 0 24 24";

  if (!inner) return null;

  return (
    <svg
      viewBox={viewBox}
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
      dangerouslySetInnerHTML={{ __html: inner[1] }}
    />
  );
}
