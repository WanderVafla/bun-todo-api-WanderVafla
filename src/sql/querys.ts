import { object } from "valibot";
import type { RawTodo, Todo } from "../types";
import { db } from "./db";
import { errors } from "../constants";

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

export function updateData(id: number, data: Partial<Todo>) {
  const keysData = Object.keys(data);
  console.log(data);

  const setClause = keysData
    .map((keyValue) => `${keyValue} = $${keyValue}`)
    .join(", ");
  console.log(setClause);

  const variables = Object.entries(data)
    .map(
      (keyOrValue) => `${keyOrValue[0]}: "${keyOrValue[1]}"
                        id: ${id}`,
    )
    .join(",\n");

  const check_query = db
    .query(`
    SELECT * FROM todos WHERE id = $id
    `).get({
        id: id
      });
  if (!check_query) {
    return errors.SearchError.notExistId(id);
  }

  const query = db.query(`
      UPDATE todos
      SET
        ${setClause}
      WHERE
        id = $id
    `);

  query.run({ ...data, id: id });
}
