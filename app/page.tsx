"use client";

import { useMemo, useState } from "react";
import { BUILTIN_FRAMES } from "@/lib/frames";

export default function Home() {
  const [query, setQuery] = useState("");

  const frames = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return BUILTIN_FRAMES;
    return BUILTIN_FRAMES.filter((f) => f.name.toLowerCase().includes(q));
  }, [query]);

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
            Upload foto, pilih frame favoritmu, atur posisi, lalu unduh hasilnya.
            Tanpa daftar, tanpa watermark, open-source selamanya.
          </p>
          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <a
              href="/editor"
              className="rounded-xl bg-white px-8 py-3.5 text-base font-bold text-indigo-700 shadow-lg transition-transform hover:scale-[1.02]"
            >
              Mulai Sekarang
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

      {/* Search + grid */}
      <section className="mt-12">
        <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <h2 className="section-title">Jelajahi Campaign</h2>
            <p className="mt-1 text-sm text-slate-500">
              Pilih frame di bawah ini, atau buat campaign versimu sendiri.
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
              placeholder="Cari frame..."
              className="input pl-10"
            />
          </div>
        </div>

        {frames.length === 0 ? (
          <div className="card mt-6 p-10 text-center text-sm text-slate-500">
            Tidak ada frame yang cocok dengan &ldquo;{query}&rdquo;.
          </div>
        ) : (
          <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-3">
            {frames.map((f) => (
              <a
                key={f.id}
                href={`/editor?frame=${f.id}`}
                className="card card-hover group overflow-hidden"
              >
                <div className="checker aspect-square w-full">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={f.src}
                    alt={f.name}
                    className="h-full w-full object-contain p-4 transition-transform duration-200 group-hover:scale-105"
                  />
                </div>
                <div className="flex items-center justify-between px-4 py-3">
                  <p className="text-sm font-semibold text-slate-800">{f.name}</p>
                  <span className="rounded-lg bg-indigo-50 px-3 py-1.5 text-xs font-bold text-indigo-700 transition-colors group-hover:bg-indigo-600 group-hover:text-white">
                    Pakai
                  </span>
                </div>
              </a>
            ))}
          </div>
        )}
      </section>

      {/* Features */}
      <section className="mt-14 grid gap-4 sm:grid-cols-3">
        {[
          {
            t: "Tanpa Watermark",
            d: "Hasil unduhan bersih 1080x1080, tidak ada logo menempel.",
            icon: (
              <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            ),
          },
          {
            t: "100% Gratis",
            d: "Semua fitur terbuka. Kode sumber bebas dipakai dan dimodifikasi.",
            icon: (
              <path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            ),
          },
          {
            t: "Privasi Terjaga",
            d: "Semua proses berjalan di browser kamu. Foto tidak diunggah ke server.",
            icon: (
              <path d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            ),
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
          Upload frame campaign-mu, dapatkan link share yang bisa disebar ke
          siapa pun.
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
