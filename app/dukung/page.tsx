export default function DukungPage() {
  return (
    <div className="mx-auto max-w-2xl pt-10">
      <div className="text-center">
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
          Dukung TwibbonKita
        </h1>
        <p className="mx-auto mt-2 max-w-xl text-slate-500">
          TwibbonKita gratis dan open-source selamanya. Kalau aplikasi ini
          membantu campaign-mu, kamu bisa mendukung pengembangan dengan:
        </p>
      </div>

      <div className="card mt-8 divide-y divide-slate-100">
        {[
          {
            t: "Sebarkan ke teman-temanmu",
            d: "Bagikan link TwibbonKita agar makin banyak yang terbantu.",
          },
          {
            t: "Bikin template baru",
            d: "Desain frame baru dan kirim pull request ke GitHub.",
          },
          {
            t: "Laporkan bug & usulkan fitur",
            d: "Buka issue di GitHub agar kami bisa memperbaikinya.",
          },
        ].map((x) => (
          <div key={x.t} className="flex gap-4 p-5">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
              <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </div>
            <div>
              <h2 className="font-bold text-slate-900">{x.t}</h2>
              <p className="mt-0.5 text-sm text-slate-500">{x.d}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 text-center">
        <a
          href="https://github.com/dandienter/twibbonkita"
          target="_blank"
          rel="noreferrer"
          className="btn-primary px-8 py-3.5"
        >
          Kunjungi GitHub
        </a>
        <p className="mt-3 text-xs text-slate-400">
          Tautan donasi resmi akan ditambahkan di sini.
        </p>
      </div>
    </div>
  );
}
