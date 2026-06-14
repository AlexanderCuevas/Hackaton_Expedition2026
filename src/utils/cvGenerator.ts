export interface CvProject {
  nombre: string;
  fechaInicio?: string;
  fechaFin?: string;
  descripcion?: string;
  logros?: string[];
}

export interface CvExperiencia {
  rol: string;
  descripcion: string;
  ubicacion: string;
  fechaInicio: string;
  fechaFin: string;
  logros: string[];
}

export interface CvData {
  name: string;
  career: string;
  email?: string;
  phone?: string;
  linkedin?: string;
  cvResumen?: string;
  formacionUniversidad?: string;
  formacionCarrera?: string;
  formacionCiclo?: string;
  formacionFechaInicio?: string;
  formacionFechaFin?: string;
  formacionLogros?: string;
  experiencia?: CvExperiencia[];
  proyectos?: CvProject[];
  hardSkills?: string[];
  softSkills?: string[];
  experienceLevel?: string;
  targetRole?: string;
}

const MONTHS = ["Enero","Febrero","Marzo","Abril","Mayo","Junio","Julio","Agosto","Setiembre","Octubre","Noviembre","Diciembre"];

function formatMonth(val?: string): string {
  if (!val) return "";
  if (val.startsWith("-")) {
    const m = parseInt(val.slice(1), 10);
    return MONTHS[m - 1] || "";
  }
  if (val.endsWith("-")) {
    return val.slice(0, 4);
  }
  const d = new Date(val + "-01");
  return `${MONTHS[d.getMonth()]} ${d.getFullYear()}`;
}

function safe(val?: string): string {
  return val || "";
}

function bulleter(list: string[]): string {
  return list
    .filter((l) => l.trim())
    .map((l) => `<li>${l}</li>`)
    .join("\n");
}

const SEP = `<hr style="border:none;border-top:1px solid #000;margin:12px 0;">`;

const PRINT_STYLES = `
  @page { margin: 0.6in; size: A4; }
  @media print {
    body { padding: 0 !important; max-width: none !important; }
  }
`;

export function buildHtmlCv(data: CvData): string {
  const periodFormacion =
    data.formacionFechaInicio || data.formacionFechaFin
      ? `${formatMonth(data.formacionFechaInicio) || "?"} - ${formatMonth(data.formacionFechaFin) || "Presente"}`
      : "";

  const skills = [...(data.hardSkills || []), ...(data.softSkills || [])];
  const hasExp = data.experiencia && data.experiencia.length > 0;
  const hasProy = data.proyectos && data.proyectos.some((p) => p.nombre || (p.logros && p.logros.length > 0));

  return `<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>CV - ${data.name}</title>
<style>
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body { font-family: 'Times New Roman', 'Georgia', serif; color: #000; background: #fff; line-height: 1.5; padding: 30px; max-width: 750px; margin: 0 auto; }
  h1 { font-size: 28px; font-weight: 700; text-align: center; margin-bottom: 6px; letter-spacing: -0.3px; }
  .contact-line { text-align: center; font-size: 13px; color: #222; margin-bottom: 6px; }
  .contact-line span { margin: 0 6px; }
  .section-title { font-size: 14px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 0; }
  .entry { margin-bottom: 12px; }
  .entry-header { display: flex; justify-content: space-between; align-items: baseline; }
  .entry-header strong { font-size: 13.5px; }
  .entry-header .date { font-size: 12px; color: #444; }
  .entry p, .entry li { font-size: 12px; color: #222; }
  ul { padding-left: 18px; margin: 4px 0; }
  li { margin-bottom: 3px; }
  .skill-cat { margin-bottom: 3px; font-size: 12px; }
  .skill-cat strong { font-size: 12px; }
  hr { border: none; border-top: 1px solid #000; margin: 12px 0; }
  ${PRINT_STYLES}
</style>
</head>
<body>
  <h1>${data.name}</h1>

  <div class="contact-line">
    <span>Perú</span>
    ${data.phone ? `<span>•</span><span>${data.phone}</span>` : ""}
    ${data.email ? `<span>•</span><span>${data.email}</span>` : ""}
    ${!data.phone && !data.email ? "<span>Sin datos de contacto</span>" : ""}
  </div>

  ${data.linkedin ? `<p style="text-align:center;font-size:11px;color:#444;margin-bottom:6px;">${data.linkedin}</p>` : ""}

  ${data.cvResumen ? `
  <div class="section-title">Sobre Mí</div>
  ${SEP}
  <p style="font-size:12px;color:#222;margin-bottom:12px;">${data.cvResumen}</p>
  ` : ""}

  ${hasExp ? `
  <div class="section-title">Experiencia Profesional</div>
  ${SEP}
  ${data.experiencia!.map((exp) => `
  <div class="entry">
    <div class="entry-header">
      <div>
        <strong>${safe(exp.rol)}</strong>
        ${exp.descripcion ? `<span style="font-size:12px;color:#444;"> — ${exp.descripcion}</span>` : ""}
      </div>
      <span class="date">${formatMonth(exp.fechaInicio) || "?"} - ${formatMonth(exp.fechaFin) || "Presente"}</span>
    </div>
    ${exp.ubicacion ? `<p style="font-size:12px;color:#444;margin:1px 0 2px;">${exp.ubicacion}</p>` : ""}
    ${exp.logros && exp.logros.some(l => l.trim()) ? `<ul>${bulleter(exp.logros)}</ul>` : ""}
  </div>`).join("")}` : ""}

  <div class="section-title">Formación Académica</div>
  ${SEP}
  <div class="entry">
    <div class="entry-header">
      <strong>${safe(data.formacionUniversidad || "Universidad Tecnológica del Perú (UTP)")}</strong>
      ${periodFormacion ? `<span class="date">${periodFormacion}</span>` : ""}
    </div>
    <p style="font-size:12px;color:#222;">${safe(data.formacionCarrera || data.career)}${data.formacionCiclo ? ` — ${data.formacionCiclo}` : ""}</p>
    ${data.formacionLogros ? `<p style="font-size:12px;color:#222;margin-top:2px;">${data.formacionLogros}</p>` : ""}
  </div>

  ${hasProy ? `
  <div class="section-title">Proyectos Destacados</div>
  ${SEP}
  ${data.proyectos!.filter((p) => p.nombre || (p.logros && p.logros.some(l => l.trim()))).map((p) => `
  <div class="entry">
    <div class="entry-header">
      <strong>${safe(p.nombre)}</strong>
      ${p.fechaInicio || p.fechaFin ? `<span class="date">${formatMonth(p.fechaInicio) || "?"} - ${formatMonth(p.fechaFin) || "Presente"}</span>` : ""}
    </div>
    ${p.descripcion ? `<p style="font-size:12px;color:#222;margin:1px 0 2px;">${p.descripcion}</p>` : ""}
    ${p.logros && p.logros.some(l => l.trim()) ? `<ul>${bulleter(p.logros)}</ul>` : ""}
  </div>`).join("")}` : ""}

  ${skills.length > 0 ? `
  <div class="section-title">Habilidades</div>
  ${SEP}
  <p style="font-size:12px;color:#222;line-height:1.8;">${skills.join(" • ")}</p>` : ""}

  <hr style="border:none;border-top:1px solid #000;margin:20px 0 8px;">
  <p style="font-size:9px;color:#666;text-align:center;">CV generado por SkillPath AI — Ruta de Empleabilidad UTP</p>
</body>
</html>`;
}

