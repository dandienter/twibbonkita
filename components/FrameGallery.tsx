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
      <div className="grid grid-cols-3 gap-2.5">
        {BUILTIN_FRAMES.map((f) => (
          <button
            key={f.id}
            onClick={() => onSelect(f)}
            className={`overflow-hidden rounded-xl border-2 bg-white transition-all ${
              selected === f.src
                ? "border-indigo-600 ring-2 ring-indigo-100"
                : "border-slate-200 hover:border-indigo-300"
            }`}
          >
            <div className="checker aspect-square w-full">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={f.src} alt={f.name} className="h-full w-full object-contain p-1.5" />
            </div>
            <p className="truncate px-1 py-1.5 text-center text-[11px] font-medium text-slate-600">
              {f.name}
            </p>
          </button>
        ))}
      </div>
      <label className="mt-3 flex cursor-pointer items-center justify-center gap-2 rounded-xl border-2 border-dashed border-slate-300 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-600 transition-colors hover:border-indigo-400 hover:bg-indigo-50/50 hover:text-indigo-700">
        <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
          <path d="M12 5v14m0-14l-4 4m4-4l4 4" opacity="0" />
          <path d="M12 16V8m0 0l-3 3m3-3l3 3M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2" />
        </svg>
        Upload Frame Sendiri
        <input type="file" accept="image/png,image/svg+xml" className="hidden" onChange={handleFile} />
      </label>
      <p className="mt-1.5 text-xs text-slate-400">
        Gunakan PNG transparan 1080x1080 agar hasil maksimal.
      </p>
    </div>
  );
}
