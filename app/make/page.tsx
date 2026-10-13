"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const MAX_FILE = 6 * 1024 * 1024;

export default function MakePage() {
  const router = useRouter();
  const [checking, setChecking] = useState(true);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [caption, setCaption] = useState(
    "Halo! Saya [nama] dari [asal], saya mendukung [acara]!"
  );
  const [frameData, setFrameData] = useState<string | null>(null);
  const [frameName, setFrameName] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    fetch("/api/auth/me").then((r) => {
      if (!r.ok) router.replace("/login?next=/make");
      else setChecking(false);
    });
  }, [router]);

  const readFile = (f: File) => {
    setError("");
    if (!f.type.startsWith("image/")) {
      setError("File harus berupa gambar (PNG transparan disarankan).");
      return;
    }
    if (f.size > MAX_FILE) {
      setError("Ukuran frame maksimal 6MB.");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      setFrameData(String(reader.result));
      setFrameName(f.name);
    };
    reader.readAsDataURL(f);
  };

  const handleFrame = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) readFile(f);
    e.target.value = "";
  };

  const submit = async () => {
    setError("");
    if (!title.trim()) return setError("Judul campaign wajib diisi.");
    if (!frameData) return setError("Upload frame (PNG transparan) dulu.");
    setBusy(true);
    try {
      const r = await fetch("/api/campaigns", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: title.trim(),
          description: description.trim(),
          frame_data: frameData,
          caption_template: caption,
        }),
      });
      const d = await r.json();
      if (!r.ok) {
        setError(d.error || "Gagal membuat campaign.");
        setBusy(false);
        return;
      }
      router.push(`/c/${d.slug}`);
    } catch {
      setError("Terjadi kesalahan jaringan.");
      setBusy(false);
    }
  };

  if (checking) {
    return <p className="pt-14 text-center text-slate-500">Memeriksa sesi...</p>;
  }

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
          maxLength={80}
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
          maxLength={500}
        />

        <label className="label mt-5">Frame (PNG transparan) *</label>
        <label
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => {
            e.preventDefault();
            const f = e.dataTransfer.files?.[0];
            if (f) readFile(f);
          }}
          className="flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-slate-300 bg-slate-50 px-4 py-8 text-center transition-colors hover:border-indigo-400 hover:bg-indigo-50/50"
        >
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
            {frameName || "Klik atau seret file frame ke sini"}
          </span>
          <span className="mt-1 text-xs text-slate-400">
            PNG transparan 1080x1080 disarankan, maks 6MB
          </span>
          <input
            type="file"
            accept="image/png,image/svg+xml"
            className="hidden"
            onChange={handleFrame}
          />
        </label>
        {frameData && (
          <div className="checker mt-3 overflow-hidden rounded-xl border border-slate-200">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={frameData}
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
          maxLength={1000}
        />
        <p className="mt-1.5 text-xs text-slate-400">
          Teks dalam [kurung] jadi kolom isian otomatis, contoh: [nama], [asal],
          [acara].
        </p>

        <button
          onClick={submit}
          disabled={busy}
          className="btn-primary mt-7 w-full py-4 text-base"
        >
          {busy ? "Menyimpan..." : "Buat & Dapatkan Link"}
        </button>
      </div>
    </div>
  );
}
