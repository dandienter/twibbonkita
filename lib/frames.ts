export interface Frame {
  id: string;
  name: string;
  src: string;
}

export const BUILTIN_FRAMES: Frame[] = [
  { id: "badge", name: "Badge Lingkaran", src: "/frames/badge.svg" },
  { id: "kotak", name: "Kotak Membulat", src: "/frames/kotak.svg" },
  { id: "gradasi", name: "Bingkai Gradasi", src: "/frames/gradasi.svg" },
  { id: "pita", name: "Pita Bawah", src: "/frames/pita.svg" },
  { id: "minimal", name: "Minimalis", src: "/frames/minimal.svg" },
  { id: "meriah", name: "Meriah", src: "/frames/meriah.svg" },
];

export interface Campaign {
  slug: string;
  title: string;
  description: string;
  frameSrc: string;
  captionTemplate: string;
  createdAt: string;
}

const LS_KEY = "twibbonkita:campaigns";

export function loadCampaigns(): Campaign[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(LS_KEY);
    return raw ? (JSON.parse(raw) as Campaign[]) : [];
  } catch {
    return [];
  }
}

export function saveCampaign(c: Campaign) {
  const all = loadCampaigns().filter((x) => x.slug !== c.slug);
  all.unshift(c);
  localStorage.setItem(LS_KEY, JSON.stringify(all));
}

export function getCampaign(slug: string): Campaign | null {
  return loadCampaigns().find((c) => c.slug === slug) ?? null;
}

export function slugify(s: string): string {
  return (
    s
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "")
      .slice(0, 48) || `campaign-${Date.now().toString(36)}`
  );
}

export function fillCaption(template: string, values: Record<string, string>): string {
  return template.replace(/\[([^\]]+)\]/g, (_, key) => values[key.trim()] ?? `[${key}]`);
}

export function captionFields(template: string): string[] {
  const out: string[] = [];
  const re = /\[([^\]]+)\]/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(template))) {
    const k = m[1].trim();
    if (!out.includes(k)) out.push(k);
  }
  return out;
}
