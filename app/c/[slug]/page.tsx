import { notFound } from "next/navigation";
import { getDb, CampaignRow } from "@/lib/db";

export const dynamic = "force-dynamic";

export default function CampaignPage({ params }: { params: { slug: string } }) {
  const db = getDb();
  const c = db
    .prepare(
      `SELECT c.*, u.username, u.display_name
       FROM campaigns c JOIN users u ON u.id = c.creator_id
       WHERE c.slug = ?`
    )
    .get(params.slug) as CampaignRow | undefined;

  if (!c) notFound();

  db.prepare("UPDATE campaigns SET use_count = use_count + 1 WHERE id = ?").run(c.id);
  const used = c.use_count + 1;

  return (
    <div className="mx-auto max-w-3xl pt-10">
      <div className="card overflow-hidden">
        <div className="grid sm:grid-cols-2">
          <div className="checker flex items-center justify-center p-6">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={c.frame_data}
              alt={c.title}
              className="max-h-80 w-full object-contain"
            />
          </div>
          <div className="flex flex-col p-6 sm:p-8">
            <span className="inline-flex w-fit items-center gap-1.5 rounded-full bg-indigo-50 px-3 py-1 text-xs font-bold text-indigo-700">
              {used} orang sudah memakai
            </span>
            <h1 className="mt-3 text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">
              {c.title}
            </h1>
            {c.description && (
              <p className="mt-2 text-sm leading-relaxed text-slate-500">
                {c.description}
              </p>
            )}
            <a
              href={`/kreator/${c.username}`}
              className="mt-4 flex items-center gap-2.5"
            >
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-indigo-100 text-sm font-bold text-indigo-700">
                {c.display_name.charAt(0).toUpperCase()}
              </span>
              <span className="text-sm">
                <span className="block font-bold text-slate-900">{c.display_name}</span>
                <span className="block text-xs text-slate-400">Lihat profil kreator</span>
              </span>
            </a>
            <div className="mt-auto pt-6">
              <a
                href={`/editor?campaign=${c.slug}`}
                className="btn-primary w-full py-4 text-base"
              >
                Pakai Twibbon Ini
              </a>
            </div>
          </div>
        </div>
      </div>

      <div className="card mt-6 p-6">
        <h2 className="text-base font-bold text-slate-900">Cara pakai</h2>
        <ol className="mt-3 space-y-2.5 text-sm text-slate-600">
          {[
            "Klik tombol di atas, lalu upload foto terbaikmu.",
            "Pilih frame campaign ini (sudah terpilih otomatis).",
            "Atur posisi, zoom, dan putar fotomu.",
            "Unduh hasilnya dan bagikan ke media sosial.",
          ].map((t, i) => (
            <li key={i} className="flex gap-3">
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-indigo-100 text-xs font-bold text-indigo-700">
                {i + 1}
              </span>
              <span className="pt-0.5">{t}</span>
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}
