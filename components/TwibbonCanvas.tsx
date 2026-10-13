"use client";

import { useCallback, useEffect, useRef, useState } from "react";

export interface EditorState {
  x: number;
  y: number;
  scale: number;
  rotation: number;
}

interface Props {
  photoUrl: string | null;
  frameUrl: string | null;
  state: EditorState;
  onChange: (s: EditorState) => void;
}

const SIZE = 1080;

export default function TwibbonCanvas({ photoUrl, frameUrl, state, onChange }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);
  const photoRef = useRef<HTMLImageElement | null>(null);
  const frameRef = useRef<HTMLImageElement | null>(null);
  const [photoLoaded, setPhotoLoaded] = useState(false);
  const [frameLoaded, setFrameLoaded] = useState(false);
  const dragRef = useRef<{ sx: number; sy: number; ox: number; oy: number } | null>(null);
  const pinchRef = useRef<{ d: number; scale: number } | null>(null);

  useEffect(() => {
    setPhotoLoaded(false);
    photoRef.current = null;
    if (!photoUrl) return;
    const img = new Image();
    img.onload = () => {
      photoRef.current = img;
      setPhotoLoaded(true);
    };
    img.src = photoUrl;
  }, [photoUrl]);

  useEffect(() => {
    setFrameLoaded(false);
    frameRef.current = null;
    if (!frameUrl) return;
    const img = new Image();
    img.onload = () => {
      frameRef.current = img;
      setFrameLoaded(true);
    };
    img.src = frameUrl;
  }, [frameUrl]);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.clearRect(0, 0, SIZE, SIZE);
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, SIZE, SIZE);

    const photo = photoRef.current;
    if (photo && photoLoaded) {
      ctx.save();
      ctx.translate(SIZE / 2 + state.x, SIZE / 2 + state.y);
      ctx.rotate((state.rotation * Math.PI) / 180);
      const base = Math.max(SIZE / photo.width, SIZE / photo.height);
      const s = base * state.scale;
      ctx.drawImage(photo, (-photo.width * s) / 2, (-photo.height * s) / 2, photo.width * s, photo.height * s);
      ctx.restore();
    }

    const frame = frameRef.current;
    if (frame && frameLoaded) {
      ctx.drawImage(frame, 0, 0, SIZE, SIZE);
    }
  }, [photoLoaded, frameLoaded, state]);

  useEffect(() => {
    draw();
  }, [draw]);

  const toCanvasDelta = (clientX: number, clientY: number, startX: number, startY: number) => {
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return { dx: 0, dy: 0 };
    const k = SIZE / rect.width;
    return { dx: (clientX - startX) * k, dy: (clientY - startY) * k };
  };

  const onPointerDown = (e: React.PointerEvent) => {
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
    dragRef.current = { sx: e.clientX, sy: e.clientY, ox: state.x, oy: state.y };
  };
  const onPointerMove = (e: React.PointerEvent) => {
    if (!dragRef.current) return;
    const { dx, dy } = toCanvasDelta(e.clientX, e.clientY, dragRef.current.sx, dragRef.current.sy);
    onChange({ ...state, x: dragRef.current.ox + dx, y: dragRef.current.oy + dy });
  };
  const onPointerUp = () => {
    dragRef.current = null;
  };

  const onTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 2) {
      const [a, b] = [e.touches[0], e.touches[1]];
      const d = Math.hypot(a.clientX - b.clientX, a.clientY - b.clientY);
      pinchRef.current = { d, scale: state.scale };
    }
  };
  const onTouchMove = (e: React.TouchEvent) => {
    if (e.touches.length === 2 && pinchRef.current) {
      const [a, b] = [e.touches[0], e.touches[1]];
      const d = Math.hypot(a.clientX - b.clientX, a.clientY - b.clientY);
      const ns = Math.min(3, Math.max(0.5, (pinchRef.current.scale * d) / pinchRef.current.d));
      onChange({ ...state, scale: ns });
    }
  };
  const onTouchEnd = () => {
    pinchRef.current = null;
  };

  const download = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const a = document.createElement("a");
    a.download = `twibbonkita-${Date.now()}.png`;
    a.href = canvas.toDataURL("image/png");
    a.click();
  };

  return (
    <div>
      <div className="card overflow-hidden p-2 shadow-soft">
        <canvas
          ref={canvasRef}
          width={SIZE}
          height={SIZE}
          className="h-auto w-full cursor-grab touch-none select-none rounded-xl active:cursor-grabbing"
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerCancel={onPointerUp}
          onTouchStart={onTouchStart}
          onTouchMove={onTouchMove}
          onTouchEnd={onTouchEnd}
        />
      </div>
      {!photoUrl && (
        <p className="mt-3 text-center text-sm text-slate-400">
          Upload foto dulu untuk mulai mengedit.
        </p>
      )}
      <button onClick={download} disabled={!photoUrl} className="btn-primary mt-4 w-full py-4 text-base">
        <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
          <path d="M12 16V4m0 0l-4 4m4-4l4 4" />
          <path d="M4 16v3a1 1 0 001 1h14a1 1 0 001-1v-3" />
        </svg>
        Unduh PNG
      </button>
      <p className="mt-2 text-center text-xs text-slate-400">
        Resolusi 1080x1080. Tanpa watermark. Gratis selamanya.
      </p>
    </div>
  );
}
