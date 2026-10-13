"use client";

import { BUILTIN_FRAMES, Frame } from "@/lib/frames";

interface Props {
  selected: string | null;
  onSelect: (f: Frame) => void;
  onUploadCustom: (url: string, name: string) => void;
}

export default function FrameGallery({ selected, onSelect, onUploadCustom }: Props) {
  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    const url = URL.createObjectURL(f);
    onUploadCustom(url, f.name);
    e.target.value = "";
  };

  return (
    <div>
      <div className="grid grid-cols-3 gap-3">
        {BUILTIN_FRAMES.map((f) => (
          <button
            key={f.id}
            onClick={() => onSelect(f)}
            className={`brut-card overflow-hidden p-1 transition-transform ${
              selected === f.src ? "bg-brutyellow" : "bg-white"
            }`}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={f.src} alt={f.name} className="aspect-square w-full bg-[repeating-conic-gradient(#eee_0_25%,#fff_0_50%)] bg-[length:20px_20px] object-contain" />
            <p className="py-1 text-center text-[11px] font-extrabold uppercase">{f.name}</p>
          </button>
        ))}
      </div>
      <label className="brut-btn mt-3 w-full cursor-pointer bg-brutcyan px-4 py-3 text-sm">
        Upload Frame Sendiri (PNG)
        <input type="file" accept="image/png,image/svg+xml" className="hidden" onChange={handleFile} />
      </label>
      <p className="mt-1 text-xs font-semibold text-neutral-500">
        Gunakan PNG transparan 1080x1080 agar hasil maksimal.
      </p>
    </div>
  );
}
