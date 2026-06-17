import { errors } from "./constants";
import { addTodo, deleteTodo, getTodos, updateData } from "./sql/todo.querys";
import { TodoSchema, UpdateTodoSchema } from "./types/todo.shemas";
import type { Todo } from "./types/todo.types";
import * as v from "valibot";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, PATCH, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, prefer",
};

export function optionRoute() {
  return new Response(null, { status: 204, headers: corsHeaders });
}

export function getRoute() {
  return Response.json(getTodos(), {headers: corsHeaders})
}

export async function postRoute(req: Bun.BunRequest) {
  try {
    const json = await req.json();
    const post = v.parse(TodoSchema, json);

    const postTodo = addTodo(post);

    return Response.json(
      postTodo,
      { status: 201, headers: corsHeaders },
    );
  } catch (error) {
    if (v.isValiError(error)) {
      const errors = v.flatten(error.issues).nested;
      return Response.json(
        { error: errors },
        { status: 400, headers: corsHeaders },
      );
    }

    console.error("Critical error: ", error);
    return Response.json(
      { error: error },
      { status: 500, headers: corsHeaders },
    );
  }
}

export async function patchRoute(req: Bun.BunRequest) {
  try {
    const id = req.params.id;

    const json = await req.json();
    const patchData = v.parse(UpdateTodoSchema, json);

    const item = updateData(Number(id), { ...patchData });

    return Response.json(item, { status: 201, headers: corsHeaders });
  } catch (error) {
    if (v.isValiError(error)) {
      const errors = v.flatten(error.issues).nested;
      return Response.json(
        errors,
        { status: 400, headers: corsHeaders },
      );
    }

    if (error === errors.SearchError.notFoundId) {
      return Response.json(
        error,
        { status: 404, headers: corsHeaders },
      );
    }

    console.error(error);
    return Response.json(
      error,
      { status: 500, headers: corsHeaders },
    );
  }
}

export function deleteRoute(req: Bun.BunRequest) {
  const id = req.params.id;

  try {
    deleteTodo(Number(id));
    return new Response(null, { status: 204, headers: corsHeaders });
  } catch (error) {
    if (error === errors.QueryError.itemIsNotDeleted) {
      return new Response(null, { status: 404, headers: corsHeaders });
    }
    return new Response(null, { status: 500, headers: corsHeaders });
  }
}