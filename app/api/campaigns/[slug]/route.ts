import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET(
  _req: Request,
  { params }: { params: { slug: string } }
) {
  const db = getDb();
  const row = db
    .prepare(
      `SELECT c.id, c.slug, c.title, c.description, c.frame_data, c.caption_template,
              c.use_count, c.created_at, u.username, u.display_name
       FROM campaigns c JOIN users u ON u.id = c.creator_id
       WHERE c.slug = ?`
    )
    .get(params.slug);
  if (!row) {
    return NextResponse.json({ error: "Campaign tidak ditemukan." }, { status: 404 });
  }
  return NextResponse.json({ campaign: row });
}
