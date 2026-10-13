import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { getSessionUser } from "@/lib/session";
import { slugify } from "@/lib/frames";

const LIST_SELECT = `
  SELECT c.id, c.slug, c.title, c.description, c.frame_data, c.caption_template,
         c.use_count, c.created_at, u.username, u.display_name
  FROM campaigns c JOIN users u ON u.id = c.creator_id
`;

export const dynamic = "force-dynamic";

export async function GET() {
  const db = getDb();
  const rows = db
    .prepare(`${LIST_SELECT} ORDER BY c.use_count DESC, c.id DESC LIMIT 100`)
    .all();
  return NextResponse.json({ campaigns: rows });
}

export async function POST(req: Request) {
  const user = getSessionUser();
  if (!user) {
    return NextResponse.json(
      { error: "Kamu harus login untuk membuat campaign." },
      { status: 401 }
    );
  }

  let body: {
    title?: string;
    description?: string;
    frame_data?: string;
    caption_template?: string;
  };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Data tidak valid." }, { status: 400 });
  }

  const title = String(body.title || "").trim();
  const description = String(body.description || "").trim().slice(0, 500);
  const frameData = String(body.frame_data || "");
  const captionTemplate = String(body.caption_template || "").slice(0, 1000);

  if (!title || title.length > 80) {
    return NextResponse.json(
      { error: "Judul wajib diisi (maks 80 karakter)." },
      { status: 400 }
    );
  }
  if (!frameData || frameData.length > 8_000_000) {
    return NextResponse.json(
      { error: "Frame wajib diunggah (maks ~6MB)." },
      { status: 400 }
    );
  }
  if (!frameData.startsWith("data:image/") && !frameData.startsWith("/frames/")) {
    return NextResponse.json({ error: "Format frame tidak valid." }, { status: 400 });
  }

  const db = getDb();
  let slug = slugify(title);
  const base = slug;
  let n = 1;
  while (db.prepare("SELECT id FROM campaigns WHERE slug = ?").get(slug)) {
    n += 1;
    slug = `${base}-${n}`;
  }

  const now = new Date().toISOString();
  db.prepare(
    `INSERT INTO campaigns (slug, title, description, frame_data, caption_template, creator_id, created_at)
     VALUES (?, ?, ?, ?, ?, ?, ?)`
  ).run(slug, title, description, frameData, captionTemplate, user.id, now);

  return NextResponse.json({ ok: true, slug });
}
