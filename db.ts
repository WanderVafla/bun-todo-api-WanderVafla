import { Database } from 'bun:sqlite';

const db = new Database("mydb.sqlite", { strict: true });
export function initBD() {
    const query = db.query(`create table if not exists todos (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title text not null, 
        content text,
        due_date text,
        done INTENGER DEFAULT 0
        )`);
    
    const initBD = query.run();
}