import { Database } from "bun:sqlite";

export const db = new Database("mydb.sqlite", { strict: true });
export function initBD() {
  const query = db.query(`
    CREATE TABLE IF NOT EXISTS todos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    content TEXT,
    due_date TEXT,
    done BOOLEAN NOT NULL DEFAULT false
  )`);

  const initBD = query.run();
}