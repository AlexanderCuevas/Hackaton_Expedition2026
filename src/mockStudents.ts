export interface MockStudent {
  name: string;
  career: string;
  semester: number;
  code: string;
}

/** Estudiantes simulados recuperados por código UTP tras login/registro */
export const MOCK_STUDENTS_BY_CODE: Record<string, MockStudent> = {
  U20213456: {
    name: "Valeria Alva",
    career: "Administración",
    semester: 8,
    code: "U20213456",
  },
  U22223419: {
    name: "Adrian Quispe",
    career: "Ingeniería de Sistemas",
    semester: 7,
    code: "U22223419",
  },
  U20198765: {
    name: "Camila Ríos",
    career: "Marketing",
    semester: 6,
    code: "U20198765",
  },
  U20204567: {
    name: "Diego Mendoza",
    career: "Derecho",
    semester: 9,
    code: "U20204567",
  },
  U20211234: {
    name: "Sofía Torres",
    career: "Diseño Gráfico / UX-UI",
    semester: 5,
    code: "U20211234",
  },
};

export function normalizeStudentCode(raw: string): string {
  let input = raw.normalize("NFKC").trim();
  if (!input) return "";

  // Aceptar correo institucional UTP: usar solo la parte antes de @
  if (input.includes("@")) {
    input = input.split("@")[0] ?? input;
  }

  const upper = input.toUpperCase().replace(/[\s._-]+/g, "");

  // Extraer U + 8 dígitos aunque venga con texto extra
  const codeMatch = upper.match(/U\d{8}/);
  if (codeMatch) return codeMatch[0];

  const digitsOnly = upper.replace(/^U?(?:TP)?/i, "");
  if (/^\d{8}$/.test(digitsOnly)) {
    return `U${digitsOnly}`;
  }

  return upper.startsWith("U") ? upper : `U${upper}`;
}

export function findStudentByCode(raw: string): MockStudent | null {
  const normalized = normalizeStudentCode(raw);
  if (!normalized) return null;
  return MOCK_STUDENTS_BY_CODE[normalized] ?? null;
}
