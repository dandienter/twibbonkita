import { BUILTIN_FRAMES } from "@/lib/frames";

export default function Home() {
  return (
    <div className="pt-8">
      <section className="brut-card bg-brutyellow p-6 text-center sm:p-10">
        <h1 className="text-3xl font-black uppercase leading-tight sm:text-5xl">
          Bikin Twibbon
          <br />
          <span className="bg-black px-3 text-brutyellow">Gratis &amp; Gampang</span>
        </h1>
        <p className="mx-auto mt-4 max-w-xl font-semibold">
          Upload foto, pilih frame, atur posisi, unduh PNG. Tanpa watermark, tanpa
          daftar, open-source selamanya.
        </p>
        <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
          <a href="/editor" className="brut-btn bg-brutpink px-8 py-4 text-lg">
            Mulai Bikin
          </a>
          <a href="/make" className="brut-btn bg-white px-8 py-4 text-lg">
            Bikin Campaign
          </a>
        </div>
      </section>

      <section className="mt-10">
        <h2 className="mb-4 text-2xl font-black uppercase">
          <span className="bg-black px-2 text-white">Frame</span> Bawaan
        </h2>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
          {BUILTIN_FRAMES.map((f, i) => {
            const colors = ["bg-brutpink", "bg-brutcyan", "bg-brutlime", "bg-brutyellow", "bg-brutorange", "bg-white"];
            return (
              <a key={f.id} href={`/editor?frame=${f.id}`} className={`brut-card p-3 ${colors[i % colors.length]}`}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={f.src}
                  alt={f.name}
                  className="aspect-square w-full border-3 border-black bg-[repeating-conic-gradient(#eee_0_25%,#fff_0_50%)] bg-[length:20px_20px] object-contain"
                />
                <p className="mt-2 text-center text-sm font-extrabold uppercase">{f.name}</p>
              </a>
            );
          })}
        </div>
      </section>

      <section className="mt-10 grid gap-4 sm:grid-cols-3">
        {[
          { t: "Tanpa Watermark", d: "Hasil unduhan bersih, tidak ada logo menempel.", c: "bg-brutlime" },
          { t: "100% Gratis", d: "Semua fitur terbuka. Kode sumber bebas dipakai.", c: "bg-brutcyan" },
          { t: "Bisa Offline-ish", d: "Semua proses jalan di browser kamu.", c: "bg-brutpink" },
        ].map((x) => (
          <div key={x.t} className={`brut-card p-5 ${x.c}`}>
            <h3 className="text-lg font-black uppercase">{x.t}</h3>
            <p className="mt-1 font-semibold">{x.d}</p>
          </div>
        ))}
      </section>
    </div>
  );
}
