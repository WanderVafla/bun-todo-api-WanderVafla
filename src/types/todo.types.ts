export type Todo = {
  id: number;
  title: string;
  content: string | null;
  due_date: string | null;
  done: boolean;
};

export type RawTodo = Omit<Todo, 'done'> & { done: 0 | 1 };