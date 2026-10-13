export default function DukungPage() {
  return (
    <div className="pt-8">
      <h1 className="text-3xl font-black uppercase">
        <span className="bg-brutpink px-2">Dukung</span> TwibbonKita
      </h1>
      <div className="brut-card mt-6 bg-white p-6">
        <p className="font-semibold">
          TwibbonKita gratis dan open-source selamanya. Kalau aplikasi ini
          membantu campaign-mu, kamu bisa mendukung pengembangan dengan:
        </p>
        <ul className="mt-4 space-y-2 font-semibold">
          <li className="border-3 border-black bg-brutyellow p-3 shadow-brut-sm">
            Sebarkan TwibbonKita ke teman-temanmu
          </li>
          <li className="border-3 border-black bg-brutcyan p-3 shadow-brut-sm">
            Bikin template frame baru dan kirim pull request
          </li>
          <li className="border-3 border-black bg-brutlime p-3 shadow-brut-sm">
            Laporkan bug atau usulkan fitur di GitHub Issues
          </li>
        </ul>
        <a
          href="https://github.com/dandienter/twibbonkita"
          target="_blank"
          rel="noreferrer"
          className="brut-btn mt-6 bg-brutpink px-8 py-4"
        >
          Kunjungi GitHub
        </a>
        <p className="mt-3 text-xs font-semibold text-neutral-500">
          Tautan donasi resmi akan ditambahkan di sini.
        </p>
      </div>
    </div>
  );
}
