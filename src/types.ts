import * as v from "valibot";

export type RawTodo = {
  id: number;
  title: string;
  content: string | null;
  due_date: string | null;
  done: 0 | 1;
};

export type Todo = {
  id: number;
  title: string;
  content: string | null;
  due_date: string | null;
  done: boolean;
};

export const TodoSchema = v.object({
  title: v.string("Not have a title!"),
  content: v.fallback(v.nullable(v.string()), null),
  due_date: v.fallback(v.nullable(v.pipe(v.string(), v.isoDate())), null),
  done: v.fallback(v.boolean(), false),
});

export const UpdateTodoSchema = v.object({
  title: v.optional(v.string()),
  content: v.optional(v.string()),
  due_date: v.optional(v.string()),
  done: v.optional(v.boolean()),
});
