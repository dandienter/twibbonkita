import type { Metadata } from "next";
import Header from "@/components/Header";
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
        <Header />
        <main className="mx-auto max-w-6xl px-4 pb-20">{children}</main>
        <footer className="border-t border-slate-200 bg-white">
          <div className="mx-auto flex max-w-6xl flex-col items-center gap-3 px-4 py-8 text-center">
            <p className="text-lg font-bold tracking-tight text-slate-900">
              Twibbon<span className="text-indigo-600">Kita</span>
            </p>
            <p className="max-w-md text-sm text-slate-500">
              Open-source, gratis, tanpa watermark. Dibuat dengan bangga di
              Indonesia.
            </p>
            <div className="flex gap-5 text-sm font-medium text-slate-600">
              <a href="/kontributor" className="hover:text-indigo-600">
                Kontributor
              </a>
              <a href="/dukung" className="hover:text-indigo-600">
                Dukung Kami
              </a>
              <a
                href="https://github.com/dandienter/twibbonkita"
                target="_blank"
                rel="noreferrer"
                className="hover:text-indigo-600"
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
