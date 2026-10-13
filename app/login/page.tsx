"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

function LoginInner() {
  const router = useRouter();
  const params = useSearchParams();
  const next = params.get("next") || "/";
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setBusy(true);
    try {
      const r = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      const d = await r.json();
      if (!r.ok) {
        setError(d.error || "Gagal masuk.");
        setBusy(false);
        return;
      }
      router.push(next);
      router.refresh();
    } catch {
      setError("Terjadi kesalahan jaringan.");
      setBusy(false);
    }
  };

  return (
    <div className="mx-auto max-w-md pt-14">
      <div className="text-center">
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">
          Masuk
        </h1>
        <p className="mt-2 text-sm text-slate-500">
          Masuk untuk membuat dan membagikan campaign.
        </p>
      </div>
      <form onSubmit={submit} className="card mt-8 p-6 sm:p-8">
        {error && (
          <div className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
            {error}
          </div>
        )}
        <label className="label" htmlFor="username">
          Username
        </label>
        <input
          id="username"
          className="input"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="username"
          autoComplete="username"
        />
        <label className="label mt-5" htmlFor="password">
          Password
        </label>
        <input
          id="password"
          type="password"
          className="input"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="••••••••"
          autoComplete="current-password"
        />
        <button type="submit" disabled={busy} className="btn-primary mt-7 w-full py-3.5">
          {busy ? "Memproses..." : "Masuk"}
        </button>
        <p className="mt-4 text-center text-sm text-slate-500">
          Belum punya akun?{" "}
          <a href={`/daftar?next=${encodeURIComponent(next)}`} className="font-semibold text-indigo-600 hover:underline">
            Daftar di sini
          </a>
        </p>
      </form>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<p className="pt-14 text-center text-slate-500">Memuat...</p>}>
      <LoginInner />
    </Suspense>
  );
}
