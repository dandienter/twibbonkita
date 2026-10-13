"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { saveCampaign, slugify } from "@/lib/frames";

export default function MakePage() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [caption, setCaption] = useState(
    "Halo! Saya [nama] dari [asal], saya mendukung [acara]!"
  );
  const [frameUrl, setFrameUrl] = useState<string | null>(null);
  const [frameName, setFrameName] = useState("");
  const [error, setError] = useState("");

  const handleFrame = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    setFrameUrl(URL.createObjectURL(f));
    setFrameName(f.name);
  };

  const submit = () => {
    if (!title.trim()) return setError("Judul campaign wajib diisi.");
    if (!frameUrl) return setError("Upload frame (PNG transparan) dulu.");
    const slug = slugify(title) + "-" + Date.now().toString(36);
    saveCampaign({
      slug,
      title: title.trim(),
      description: description.trim(),
      frameSrc: frameUrl,
      captionTemplate: caption,
      createdAt: new Date().toISOString(),
    });
    router.push(`/editor?campaign=${slug}`);
  };

  return (
    <div className="mx-auto max-w-2xl pt-10">
      <div className="text-center">
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
          Bikin Campaign
        </h1>
        <p className="mt-2 text-slate-500">
          Upload frame campaign-mu, dapatkan link share yang bisa disebar.
        </p>
      </div>

      <div className="card mt-8 p-6 sm:p-8">
        {error && (
          <div className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
            {error}
          </div>
        )}

        <label className="label" htmlFor="title">
          Judul Campaign *
        </label>
        <input
          id="title"
          className="input"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Contoh: Semarak HUT RI ke-81"
        />

        <label className="label mt-5" htmlFor="desc">
          Deskripsi
        </label>
        <textarea
          id="desc"
          className="input min-h-[90px] resize-y"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Ceritakan tentang campaign ini..."
        />

        <label className="label mt-5">Frame (PNG transparan) *</label>
        <label className="flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-slate-300 bg-slate-50 px-4 py-8 text-center transition-colors hover:border-indigo-400 hover:bg-indigo-50/50">
          <svg
            className="h-8 w-8 text-slate-400"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <span className="mt-2 text-sm font-semibold text-slate-700">
            {frameName || "Klik untuk pilih file frame"}
          </span>
          <span className="mt-1 text-xs text-slate-400">
            PNG transparan 1080x1080 disarankan
          </span>
          <input
            type="file"
            accept="image/png,image/svg+xml"
            className="hidden"
            onChange={handleFrame}
          />
        </label>
        {frameUrl && (
          <div className="checker mt-3 overflow-hidden rounded-xl border border-slate-200">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={frameUrl}
              alt="preview frame"
              className="mx-auto h-44 object-contain"
            />
          </div>
        )}

        <label className="label mt-5" htmlFor="caption">
          Template Caption
        </label>
        <textarea
          id="caption"
          className="input min-h-[90px] resize-y"
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
        />
        <p className="mt-1.5 text-xs text-slate-400">
          Teks dalam [kurung] jadi kolom isian otomatis, contoh: [nama], [asal],
          [acara].
        </p>

        <button onClick={submit} className="btn-primary mt-7 w-full py-4 text-base">
          Buat &amp; Dapatkan Link
        </button>
      </div>
    </div>
  );
}
