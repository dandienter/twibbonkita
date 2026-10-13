"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import TwibbonCanvas, { EditorState } from "@/components/TwibbonCanvas";
import FrameGallery from "@/components/FrameGallery";
import UploadZone from "@/components/UploadZone";
import { BUILTIN_FRAMES, captionFields, fillCaption, getCampaign } from "@/lib/frames";

const DEFAULT_CAPTION = "Halo! Saya [nama], saya ikut berpartisipasi! #TwibbonKita";

function EditorInner() {
  const params = useSearchParams();
  const [photoUrl, setPhotoUrl] = useState<string | null>(null);
  const [frameUrl, setFrameUrl] = useState<string | null>(BUILTIN_FRAMES[0].src);
  const [customName, setCustomName] = useState("");
  const [editor, setEditor] = useState<EditorState>({ x: 0, y: 0, scale: 1, rotation: 0 });
  const [captionTemplate, setCaptionTemplate] = useState(DEFAULT_CAPTION);
  const [fieldValues, setFieldValues] = useState<Record<string, string>>({});
  const [copied, setCopied] = useState(false);
  const [linkCopied, setLinkCopied] = useState(false);
  const [campaignTitle, setCampaignTitle] = useState("");

  useEffect(() => {
    const frameId = params.get("frame");
    const campaignSlug = params.get("campaign");
    if (campaignSlug) {
      const c = getCampaign(campaignSlug);
      if (c) {
        setFrameUrl(c.frameSrc);
        setCaptionTemplate(c.captionTemplate);
        setCampaignTitle(c.title);
        return;
      }
    }
    if (frameId) {
      const f = BUILTIN_FRAMES.find((x) => x.id === frameId);
      if (f) setFrameUrl(f.src);
    }
  }, [params]);

  const fields = useMemo(() => captionFields(captionTemplate), [captionTemplate]);
  const caption = useMemo(() => fillCaption(captionTemplate, fieldValues), [captionTemplate, fieldValues]);

  const copyCaption = async () => {
    try {
      await navigator.clipboard.writeText(caption);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  };

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setLinkCopied(true);
      setTimeout(() => setLinkCopied(false), 2000);
    } catch {
      setLinkCopied(false);
    }
  };

  const reset = () => setEditor({ x: 0, y: 0, scale: 1, rotation: 0 });

  return (
    <div className="pt-8">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">
            {campaignTitle || "Editor Twibbon"}
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Ikuti 4 langkah mudah di bawah ini.
          </p>
        </div>
        <button onClick={copyLink} className="btn-secondary px-4 py-2.5 text-sm">
          <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M8 12h8m0 0l-3-3m3 3l-3 3M21 12a9 9 0 11-18 0 9 9 0 0118 0z" transform="rotate(45 12 12)" opacity="0" />
            <path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71" />
          </svg>
          {linkCopied ? "Link Tersalin!" : "Salin Link"}
        </button>
      </div>

      {/* Steps progress */}
      <div className="mt-6 grid grid-cols-4 gap-2">
        {["Upload", "Frame", "Atur", "Unduh"].map((s, i) => (
          <div key={s} className="flex items-center gap-2">
            <span
              className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-bold ${
                (i === 0 && photoUrl) || (i === 1 && frameUrl)
                  ? "bg-indigo-600 text-white"
                  : "bg-slate-200 text-slate-500"
              }`}
            >
              {i + 1}
            </span>
            <span className="hidden text-xs font-semibold text-slate-600 sm:block">{s}</span>
          </div>
        ))}
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_380px]">
        <div>
          <TwibbonCanvas photoUrl={photoUrl} frameUrl={frameUrl} state={editor} onChange={setEditor} />
        </div>

        <div className="space-y-5">
          <section className="card p-5">
            <h2 className="flex items-center gap-2 text-base font-bold text-slate-900">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-indigo-100 text-xs font-bold text-indigo-700">1</span>
              Foto Kamu
            </h2>
            <div className="mt-3">
              <UploadZone onPhoto={setPhotoUrl} hasPhoto={!!photoUrl} />
            </div>
          </section>

          <section className="card p-5">
            <h2 className="flex items-center gap-2 text-base font-bold text-slate-900">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-indigo-100 text-xs font-bold text-indigo-700">2</span>
              Pilih Frame {customName && <span className="truncate text-xs font-medium text-slate-400">({customName})</span>}
            </h2>
            <div className="mt-3">
              <FrameGallery
                selected={frameUrl}
                onSelect={(f) => {
                  setFrameUrl(f.src);
                  setCustomName("");
                }}
                onUploadCustom={(url, name) => {
                  setFrameUrl(url);
                  setCustomName(name);
                }}
              />
            </div>
          </section>

          <section className="card bg-indigo-50/60 p-5">
            <div className="flex items-center justify-between">
              <h2 className="flex items-center gap-2 text-base font-bold text-slate-900">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-indigo-600 text-xs font-bold text-white">3</span>
                Atur Foto
              </h2>
              <button onClick={reset} className="btn-ghost text-xs">
                Reset
              </button>
            </div>
            <p className="mt-2 text-xs text-slate-500">
              Tips: seret langsung foto di kanvas untuk menggeser.
            </p>
            <div className="mt-4">
              <div className="flex justify-between">
                <label className="label">Zoom</label>
                <span className="text-xs font-semibold text-indigo-700">{Math.round(editor.scale * 100)}%</span>
              </div>
              <input
                type="range"
                min={0.5}
                max={3}
                step={0.01}
                value={editor.scale}
                onChange={(e) => setEditor({ ...editor, scale: Number(e.target.value) })}
                className="range"
              />
            </div>
            <div className="mt-4">
              <div className="flex justify-between">
                <label className="label">Putar</label>
                <span className="text-xs font-semibold text-indigo-700">{editor.rotation}°</span>
              </div>
              <input
                type="range"
                min={-180}
                max={180}
                step={1}
                value={editor.rotation}
                onChange={(e) => setEditor({ ...editor, rotation: Number(e.target.value) })}
                className="range"
              />
            </div>
            <div className="mt-3 grid grid-cols-2 gap-2">
              <button
                onClick={() => setEditor({ ...editor, rotation: editor.rotation - 90 })}
                className="btn-secondary px-3 py-2 text-xs"
              >
                Putar -90°
              </button>
              <button
                onClick={() => setEditor({ ...editor, rotation: editor.rotation + 90 })}
                className="btn-secondary px-3 py-2 text-xs"
              >
                Putar +90°
              </button>
            </div>
          </section>

          <section className="card p-5">
            <h2 className="flex items-center gap-2 text-base font-bold text-slate-900">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-indigo-100 text-xs font-bold text-indigo-700">4</span>
              Caption
            </h2>
            <div className="mt-3 space-y-3">
              {fields.map((f) => (
                <div key={f}>
                  <label className="label capitalize">{f}</label>
                  <input
                    className="input"
                    value={fieldValues[f] ?? ""}
                    onChange={(e) => setFieldValues({ ...fieldValues, [f]: e.target.value })}
                    placeholder={`Isi ${f}...`}
                  />
                </div>
              ))}
            </div>
            <div className="mt-3 rounded-xl bg-slate-50 p-3 text-sm text-slate-700">
              {caption}
            </div>
            <button onClick={copyCaption} className="btn-secondary mt-3 w-full py-3 text-sm">
              {copied ? "Tersalin!" : "Salin Caption"}
            </button>
          </section>
        </div>
      </div>
    </div>
  );
}

export default function EditorPage() {
  return (
    <Suspense fallback={<p className="pt-8 text-slate-500">Memuat editor...</p>}>
      <EditorInner />
    </Suspense>
  );
}
