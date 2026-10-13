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
    <div className="pt-8">
      <h1 className="text-3xl font-black uppercase">
        <span className="bg-brutpink px-2">Bikin</span> Campaign
      </h1>
      <p className="mt-2 font-semibold">
        Upload frame campaign-mu, dapatkan link share yang bisa disebar.
      </p>

      <div className="brut-card mt-6 bg-white p-5 sm:p-6">
        {error && (
          <div className="mb-4 border-3 border-black bg-red-200 px-4 py-2 font-bold">{error}</div>
        )}
        <label className="brut-label">Judul Campaign *</label>
        <input
          className="brut-input"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Contoh: Semarak HUT RI ke-81"
        />

        <label className="brut-label mt-4">Deskripsi</label>
        <textarea
          className="brut-input min-h-[90px]"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Ceritakan tentang campaign ini..."
        />

        <label className="brut-label mt-4">Frame (PNG transparan) *</label>
        <label className="brut-btn w-full cursor-pointer bg-brutcyan px-4 py-3 text-sm">
          {frameName || "Pilih File Frame"}
          <input type="file" accept="image/png,image/svg+xml" className="hidden" onChange={handleFrame} />
        </label>
        {frameUrl && (
          <div className="mt-3 border-3 border-black p-2">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={frameUrl}
              alt="preview frame"
              className="mx-auto h-40 bg-[repeating-conic-gradient(#eee_0_25%,#fff_0_50%)] bg-[length:20px_20px] object-contain"
            />
          </div>
        )}

        <label className="brut-label mt-4">Template Caption</label>
        <textarea
          className="brut-input min-h-[90px]"
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
        />
        <p className="mt-1 text-xs font-semibold text-neutral-500">
          Teks dalam [kurung] jadi kolom isian otomatis, contoh: [nama], [asal], [acara].
        </p>

        <button onClick={submit} className="brut-btn mt-6 w-full bg-brutlime px-6 py-4 text-lg">
          Buat &amp; Dapatkan Link
        </button>
      </div>
    </div>
  );
}
