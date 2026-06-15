import index from "./index.html";
import { initBD } from "./src/sql/db";
import { TodoSchema } from "./src/types";
import * as v from "valibot";
import { addTodo, getTodos } from "./src/sql/querys";

initBD();

const server = Bun.serve({
  port: 3000,
  routes: {
    "/": index,
    "/todos": {
      GET: () => Response.json(getTodos()),
      POST: async (req) => {
        try {
          const json = await req.json();
          const post = v.parse(TodoSchema, json);

          const postTodo = addTodo(post);

          return Response.json({ ...postTodo }, { status: 201 });
        } catch (error) {

          if (v.isValiError(error)) {
            const errors = v.flatten(error.issues).nested;
            return Response.json({ errors }, { status: 400 });
          }

          console.error("Critical error: ", error);
          return Response.json({ error: error }, { status: 500 });
        }
      },
    },
  },
});

console.log(`Listening on ${server.url}`);
