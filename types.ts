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