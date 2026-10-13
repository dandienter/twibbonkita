"use client";

import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import TwibbonCanvas, { EditorState, TwibbonCanvasHandle } from "@/components/TwibbonCanvas";
import FrameGallery from "@/components/FrameGallery";
import UploadZone from "@/components/UploadZone";
import { BUILTIN_FRAMES, captionFields, fillCaption } from "@/lib/frames";

const DEFAULT_CAPTION = "Halo! Saya [nama], saya ikut berpartisipasi! #TwibbonKita";
const STEPS = ["Upload", "Frame", "Atur", "Unduh"];

function EditorInner() {
  const params = useSearchParams();
  const canvasRef = useRef<TwibbonCanvasHandle>(null);

  const [step, setStep] = useState(1);
  const [maxStep, setMaxStep] = useState(1);
  const [photoUrl, setPhotoUrl] = useState<string | null>(null);
  const [frameUrl, setFrameUrl] = useState<string | null>(BUILTIN_FRAMES[0].src);
  const [customName, setCustomName] = useState("");
  const [editor, setEditor] = useState<EditorState>({ x: 0, y: 0, scale: 1, rotation: 0 });
  const [captionTemplate, setCaptionTemplate] = useState(DEFAULT_CAPTION);
  const [fieldValues, setFieldValues] = useState<Record<string, string>>({});
  const [copied, setCopied] = useState(false);
  const [campaignTitle, setCampaignTitle] = useState("");
  const [campaignSlug, setCampaignSlug] = useState<string | null>(null);

  useEffect(() => {
    const frameId = params.get("frame");
    const cSlug = params.get("campaign");
    if (cSlug) {
      setCampaignSlug(cSlug);
      fetch(`/api/campaigns/${encodeURIComponent(cSlug)}`)
        .then((r) => (r.ok ? r.json() : null))
        .then((d) => {
          if (d?.campaign) {
            setFrameUrl(d.campaign.frame_data);
            setCaptionTemplate(d.campaign.caption_template || DEFAULT_CAPTION);
            setCampaignTitle(d.campaign.title);
          }
        })
        .catch(() => {});
      return;
    }
    if (frameId) {
      const f = BUILTIN_FRAMES.find((x) => x.id === frameId);
      if (f) setFrameUrl(f.src);
    }
  }, [params]);

  const go = (n: number) => {
    const clamped = Math.min(4, Math.max(1, n));
    if (clamped > maxStep) return; // tidak boleh lompat ke depan
    setStep(clamped);
  };

  const next = () => {
    const n = Math.min(4, step + 1);
    setStep(n);
    setMaxStep((m) => Math.max(m, n));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const back = () => {
    setStep((s) => Math.max(1, s - 1));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const fields = useMemo(() => captionFields(captionTemplate), [captionTemplate]);
  const caption = useMemo(
    () => fillCaption(captionTemplate, fieldValues),
    [captionTemplate, fieldValues]
  );

  const copyCaption = async () => {
    try {
      await navigator.clipboard.writeText(caption);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  };

  const reset = () => setEditor({ x: 0, y: 0, scale: 1, rotation: 0 });

  return (
    <div className="mx-auto max-w-4xl pt-8">
      <div className="text-center">
        <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">
          {campaignTitle || "Editor Twibbon"}
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          Ikuti 4 langkah mudah di bawah ini.
        </p>
      </div>

      {/* Step indicator */}
      <div className="mx-auto mt-6 grid max-w-2xl grid-cols-4 gap-1">
        {STEPS.map((s, i) => {
          const n = i + 1;
          const active = n === step;
          const reached = n <= maxStep;
          const done = n < step;
          return (
            <button
              key={s}
              onClick={() => go(n)}
              disabled={!reached}
              className={`flex flex-col items-center gap-1.5 rounded-xl p-2 transition-colors ${
                reached ? "cursor-pointer" : "cursor-not-allowed"
              }`}
            >
              <span
                className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold transition-colors ${
                  active
                    ? "bg-indigo-600 text-white"
                    : done
                      ? "bg-indigo-100 text-indigo-700"
                      : "bg-slate-200 text-slate-500"
                }`}
              >
                {done ? "✓" : n}
              </span>
              <span
                className={`text-xs font-semibold ${
                  active ? "text-indigo-700" : "text-slate-500"
                }`}
              >
                {s}
              </span>
            </button>
          );
        })}
      </div>

      <div className="card mx-auto mt-6 max-w-2xl p-6 sm:p-8">
        {/* TAHAP 1: Upload */}
        {step === 1 && (
          <div>
            <h2 className="section-title">Upload Foto</h2>
            <p className="mt-1 text-sm text-slate-500">
              Pilih foto terbaikmu untuk dipasang twibbon.
            </p>
            <div className="mt-5">
              <UploadZone onPhoto={setPhotoUrl} hasPhoto={!!photoUrl} />
            </div>
            <button
              onClick={next}
              disabled={!photoUrl}
              className="btn-primary mt-6 w-full py-3.5"
            >
              Lanjut Pilih Frame
            </button>
          </div>
        )}

        {/* TAHAP 2: Frame */}
        {step === 2 && (
          <div>
            <h2 className="section-title">Pilih Frame</h2>
            <p className="mt-1 text-sm text-slate-500">
              {campaignSlug
                ? "Frame campaign sudah terpilih. Kamu bisa menggantinya bila mau."
                : "Pilih frame favoritmu atau upload frame sendiri."}
              {customName && <span className="font-medium"> ({customName})</span>}
            </p>
            <div className="mt-5">
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
            <div className="mt-6 grid grid-cols-2 gap-3">
              <button onClick={back} className="btn-secondary py-3.5">
                Kembali
              </button>
              <button onClick={next} className="btn-primary py-3.5">
                Lanjut Atur Foto
              </button>
            </div>
          </div>
        )}

        {/* TAHAP 3: Atur */}
        {step === 3 && (
          <div>
            <h2 className="section-title">Atur Foto</h2>
            <p className="mt-1 text-sm text-slate-500">
              Seret foto di kanvas untuk menggeser. Gunakan slider di bawah untuk
              zoom dan putar.
            </p>
            <div className="mt-5">
              <TwibbonCanvas
                photoUrl={photoUrl}
                frameUrl={frameUrl}
                state={editor}
                onChange={setEditor}
                showDownload={false}
              />
            </div>
            <div className="mt-5 flex items-center justify-between">
              <div className="flex justify-between">
                <label className="label">Zoom</label>
              </div>
              <span className="text-xs font-semibold text-indigo-700">
                {Math.round(editor.scale * 100)}%
              </span>
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
            <div className="mt-4 flex items-center justify-between">
              <label className="label">Putar</label>
              <span className="text-xs font-semibold text-indigo-700">
                {editor.rotation}°
              </span>
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
            <div className="mt-3 grid grid-cols-3 gap-2">
              <button
                onClick={() => setEditor({ ...editor, rotation: editor.rotation - 90 })}
                className="btn-secondary px-3 py-2.5 text-xs"
              >
                -90°
              </button>
              <button
                onClick={() => setEditor({ ...editor, rotation: editor.rotation + 90 })}
                className="btn-secondary px-3 py-2.5 text-xs"
              >
                +90°
              </button>
              <button onClick={reset} className="btn-secondary px-3 py-2.5 text-xs">
                Reset
              </button>
            </div>
            <div className="mt-6 grid grid-cols-2 gap-3">
              <button onClick={back} className="btn-secondary py-3.5">
                Kembali
              </button>
              <button onClick={next} className="btn-primary py-3.5">
                Lanjut Unduh
              </button>
            </div>
          </div>
        )}

        {/* TAHAP 4: Unduh */}
        {step === 4 && (
          <div>
            <h2 className="section-title">Unduh Hasil</h2>
            <p className="mt-1 text-sm text-slate-500">
              Pratinjau final twibbon-mu. Unduh lalu bagikan ke media sosial.
            </p>
            <div className="mt-5">
              <TwibbonCanvas
                ref={canvasRef}
                photoUrl={photoUrl}
                frameUrl={frameUrl}
                state={editor}
                onChange={setEditor}
                interactive={false}
                showDownload={false}
              />
            </div>

            <h3 className="mt-6 text-base font-bold text-slate-900">Caption</h3>
            <div className="mt-3 space-y-3">
              {fields.map((f) => (
                <div key={f}>
                  <label className="label capitalize">{f}</label>
                  <input
                    className="input"
                    value={fieldValues[f] ?? ""}
                    onChange={(e) =>
                      setFieldValues({ ...fieldValues, [f]: e.target.value })
                    }
                    placeholder={`Isi ${f}...`}
                  />
                </div>
              ))}
            </div>
            <div className="mt-3 rounded-xl bg-slate-50 p-3 text-sm text-slate-700">
              {caption}
            </div>
            <button onClick={copyCaption} className="btn-secondary mt-3 w-full py-3 text-sm">
              {copied ? "Caption Tersalin!" : "Salin Caption"}
            </button>

            <button
              onClick={() => canvasRef.current?.download()}
              className="btn-primary mt-4 w-full py-4 text-base"
            >
              <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M12 16V4m0 0l-4 4m4-4l4 4" />
                <path d="M4 16v3a1 1 0 001 1h14a1 1 0 001-1v-3" />
              </svg>
              Unduh PNG
            </button>
            <p className="mt-2 text-center text-xs text-slate-400">
              Resolusi 1080x1080. Tanpa watermark. Gratis selamanya.
            </p>

            <div className="mt-6 grid grid-cols-2 gap-3">
              <button onClick={back} className="btn-secondary py-3.5">
                Kembali Atur
              </button>
              <a href="/editor" className="btn-ghost py-3.5 text-center font-semibold">
                Buat Lagi
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function EditorPage() {
  return (
    <Suspense fallback={<p className="pt-8 text-center text-slate-500">Memuat editor...</p>}>
      <EditorInner />
    </Suspense>
  );
}
