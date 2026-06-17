import index from "./index.html";
import { initBD } from "./src/sql/db";
import { TodoSchema, UpdateTodoSchema, type Todo } from "./src/types";
import * as v from "valibot";
import { addTodo, getTodos, updateData } from "./src/sql/querys";

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
      PATCH: async req => {
        try {
          const id = req.params.id

          if (!id) {
            return Response.json({error: "Missing id in request"}, { status: 404 })
          }
          
          const json = await req.json();
          const patchData = v.parse(UpdateTodoSchema, json);
          
          const item = updateData(Number(req.params.id), { ...patchData })

          if (item && item.error) {
            return Response.json({error: item.error}, {status: item.status})
          }
          
          return Response.json(req.params.id) 
        } catch (error) {

          if (v.isValiError(error)) {
            const errors = v.flatten(error.issues).nested;
            return Response.json({ errors }, { status: 400 });
          }
          
          console.error("Critical error: ", error);
          return Response.json({ status: 500 })
        }
      }
    }
  },
});

console.log(`Listening on ${server.url}`);
