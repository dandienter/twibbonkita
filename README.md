# TwibbonKita

Generator twibbon **open-source**, **gratis**, **tanpa watermark**. Seperti Twibbonize, tapi bebas dipakai dan dikembangkan siapa saja.

![License](https://img.shields.io/badge/license-MIT-green) ![Next.js](https://img.shields.io/badge/Next.js-14-black) ![PRs](https://img.shields.io/badge/PRs-welcome-pink)

## Fitur

- **Upload foto** - klik atau drag & drop (JPG/PNG/WebP)
- **6 frame bawaan** - badge, kotak, gradasi, pita, minimalis, meriah (SVG, bisa ditambah)
- **Upload frame sendiri** - PNG/SVG transparan 1080x1080
- **Editor kanvas** - seret foto (mouse + sentuh), zoom 50-300% (slider + pinch), putar, reset
- **Unduh PNG** - resolusi penuh 1080x1080, **tanpa watermark**
- **Bikin campaign** - buat halaman campaign dengan link share (`/editor?campaign=...`), tersimpan di browser
- **Caption generator** - template dengan placeholder `[nama]`, `[asal]`, dll + tombol salin
- **Halaman kontributor & dukung**
- **Neobrutalism UI** - mobile-first, responsif

## Cara Menjalankan

```bash
# clone
git clone https://github.com/dandienter/twibbonkita.git
cd twibbonkita

# install
npm install

# jalanin dev
npm run dev
```

Buka http://localhost:3000

## Cara Pakai

### Bikin twibbon cepat
1. Buka halaman utama, klik **Mulai Bikin**
2. Upload foto kamu
3. Pilih frame dari galeri (atau upload sendiri)
4. Seret/zoom/putar foto sampai pas
5. Klik **Unduh PNG**

### Bikin campaign + share link
1. Klik **Bikin Campaign** (atau buka `/make`)
2. Isi judul, deskripsi, upload frame PNG transparan
3. Isi template caption, contoh: `Saya [nama] dari [kota] mendukung [acara]!`
4. Klik **Buat & Dapatkan Link**
5. Bagikan link `/editor?campaign=...` ke peserta

### Tambah frame bawaan
1. Taruh file SVG/PNG di `public/frames/`
2. Daftarkan di `lib/frames.ts` -> `BUILTIN_FRAMES`
3. Kirim pull request!

## Struktur Project

```
twibbonkita/
├── app/
│   ├── page.tsx            # homepage
│   ├── make/page.tsx       # form bikin campaign
│   ├── editor/page.tsx     # editor kanvas utama
│   ├── kontributor/page.tsx
│   ├── dukung/page.tsx
│   ├── layout.tsx
│   └── globals.css         # style neobrutalism
├── components/
│   ├── TwibbonCanvas.tsx   # kanvas + drag/zoom/rotate/download
│   ├── FrameGallery.tsx    # galeri frame
│   └── UploadZone.tsx      # drag & drop foto
├── lib/
│   └── frames.ts           # daftar frame + campaign (localStorage)
├── public/frames/          # 6 frame SVG bawaan
├── README.md
└── LICENSE (MIT)
```

## Teknologi

- Next.js 14 (App Router) + TypeScript
- Tailwind CSS (custom neobrutalism theme)
- HTML5 Canvas (compositing, tanpa library tambahan)
- localStorage untuk campaign (tanpa backend)

## Kontribusi

Sangat disambut! Cara ikut:

1. Fork repo ini
2. Buat branch: `git checkout -b fitur-baru`
3. Commit: `git commit -m "Tambah frame baru"`
4. Push & buka Pull Request

Ide kontribusi: frame template baru, terjemahan bahasa, mode gelap, export ukuran custom.

## Lisensi

MIT - bebas dipakai, dimodifikasi, dan didistribusikan. Lihat `LICENSE`.
