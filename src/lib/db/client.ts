import { createClient } from "@libsql/client";

const url = process.env.TURSO_DATABASE_URL || "file:jobtracker.db";
const authToken = process.env.TURSO_AUTH_TOKEN || undefined;

export const db = createClient({
  url,
  authToken,
});

let schemaInitialized = false;

export async function ensureSchema() {
  if (schemaInitialized) return;

  await db.execute(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      created_at TEXT NOT NULL
    );
  `);

  await db.execute(`
    CREATE TABLE IF NOT EXISTS job_applications (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      company_name TEXT NOT NULL,
      position TEXT NOT NULL,
      status TEXT NOT NULL,
      applied_date TEXT NOT NULL,
      source TEXT,
      job_url TEXT,
      salary_range TEXT,
      location TEXT,
      work_type TEXT,
      notes TEXT,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    );
  `);

  await db.execute(`
    CREATE INDEX IF NOT EXISTS idx_job_applications_user_id ON job_applications(user_id);
  `);

  await db.execute(`
    CREATE INDEX IF NOT EXISTS idx_job_applications_status ON job_applications(status);
  `);

  await db.execute(`
    CREATE TABLE IF NOT EXISTS status_history (
      id TEXT PRIMARY KEY,
      job_application_id TEXT NOT NULL,
      status TEXT NOT NULL,
      changed_at TEXT NOT NULL,
      FOREIGN KEY (job_application_id) REFERENCES job_applications(id) ON DELETE CASCADE
    );
  `);

  await db.execute(`
    CREATE INDEX IF NOT EXISTS idx_status_history_application_id ON status_history(job_application_id);
  `);

  schemaInitialized = true;
}
