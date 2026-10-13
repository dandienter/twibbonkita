"use client";

import { useEffect, useMemo, useState } from "react";

interface Campaign {
  slug: string;
  title: string;
  description: string;
  frame_data: string;
  use_count: number;
  username: string;
  display_name: string;
}

interface Creator {
  username: string;
  display_name: string;
  campaign_count: number;
  total_use: number;
}

export default function Home() {
  const [query, setQuery] = useState("");
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [creators, setCreators] = useState<Creator[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch("/api/campaigns").then((r) => r.json()).catch(() => ({ campaigns: [] })),
      fetch("/api/creators").then((r) => r.json()).catch(() => ({ creators: [] })),
    ]).then(([c, k]) => {
      setCampaigns(c.campaigns ?? []);
      setCreators(k.creators ?? []);
      setLoading(false);
    });
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return campaigns;
    return campaigns.filter(
      (c) =>
        c.title.toLowerCase().includes(q) ||
        c.display_name.toLowerCase().includes(q)
    );
  }, [campaigns, query]);

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-600 via-indigo-600 to-violet-600 px-6 py-14 text-center text-white sm:py-20">
        <div
          className="pointer-events-none absolute inset-0 opacity-20"
          style={{
            backgroundImage:
              "radial-gradient(circle at 20% 30%, #fff 1.5px, transparent 1.5px), radial-gradient(circle at 80% 70%, #fff 1.5px, transparent 1.5px)",
            backgroundSize: "48px 48px",
          }}
        />
        <div className="relative mx-auto max-w-2xl">
          <span className="inline-block rounded-full bg-white/15 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest">
            100% Gratis - Tanpa Watermark
          </span>
          <h1 className="mt-5 text-4xl font-extrabold leading-tight tracking-tight sm:text-6xl">
            Di Sini Kampanye
            <br />
            Menemukanmu
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-base text-indigo-100 sm:text-lg">
            Pilih campaign, upload foto, atur posisi, lalu unduh hasilnya.
            Tanpa watermark, open-source selamanya.
          </p>
          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <a
              href="#campaign"
              className="rounded-xl bg-white px-8 py-3.5 text-base font-bold text-indigo-700 shadow-lg transition-transform hover:scale-[1.02]"
            >
              Jelajahi Campaign
            </a>
            <a
              href="/make"
              className="rounded-xl border-2 border-white/40 px-8 py-3.5 text-base font-bold text-white transition-colors hover:bg-white/10"
            >
              Bikin Campaign
            </a>
          </div>
        </div>
      </section>

      {/* Campaign populer */}
      <section id="campaign" className="mt-12 scroll-mt-20">
        <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <h2 className="section-title">Campaign Populer</h2>
            <p className="mt-1 text-sm text-slate-500">
              Campaign yang paling banyak dipakai oleh pengguna.
            </p>
          </div>
          <div className="relative w-full sm:w-72">
            <svg
              className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
            >
              <circle cx="11" cy="11" r="7" />
              <path d="M21 21l-4.3-4.3" />
            </svg>
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Cari campaign..."
              className="input pl-10"
            />
          </div>
        </div>

        {loading ? (
          <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3">
            {[0, 1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="card animate-pulse overflow-hidden">
                <div className="aspect-square bg-slate-100" />
                <div className="px-4 py-3">
                  <div className="h-4 w-2/3 rounded bg-slate-100" />
                </div>
              </div>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="card mt-6 p-10 text-center text-sm text-slate-500">
            {query
              ? `Tidak ada campaign yang cocok dengan "${query}".`
              : "Belum ada campaign. Jadilah yang pertama membuatnya!"}
          </div>
        ) : (
          <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3">
            {filtered.map((c) => (
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
                  <div className="mt-1 flex items-center justify-between">
                    <p className="truncate text-xs text-slate-400">
                      oleh {c.display_name}
                    </p>
                    <span className="shrink-0 rounded-full bg-indigo-50 px-2.5 py-1 text-[11px] font-bold text-indigo-700">
                      {c.use_count} dipakai
                    </span>
                  </div>
                </div>
              </a>
            ))}
          </div>
        )}
      </section>

      {/* Kreator */}
      {creators.length > 0 && (
        <section className="mt-14">
          <h2 className="section-title">Kreator</h2>
          <p className="mt-1 text-sm text-slate-500">
            Orang-orang di balik campaign favoritmu.
          </p>
          <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {creators.map((k) => (
              <a
                key={k.username}
                href={`/kreator/${k.username}`}
                className="card card-hover flex items-center gap-3 p-4"
              >
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-indigo-100 text-base font-bold text-indigo-700">
                  {k.display_name.charAt(0).toUpperCase()}
                </span>
                <div className="min-w-0">
                  <p className="truncate text-sm font-bold text-slate-900">
                    {k.display_name}
                  </p>
                  <p className="text-xs text-slate-400">
                    {k.campaign_count} template - {k.total_use} dipakai
                  </p>
                </div>
              </a>
            ))}
          </div>
        </section>
      )}

      {/* Features */}
      <section className="mt-14 grid gap-4 sm:grid-cols-3">
        {[
          {
            t: "Tanpa Watermark",
            d: "Hasil unduhan bersih 1080x1080, tidak ada logo menempel.",
            icon: <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />,
          },
          {
            t: "100% Gratis",
            d: "Semua fitur terbuka. Kode sumber bebas dipakai dan dimodifikasi.",
            icon: <path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />,
          },
          {
            t: "Milik Bersama",
            d: "Buat campaign, bagikan link-nya, dan lihat berapa banyak yang memakai.",
            icon: <path d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />,
          },
        ].map((x) => (
          <div key={x.t} className="card p-6">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
              <svg
                className="h-6 w-6"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                {x.icon}
              </svg>
            </div>
            <h3 className="mt-4 text-base font-bold text-slate-900">{x.t}</h3>
            <p className="mt-1 text-sm text-slate-500">{x.d}</p>
          </div>
        ))}
      </section>

      {/* CTA */}
      <section className="card mt-12 flex flex-col items-center bg-gradient-to-br from-slate-900 to-indigo-950 p-8 text-center sm:p-12">
        <h2 className="text-2xl font-extrabold tracking-tight text-white sm:text-3xl">
          Punya campaign sendiri?
        </h2>
        <p className="mt-2 max-w-md text-sm text-slate-300 sm:text-base">
          Daftar gratis, upload frame campaign-mu, dan dapatkan link share yang
          bisa disebar ke siapa pun.
        </p>
        <a
          href="/make"
          className="mt-6 rounded-xl bg-white px-8 py-3.5 text-base font-bold text-indigo-700 shadow-lg transition-transform hover:scale-[1.02]"
        >
          Buat Campaign Gratis
        </a>
      </section>
    </div>
  );
}
