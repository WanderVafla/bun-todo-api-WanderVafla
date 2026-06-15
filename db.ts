import type { StringLike } from "bun";
import { Database } from "bun:sqlite";
import { boolean, title } from "valibot";

const db = new Database("mydb.sqlite", { strict: true });
export function initBD() {
  const query = db.query(`create table if not exists todos (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title text not null,
        content text,
        due_date text,
        done BOOLEAN NOT NULL DEFAULT false
        )`);

  const initBD = query.run();
}

interface RawTodo {
  id: number;
  title: string;
  content: string | null;
  due_date: string | null;
  done: 0 | 1;
};

type Todo = {
  id: number;
  title: string;
  content: string | null;
  due_date: string | null;
  done: boolean;
};

export function getTodos(): Todo[] {
  const RawTodo = db.query<RawTodo, []>(`select * from todos`).all();
  const todos = RawTodo.map((todo) => {
    return {
      ...todo,
      done: Boolean(todo.done)
    };
  });
  return todos
}
