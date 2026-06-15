import type { StringLike } from "bun";
import { Database } from "bun:sqlite";
import { boolean, title } from "valibot";
import type { RawTodo, Todo } from "./types";

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

export function getTodos(): Todo[] {
  const rawTodos = db.query<RawTodo, []>(`select * from todos`).all();
  return rawTodos.map((todo) => {
    return {
      ...todo,
      done: Boolean(todo.done),
    };
  });
}

export function addTodo(elements: Omit<Todo, "id">): Omit<Todo, "id"> {
  const query = db.query(`
      INSERT INTO todos (title, content, due_date, done)
      VALUES ($title, $content, $due_date, $done)
      RETURNING *
    `);

  const insertedTodo = query.get({
    title: elements.title,
    content: elements.content ?? null,
    due_date: elements.due_date ?? null,
    done: elements.done ? 1 : 0,
  }) as Todo;

  return { ...insertedTodo, done: Boolean(insertedTodo.done) };
}
