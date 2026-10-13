import Database from "better-sqlite3";
import fs from "node:fs";
import path from "node:path";

const DATA_DIR = path.join(process.cwd(), "data");
const DB_PATH = path.join(DATA_DIR, "twibbonkita.db");

let db: Database.Database | null = null;

export function getDb(): Database.Database {
  if (db) return db;
  fs.mkdirSync(DATA_DIR, { recursive: true });
  db = new Database(DB_PATH);
  db.pragma("journal_mode = WAL");
  migrate(db);
  return db;
}

function migrate(d: Database.Database) {
  d.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      display_name TEXT NOT NULL,
      avatar_url TEXT,
      created_at TEXT NOT NULL
    );
    CREATE TABLE IF NOT EXISTS campaigns (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      slug TEXT UNIQUE NOT NULL,
      title TEXT NOT NULL,
      description TEXT DEFAULT '',
      frame_data TEXT NOT NULL,
      caption_template TEXT DEFAULT '',
      creator_id INTEGER REFERENCES users(id),
      use_count INTEGER NOT NULL DEFAULT 0,
      created_at TEXT NOT NULL
    );
    CREATE TABLE IF NOT EXISTS sessions (
      token TEXT PRIMARY KEY,
      user_id INTEGER NOT NULL REFERENCES users(id),
      created_at TEXT NOT NULL,
      expires_at TEXT NOT NULL
    );
    CREATE INDEX IF NOT EXISTS idx_campaigns_slug ON campaigns(slug);
    CREATE INDEX IF NOT EXISTS idx_campaigns_creator ON campaigns(creator_id);
    CREATE INDEX IF NOT EXISTS idx_users_username ON users(username);
  `);
  seed(d);
}

const SEED_FRAMES: Array<[string, string, string]> = [
  ["badge", "Badge Lingkaran", "Template bawaan TwibbonKita: badge lingkaran emas elegan."],
  ["kotak", "Kotak Membulat", "Template bawaan TwibbonKita: bingkai kotak dengan sudut membulat."],
  ["gradasi", "Bingkai Gradasi", "Template bawaan TwibbonKita: border gradasi modern yang minimalis."],
  ["pita", "Pita Kampanye", "Template bawaan TwibbonKita: gaya pita kampanye klasik."],
  ["minimal", "Minimalis", "Template bawaan TwibbonKita: garis tipis yang bersih dan elegan."],
  ["meriah", "Meriah", "Template bawaan TwibbonKita: penuh warna untuk momen perayaan."],
];

function seed(d: Database.Database) {
  let sys = d
    .prepare("SELECT id FROM users WHERE username = 'twibbonkita'")
    .get() as { id: number } | undefined;
  if (!sys) {
    const r = d
      .prepare(
        "INSERT INTO users (username, password_hash, display_name, created_at) VALUES (?, ?, ?, ?)"
      )
      .run("twibbonkita", "", "TwibbonKita Official", new Date().toISOString());
    sys = { id: Number(r.lastInsertRowid) };
  }
  const ins = d.prepare(
    `INSERT INTO campaigns (slug, title, description, frame_data, caption_template, creator_id, created_at)
     VALUES (?, ?, ?, ?, ?, ?, ?)`
  );
  for (const [id, name, desc] of SEED_FRAMES) {
    const exists = d
      .prepare("SELECT id FROM campaigns WHERE slug = ?")
      .get(`frame-${id}`);
    if (!exists) {
      ins.run(
        `frame-${id}`,
        name,
        desc,
        `/frames/${id}.svg`,
        "Halo! Saya [nama], saya ikut berpartisipasi! #TwibbonKita",
        sys.id,
        new Date().toISOString()
      );
    }
  }
}

export interface CampaignRow {
  id: number;
  slug: string;
  title: string;
  description: string;
  frame_data: string;
  caption_template: string;
  creator_id: number;
  use_count: number;
  created_at: string;
  username: string;
  display_name: string;
}
