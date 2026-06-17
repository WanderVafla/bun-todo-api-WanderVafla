import index from "./index.html";
import { initBD } from "./src/sql/db";
import { TodoSchema, UpdateTodoSchema, type Todo } from "./src/types";
import * as v from "valibot";
import { addTodo, getTodos, updateData } from "./src/sql/querys";
import { errors } from "./src/constants";

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
    "/todos/:id": {
      PATCH: async (req) => {
        try {
          const id = req.params.id;

          const json = await req.json();
          const patchData = v.parse(UpdateTodoSchema, json);

          const item = updateData(Number(req.params.id), { ...patchData });

          return Response.json(item);
        } catch (error) {
          if (v.isValiError(error)) {
            const errors = v.flatten(error.issues).nested;
            return Response.json({ errors }, { status: 400 });
          }

          if (error === errors.SearchError.notFoubdId) {
            return Response.json({ error: error }, { status: 404 });
          }

          console.error(error);
          return Response.json({ error: `Error: ${error}` }, { status: 500 });
        }
      },
    },
  },
});

console.log(`Listening on ${server.url}`);
