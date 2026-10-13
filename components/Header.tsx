"use client";

import { useEffect, useState } from "react";

interface Me {
  username: string;
  display_name: string;
}

export default function Header() {
  const [user, setUser] = useState<Me | null>(null);
  const [loaded, setLoaded] = useState(false);
  const [menu, setMenu] = useState(false);

  useEffect(() => {
    fetch("/api/auth/me")
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => {
        setUser(d?.user ?? null);
        setLoaded(true);
      })
      .catch(() => setLoaded(true));
  }, []);

  const logout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    setUser(null);
    setMenu(false);
    window.location.href = "/";
  };

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <a href="/" className="flex items-center gap-2">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-600 text-lg font-bold text-white">
            T
          </span>
          <span className="text-lg font-bold tracking-tight text-slate-900">
            Twibbon<span className="text-indigo-600">Kita</span>
          </span>
        </a>
        <nav className="hidden items-center gap-1 text-sm font-medium sm:flex">
          <a href="/" className="btn-ghost">
            Beranda
          </a>
          <a href="/make" className="btn-ghost">
            Buat
          </a>
          <a href="/kontributor" className="btn-ghost">
            Kontributor
          </a>
          <a href="/dukung" className="btn-ghost">
            Dukung
          </a>
        </nav>
        <div className="flex items-center gap-2">
          <a
            href="/make"
            className="btn-ghost sm:hidden"
          >
            Buat
          </a>
          {loaded && (
            user ? (
              <div className="relative">
                <button
                  onClick={() => setMenu((v) => !v)}
                  className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700 shadow-sm hover:bg-slate-50"
                >
                  <span className="flex h-7 w-7 items-center justify-center rounded-full bg-indigo-100 text-xs font-bold text-indigo-700">
                    {user.display_name.charAt(0).toUpperCase()}
                  </span>
                  <span className="hidden max-w-[90px] truncate sm:block">
                    {user.display_name}
                  </span>
                </button>
                {menu && (
                  <div className="absolute right-0 mt-2 w-48 overflow-hidden rounded-xl border border-slate-200 bg-white py-1 shadow-lg">
                    <a
                      href={`/kreator/${user.username}`}
                      className="block px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
                    >
                      Profil Saya
                    </a>
                    <a
                      href="/make"
                      className="block px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
                    >
                      Buat Campaign
                    </a>
                    <button
                      onClick={logout}
                      className="block w-full px-4 py-2.5 text-left text-sm font-medium text-red-600 hover:bg-red-50"
                    >
                      Keluar
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <>
                <a href="/login" className="btn-ghost">
                  Masuk
                </a>
                <a
                  href="/daftar"
                  className="rounded-xl bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-indigo-700"
                >
                  Daftar
                </a>
              </>
            )
          )}
        </div>
      </div>
    </header>
  );
}
