const CONTRIBUTORS = [
  { name: "Dandi", role: "Inisiator & Developer", color: "bg-brutyellow" },
  { name: "Komunitas", role: "Template & Masukan", color: "bg-brutpink" },
  { name: "Kamu?", role: "Yuk ikut berkontribusi!", color: "bg-brutcyan" },
];

export default function KontributorPage() {
  return (
    <div className="pt-8">
      <h1 className="text-3xl font-black uppercase">
        <span className="bg-brutlime px-2">Kontributor</span>
      </h1>
      <p className="mt-2 max-w-xl font-semibold">
        TwibbonKita dibangun terbuka. Terima kasih untuk semua yang ikut
        mengembangkan, membuat template, dan menyebarkan.
      </p>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {CONTRIBUTORS.map((c) => (
          <div key={c.name} className={`brut-card p-6 ${c.color}`}>
            <div className="flex h-14 w-14 items-center justify-center border-3 border-black bg-white text-2xl font-black shadow-brut-sm">
              {c.name.charAt(0)}
            </div>
            <h2 className="mt-3 text-xl font-black">{c.name}</h2>
            <p className="font-semibold">{c.role}</p>
          </div>
        ))}
      </div>

      <div className="brut-card mt-8 bg-white p-6">
        <h2 className="text-xl font-black uppercase">Mau Ikut Berkontribusi?</h2>
        <p className="mt-2 font-semibold">
          Fork repo, tambah template frame baru di <code className="bg-neutral-100 px-1">public/frames/</code>,
          lalu kirim pull request. Semua kontribusi disambut!
        </p>
        <a
          href="https://github.com/dandienter/twibbonkita"
          target="_blank"
          rel="noreferrer"
          className="brut-btn mt-4 bg-black px-6 py-3 text-sm text-white"
        >
          Buka GitHub
        </a>
      </div>
    </div>
  );
}
