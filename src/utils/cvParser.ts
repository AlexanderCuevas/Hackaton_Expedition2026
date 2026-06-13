import { getDocument, GlobalWorkerOptions } from "pdfjs-dist";
import pdfjsWorker from "pdfjs-dist/build/pdf.worker.min.mjs?url";

GlobalWorkerOptions.workerSrc = pdfjsWorker;

export async function extractTextFromPdf(file: File): Promise<string> {
  const buffer = await file.arrayBuffer();
  const pdf = await getDocument({ data: buffer }).promise;
  const pages: string[] = [];

  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const content = await page.getTextContent();
    const pageText = content.items
      .map((item) => ("str" in item ? item.str : ""))
      .join(" ");
    pages.push(pageText);
  }

  return pages.join("\n\n").replace(/\s+/g, " ").trim();
}

export function buildHarvardCvText(sections: {
  resumen: string;
  formacion: string;
  proyectos: string;
  name?: string;
  career?: string;
}): string {
  const header = [
    sections.name ? `NOMBRE: ${sections.name}` : "",
    sections.career ? `CARRERA: ${sections.career}` : "",
  ]
    .filter(Boolean)
    .join("\n");

  return [
    header,
    header ? "" : null,
    "RESUMEN PROFESIONAL",
    sections.resumen.trim(),
    "",
    "FORMACIÓN ACADÉMICA",
    sections.formacion.trim(),
    "",
    "PROYECTOS DESTACADOS",
    sections.proyectos.trim(),
  ]
    .filter((line) => line !== null)
    .join("\n")
    .trim();
}

export function extractProfileHintsFromCv(
  cvText: string,
  career: string,
  careerSkills: string[] = [],
  specializationTags: string[] = [],
  softSkillsPool: string[] = []
): { hardSkills: string[]; softSkills: string[]; specializations: string[] } {
  const normalized = cvText.toLowerCase();

  const matchFromPool = (pool: string[]) =>
    pool.filter((item) => normalized.includes(item.toLowerCase()));

  const hardFromCv = matchFromPool(careerSkills);
  const softFromCv = matchFromPool(softSkillsPool);
  const specsFromCv = matchFromPool(specializationTags);

  const hardSkills =
    hardFromCv.length > 0
      ? hardFromCv
      : careerSkills.slice(0, Math.min(4, careerSkills.length));

  const softSkills =
    softFromCv.length > 0
      ? softFromCv
      : softSkillsPool.slice(0, 4);

  const specializations =
    specsFromCv.length > 0
      ? specsFromCv.slice(0, 3)
      : specializationTags.slice(0, 2);

  return { hardSkills, softSkills, specializations };
}