export function buildPlainTextCv(data: CvData): string {
  const lines: string[] = [];
  lines.push(data.name.toUpperCase());
  lines.push(`Perú${data.phone ? ` | ${data.phone}` : ""}${data.email ? ` | ${data.email}` : ""}`);
  if (data.linkedin) lines.push(data.linkedin);
  lines.push("");

  if (data.cvResumen) {
    lines.push("SOBRE MÍ");
    lines.push("---");
    lines.push(data.cvResumen);
    lines.push("");
  }

  const hasExp = data.experiencia && data.experiencia.length > 0;
  if (hasExp) {
    lines.push("EXPERIENCIA PROFESIONAL");
    lines.push("---");
    data.experiencia!.forEach((exp) => {
      lines.push(`${exp.rol}${exp.descripcion ? ` — ${exp.descripcion}` : ""}`);
      if (exp.ubicacion) lines.push(`  ${exp.ubicacion}`);
      const periodo = `${formatMonth(exp.fechaInicio) || "?"} - ${formatMonth(exp.fechaFin) || "Presente"}`;
      lines.push(`  ${periodo}`);
      if (exp.logros && exp.logros.some(l => l.trim())) {
        exp.logros.filter(l => l.trim()).forEach((l) => lines.push(`  ● ${l}`));
      }
      lines.push("");
    });
  }

  const univ = data.formacionUniversidad || "Universidad Tecnológica del Perú (UTP)";
  const periodo =
    data.formacionFechaInicio || data.formacionFechaFin
      ? ` (${formatMonth(data.formacionFechaInicio) || "?"} - ${formatMonth(data.formacionFechaFin) || "Presente"})`
      : "";
  lines.push("FORMACIÓN ACADÉMICA");
  lines.push("---");
  lines.push(`${univ}${periodo}`);
  if (data.formacionCarrera || data.career) lines.push(`${data.formacionCarrera || data.career}${data.formacionCiclo ? ` — ${data.formacionCiclo}` : ""}`);
  if (data.formacionLogros) lines.push(`Logros: ${data.formacionLogros}`);
  lines.push("");

  const hasProy = data.proyectos && data.proyectos.some((p) => p.nombre || (p.logros && p.logros.length > 0));
  if (hasProy) {
    lines.push("PROYECTOS DESTACADOS");
    lines.push("---");
    data.proyectos!.filter((p) => p.nombre || (p.logros && p.logros.some(l => l.trim()))).forEach((p) => {
      const periodoProy = p.fechaInicio || p.fechaFin ? ` (${formatMonth(p.fechaInicio) || "?"} - ${formatMonth(p.fechaFin) || "Presente"})` : "";
      lines.push(`${p.nombre || "Proyecto"}${periodoProy}`);
      if (p.descripcion) lines.push(`  ${p.descripcion}`);
      if (p.logros && p.logros.some(l => l.trim())) {
        p.logros.filter(l => l.trim()).forEach((l) => lines.push(`  ● ${l}`));
      }
      lines.push("");
    });
  }

  const allSkills = [...(data.hardSkills || []), ...(data.softSkills || [])];
  if (allSkills.length) {
    lines.push("HABILIDADES");
    lines.push("---");
    lines.push(allSkills.join(" • "));
  }

  return lines.join("\n");
}

export function triggerPrintCv(html: string): void {
  const win = window.open("", "_blank");
  if (!win) return;
  win.document.write(html);
  win.document.close();
  win.focus();
  setTimeout(() => win.print(), 500);
}

export function triggerDownloadCv(html: string, filename: string): void {
  const blob = new Blob([html], { type: "text/html;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export function copyPlainTextToClipboard(text: string): Promise<void> {
  return navigator.clipboard.writeText(text);
}
