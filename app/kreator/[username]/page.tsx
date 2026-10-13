import { notFound } from "next/navigation";
import { getDb } from "@/lib/db";

export const dynamic = "force-dynamic";

export default function CreatorPage({
  params,
}: {
  params: { username: string };
}) {
  const db = getDb();
  const user = db
    .prepare(
      "SELECT id, username, display_name, created_at FROM users WHERE username = ?"
    )
    .get(params.username.toLowerCase()) as
    | { id: number; username: string; display_name: string; created_at: string }
    | undefined;

  if (!user) notFound();

  const campaigns = db
    .prepare(
      `SELECT slug, title, description, frame_data, use_count, created_at
       FROM campaigns WHERE creator_id = ? ORDER BY use_count DESC, id DESC`
    )
    .all(user.id) as Array<{
    slug: string;
    title: string;
    description: string;
    frame_data: string;
    use_count: number;
    created_at: string;
  }>;

  const totalUse = campaigns.reduce((s, c) => s + c.use_count, 0);

  return (
    <div className="mx-auto max-w-5xl pt-10">
      <div className="card flex flex-col items-center p-8 text-center sm:flex-row sm:text-left">
        <span className="flex h-20 w-20 shrink-0 items-center justify-center rounded-full bg-indigo-100 text-3xl font-bold text-indigo-700">
          {user.display_name.charAt(0).toUpperCase()}
        </span>
        <div className="mt-4 sm:ml-6 sm:mt-0">
          <h1 className="text-2xl font-extrabold tracking-tight text-slate-900">
            {user.display_name}
          </h1>
          <p className="text-sm text-slate-400">@{user.username}</p>
          <div className="mt-3 flex gap-6">
            <div>
              <p className="text-xl font-extrabold text-slate-900">
                {campaigns.length}
              </p>
              <p className="text-xs text-slate-400">Template</p>
            </div>
            <div>
              <p className="text-xl font-extrabold text-slate-900">{totalUse}</p>
              <p className="text-xs text-slate-400">Kali dipakai</p>
            </div>
          </div>
        </div>
      </div>

      <h2 className="section-title mt-10">Template oleh {user.display_name}</h2>
      {campaigns.length === 0 ? (
        <div className="card mt-4 p-10 text-center text-sm text-slate-500">
          Kreator ini belum membuat template.
        </div>
      ) : (
        <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3">
          {campaigns.map((c) => (
            <a
              key={c.slug}
              href={`/c/${c.slug}`}
              className="card card-hover group overflow-hidden"
            >
              <div className="checker aspect-square w-full">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={c.frame_data}
                  alt={c.title}
                  className="h-full w-full object-contain p-4 transition-transform duration-200 group-hover:scale-105"
                />
              </div>
              <div className="px-4 py-3">
                <p className="truncate text-sm font-semibold text-slate-800">
                  {c.title}
                </p>
                <span className="mt-1 inline-block rounded-full bg-indigo-50 px-2.5 py-1 text-[11px] font-bold text-indigo-700">
                  {c.use_count} dipakai
                </span>
              </div>
            </a>
          ))}
        </div>
      )}
    </div>
  );
}
