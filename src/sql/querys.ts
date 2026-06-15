import type { RawTodo, Todo } from "../types";
import { db } from "./db";

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
