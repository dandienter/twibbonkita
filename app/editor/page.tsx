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
        <h1 className="text-2xl font-black uppercase sm:text-3xl">
          <span className="bg-brutcyan px-2">Editor</span>{" "}
          {campaignTitle || "Twibbon"}
        </h1>
        <button onClick={copyLink} className="brut-btn bg-white px-4 py-2 text-sm">
          {linkCopied ? "Link Tersalin!" : "Salin Link"}
        </button>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <div>
          <TwibbonCanvas photoUrl={photoUrl} frameUrl={frameUrl} state={editor} onChange={setEditor} />
        </div>

        <div className="space-y-6">
          <section className="brut-card bg-white p-5">
            <h2 className="mb-3 text-lg font-black uppercase">1. Foto Kamu</h2>
            <UploadZone onPhoto={setPhotoUrl} hasPhoto={!!photoUrl} />
          </section>

          <section className="brut-card bg-white p-5">
            <h2 className="mb-3 text-lg font-black uppercase">
              2. Frame {customName && <span className="text-sm">({customName})</span>}
            </h2>
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
          </section>

          <section className="brut-card bg-brutyellow p-5">
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-lg font-black uppercase">3. Atur Foto</h2>
              <button onClick={reset} className="brut-btn bg-white px-3 py-1 text-xs">
                Reset
              </button>
            </div>
            <p className="mb-4 text-xs font-bold text-neutral-600">
              Tips: seret langsung foto di kanvas untuk menggeser.
            </p>
            <label className="brut-label">Zoom: {Math.round(editor.scale * 100)}%</label>
            <input
              type="range"
              min={0.5}
              max={3}
              step={0.01}
              value={editor.scale}
              onChange={(e) => setEditor({ ...editor, scale: Number(e.target.value) })}
              className="brut-range"
            />
            <label className="brut-label mt-4">Putar: {editor.rotation}°</label>
            <input
              type="range"
              min={-180}
              max={180}
              step={1}
              value={editor.rotation}
              onChange={(e) => setEditor({ ...editor, rotation: Number(e.target.value) })}
              className="brut-range"
            />
            <div className="mt-3 flex gap-2">
              <button
                onClick={() => setEditor({ ...editor, rotation: editor.rotation - 90 })}
                className="brut-btn flex-1 bg-white px-3 py-2 text-xs"
              >
                Putar -90°
              </button>
              <button
                onClick={() => setEditor({ ...editor, rotation: editor.rotation + 90 })}
                className="brut-btn flex-1 bg-white px-3 py-2 text-xs"
              >
                Putar +90°
              </button>
            </div>
          </section>

          <section className="brut-card bg-white p-5">
            <h2 className="mb-3 text-lg font-black uppercase">4. Caption</h2>
            <div className="space-y-2">
              {fields.map((f) => (
                <div key={f}>
                  <label className="brut-label">{f}</label>
                  <input
                    className="brut-input"
                    value={fieldValues[f] ?? ""}
                    onChange={(e) => setFieldValues({ ...fieldValues, [f]: e.target.value })}
                    placeholder={`Isi ${f}...`}
                  />
                </div>
              ))}
            </div>
            <div className="mt-3 border-3 border-black bg-neutral-50 p-3 text-sm font-semibold">
              {caption}
            </div>
            <button onClick={copyCaption} className="brut-btn mt-3 w-full bg-brutpink px-4 py-3 text-sm">
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
    <Suspense fallback={<p className="pt-8 font-bold">Memuat editor...</p>}>
      <EditorInner />
    </Suspense>
  );
}
