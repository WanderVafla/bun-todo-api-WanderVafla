import * as v from 'valibot'

export const TodoSchema = v.object({
  title: v.string("Not have a title!"),
  content: v.fallback(v.nullable(v.string()), null),
  due_date: v.fallback(v.nullable(v.pipe(v.string(), v.isoDate())), null),
  done: v.fallback(v.boolean(), false),
});

export const UpdateTodoSchema = v.partial(TodoSchema);