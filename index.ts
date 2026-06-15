import figlet from "figlet";
import index from "./index.html";
import { addTodo, getTodos, initBD } from "./db";
import type { Todo } from "./types";

initBD()

const server = Bun.serve({
  port: 3000,
  routes: {
    '/': index,
    '/todos': {
      GET: () => Response.json(getTodos()),
      POST: async req => {
        const post = await req.json() as Omit<Todo, 'id'>;
        const postTodo = addTodo(post)
        return Response.json({...post}, {status: 201})
      }
    },
  }
})

console.log(`Listening on ${server.url}`);