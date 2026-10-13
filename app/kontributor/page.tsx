const CONTRIBUTORS = [
  { name: "Dandi", role: "Inisiator & Developer", initials: "D", bg: "bg-indigo-600" },
  { name: "Komunitas", role: "Template & Masukan", initials: "K", bg: "bg-violet-600" },
  { name: "Kamu?", role: "Yuk ikut berkontribusi!", initials: "?", bg: "bg-slate-400" },
];

export default function KontributorPage() {
  return (
    <div className="mx-auto max-w-3xl pt-10">
      <div className="text-center">
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
          Kontributor
        </h1>
        <p className="mx-auto mt-2 max-w-xl text-slate-500">
          TwibbonKita dibangun terbuka. Terima kasih untuk semua yang ikut
          mengembangkan, membuat template, dan menyebarkan.
        </p>
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        {CONTRIBUTORS.map((c) => (
          <div key={c.name} className="card p-6 text-center">
            <div
              className={`mx-auto flex h-14 w-14 items-center justify-center rounded-2xl text-xl font-bold text-white ${c.bg}`}
            >
              {c.initials}
            </div>
            <h2 className="mt-3 text-lg font-bold text-slate-900">{c.name}</h2>
            <p className="text-sm text-slate-500">{c.role}</p>
          </div>
        ))}
      </div>

      <div className="card mt-8 p-6 sm:p-8">
        <h2 className="text-xl font-bold text-slate-900">Mau Ikut Berkontribusi?</h2>
        <p className="mt-2 text-sm text-slate-500">
          Fork repo, tambah template frame baru di{" "}
          <code className="rounded bg-slate-100 px-1.5 py-0.5 text-xs">public/frames/</code>,
          lalu kirim pull request. Semua kontribusi disambut!
        </p>
        <a
          href="https://github.com/dandienter/twibbonkita"
          target="_blank"
          rel="noreferrer"
          className="btn-primary mt-5 px-6 py-3 text-sm"
        >
          Buka GitHub
        </a>
      </div>
    </div>
  );
}
