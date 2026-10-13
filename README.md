# TwibbonKita

Generator twibbon **open-source**, **gratis**, **tanpa watermark**. Seperti Twibbonize, tapi bebas dipakai dan dikembangkan siapa saja.

![License](https://img.shields.io/badge/license-MIT-green) ![Next.js](https://img.shields.io/badge/Next.js-14-black) ![PRs](https://img.shields.io/badge/PRs-welcome-pink)

## Fitur

- **Akun kreator** - daftar/masuk, password di-hash (scrypt), sesi via cookie HTTP-only
- **Bikin campaign** - login dulu, upload frame, dapat halaman campaign publik (`/c/[slug]`) dengan link share
- **Tracking pemakaian** - tiap campaign dibuka, hitungan "dipakai" bertambah dan tercatat ke kreatornya
- **Profil kreator** - `/kreator/[username]`: daftar template yang pernah dibuat + total pemakaian
- **Editor 4 tahap** - Upload -> Frame -> Atur -> Unduh (berurutan, tidak bisa lompat)
- **Upload foto** - klik atau drag & drop (JPG/PNG/WebP)
- **6 frame bawaan** - badge, kotak, gradasi, pita, minimalis, meriah (SVG, bisa ditambah)
- **Upload frame sendiri** - PNG/SVG transparan 1080x1080
- **Editor kanvas** - seret foto (mouse + sentuh), zoom 50-300% (slider + pinch), putar, reset
- **Unduh PNG** - resolusi penuh 1080x1080, **tanpa watermark** (hanya di tahap terakhir)
- **Caption generator** - template dengan placeholder `[nama]`, `[asal]`, dll + tombol salin
- **Halaman kontributor & dukung**
- **UI minimalis modern** - mobile-first, responsif

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

Database SQLite otomatis dibuat di `./data/twibbonkita.db` saat pertama dijalankan (tabel users, campaigns, sessions + seed 6 campaign bawaan).

## Cara Pakai

### Bikin twibbon cepat
1. Buka halaman utama, pilih campaign
2. Klik **Pakai Twibbon Ini**
3. Tahap 1: upload foto kamu
4. Tahap 2: pilih frame (frame campaign sudah terpilih)
5. Tahap 3: seret/zoom/putar foto sampai pas
6. Tahap 4: salin caption, klik **Unduh PNG**

### Bikin campaign + share link
1. **Daftar** akun kreator (gratis)
2. Klik **Buat** (atau buka `/make`)
3. Isi judul, deskripsi, upload frame PNG transparan
4. Isi template caption, contoh: `Saya [nama] dari [kota] mendukung [acara]!`
5. Klik **Buat & Dapatkan Link**
6. Bagikan link `/c/[slug]` ke peserta. Setiap yang membuka tercatat sebagai pemakaian dan masuk ke profilmu.

### Tambah frame bawaan
1. Taruh file SVG/PNG di `public/frames/`
2. Daftarkan di `lib/frames.ts` -> `BUILTIN_FRAMES`
3. Kirim pull request!

## Struktur Project

```
twibbonkita/
├── app/
│   ├── page.tsx              # homepage (campaign populer + kreator)
│   ├── make/page.tsx         # form bikin campaign (login wajib)
│   ├── editor/page.tsx       # editor 4 tahap
│   ├── c/[slug]/page.tsx     # halaman campaign publik
│   ├── kreator/[username]/page.tsx  # profil kreator
│   ├── login/page.tsx
│   ├── daftar/page.tsx
│   ├── kontributor/page.tsx
│   ├── dukung/page.tsx
│   ├── api/
│   │   ├── auth/             # register, login, logout, me
│   │   ├── campaigns/        # list, create, detail
│   │   └── creators/         # daftar kreator
│   ├── layout.tsx
│   └── globals.css
├── components/
│   ├── Header.tsx            # navigasi + status login
│   ├── TwibbonCanvas.tsx     # kanvas + drag/zoom/rotate/download
│   ├── FrameGallery.tsx      # galeri frame
│   └── UploadZone.tsx        # drag & drop foto
├── lib/
│   ├── db.ts                 # SQLite (better-sqlite3) + migrasi + seed
│   ├── auth.ts               # hash password scrypt
│   ├── session.ts            # sesi cookie
│   └── frames.ts             # daftar frame bawaan + util caption
├── public/frames/            # 6 frame SVG bawaan
├── README.md
└── LICENSE (MIT)
```

## Teknologi

- Next.js 14 (App Router) + TypeScript
- Tailwind CSS (tema minimalis modern)
- better-sqlite3 (database file lokal, tanpa server DB)
- HTML5 Canvas (compositing, tanpa library tambahan)
- Node crypto scrypt (hash password)

## Kontribusi

Sangat disambut! Cara ikut:

1. Fork repo ini
2. Buat branch: `git checkout -b fitur-baru`
3. Commit: `git commit -m "Tambah frame baru"`
4. Push & buka Pull Request

Ide kontribusi: frame template baru, terjemahan bahasa, mode gelap, export ukuran custom, OAuth login.

## Lisensi

MIT - bebas dipakai, dimodifikasi, dan didistribusikan. Lihat `LICENSE`.
