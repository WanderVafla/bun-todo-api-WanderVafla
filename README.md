# Todo API on Bun

A simple and lightweight API for a Todo list.

Supported REST API 

## Installation

Before installation, ensure you have [Bun](https://bun.sh/docs/installation) installed.

To install dependencies:

```bash
bun install
```

To run:

```bash
bun run start
```

Hosting by default [localhost:3000](http://localhost:3000/)

## Stack

- [Bun](https://bun.sh/) - Web server
- [Sqlite](https://bun.sh/docs/runtime/sqlite) - Database (integrated into Bun)
- [Valibot](https://valibot.dev/) - Data Validation

## Usage

The base URL is [localhost:3000/](http://localhost:3000/)

All todo-related routes are located at [localhost:3000/todos](http://localhost:3000/todos).

Supported Methods
- **GET**: Returns an array of all todos.

- **POST**: Adds a new task and returns the created task as an object.

- **PATCH**: Modifies an existing task.

- **DELETE**: Deletes a task.

### Task Structure
```TypeScript
type Todo = {
  id: number;
  title: string;
  content: string | null;
  due_date: string | null;
  done: boolean;
};
```