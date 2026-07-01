import Database from 'better-sqlite3'
import { mkdirSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const dataDir = join(__dirname, '..', 'data')
mkdirSync(dataDir, { recursive: true })

const db = new Database(join(dataDir, 'apptechka.db'))

db.pragma('journal_mode = WAL')
db.pragma('foreign_keys = ON')

db.exec(`
  CREATE TABLE IF NOT EXISTS medications (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    dosage TEXT NOT NULL,
    time TEXT,
    has_reminder INTEGER NOT NULL DEFAULT 1,
    last_notified_date TEXT,
    created_at TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS intakes (
    id TEXT PRIMARY KEY,
    medication_id TEXT NOT NULL,
    taken_at TEXT NOT NULL,
    note TEXT,
    FOREIGN KEY (medication_id) REFERENCES medications(id) ON DELETE CASCADE
  );

  CREATE INDEX IF NOT EXISTS idx_intakes_taken_at ON intakes(taken_at);
`)

export default db
