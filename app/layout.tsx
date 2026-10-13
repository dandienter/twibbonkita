import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "TwibbonKita - Generator Twibbon Gratis Tanpa Watermark",
  description:
    "TwibbonKita adalah aplikasi open-source untuk membuat twibbon: upload foto, pilih frame, atur posisi, unduh PNG tanpa watermark. Gratis selamanya.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id">
      <body className="min-h-screen">
        <header className="border-b-[3px] border-black bg-brutyellow">
          <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
            <a href="/" className="text-xl font-black uppercase tracking-tight">
              Twibbon<span className="bg-black px-2 py-0.5 text-brutyellow">Kita</span>
            </a>
            <nav className="flex items-center gap-2 text-xs font-extrabold uppercase sm:gap-3 sm:text-sm">
              <a href="/make" className="border-3 border-black bg-white px-2 py-1 shadow-brut-sm sm:px-3">
                Buat
              </a>
              <a href="/kontributor" className="border-3 border-black bg-white px-2 py-1 shadow-brut-sm sm:px-3">
                Kontributor
              </a>
              <a href="/dukung" className="border-3 border-black bg-brutpink px-2 py-1 shadow-brut-sm sm:px-3">
                Dukung
              </a>
            </nav>
          </div>
        </header>
        <main className="mx-auto max-w-5xl px-4 pb-16">{children}</main>
        <footer className="border-t-[3px] border-black bg-black py-6 text-white">
          <div className="mx-auto flex max-w-5xl flex-col items-center gap-2 px-4 text-center">
            <p className="font-extrabold uppercase">TwibbonKita</p>
            <p className="text-sm text-neutral-300">
              Open-source, gratis, tanpa watermark. Dibuat dengan bangga di Indonesia.
            </p>
            <div className="mt-1 flex gap-3 text-sm font-bold">
              <a href="/kontributor" className="underline">Kontributor</a>
              <a href="/dukung" className="underline">Dukung Kami</a>
              <a
                href="https://github.com/dandienter/twibbonkita"
                target="_blank"
                rel="noreferrer"
                className="underline"
              >
                GitHub
              </a>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
