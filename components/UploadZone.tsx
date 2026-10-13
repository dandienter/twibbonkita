"use client";

import { useRef, useState } from "react";

interface Props {
  onPhoto: (url: string) => void;
  hasPhoto: boolean;
}

export default function UploadZone({ onPhoto, hasPhoto }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [drag, setDrag] = useState(false);

  const handleFile = (f: File | undefined) => {
    if (!f || !f.type.startsWith("image/")) return;
    const url = URL.createObjectURL(f);
    onPhoto(url);
  };

  return (
    <div
      onClick={() => inputRef.current?.click()}
      onDragOver={(e) => {
        e.preventDefault();
        setDrag(true);
      }}
      onDragLeave={() => setDrag(false)}
      onDrop={(e) => {
        e.preventDefault();
        setDrag(false);
        handleFile(e.dataTransfer.files?.[0]);
      }}
      className={`brut-card cursor-pointer p-8 text-center transition-colors ${
        drag ? "bg-brutyellow" : hasPhoto ? "bg-brutlime" : "bg-white"
      }`}
    >
      <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center border-3 border-black bg-brutpink shadow-brut-sm">
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#000" strokeWidth="2.5">
          <path d="M12 16V4m0 0l-4 4m4-4l4 4" />
          <path d="M4 16v3a1 1 0 001 1h14a1 1 0 001-1v-3" />
        </svg>
      </div>
      <p className="font-extrabold uppercase">
        {hasPhoto ? "Ganti Foto" : "Upload Foto"}
      </p>
      <p className="mt-1 text-sm font-semibold text-neutral-500">
        Klik atau seret foto ke sini (JPG/PNG/WebP)
      </p>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          handleFile(e.target.files?.[0]);
          e.target.value = "";
        }}
      />
    </div>
  );
}
