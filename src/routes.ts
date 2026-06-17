import { errors } from "./constants";
import { addTodo, deleteAllTodo, deleteTodo, getTodos, updateData } from "./sql/todo.querys";
import { TodoSchema, UpdateTodoSchema } from "./types/todo.shemas";
import * as v from "valibot";

export function optionRoute() {
  try {
    return new Response(null, { status: 204, headers: corsHeaders });
  } catch (error) {
    return JSONResponse(error, 500);
  }
}

export function getRoute() {
  try {
    return JSONResponse(getTodos(), 200);
  } catch (error) {
    return JSONResponse(error, 500);
  }
}

export async function postRoute(req: Bun.BunRequest) {
  try {
    const json = await req.json();
    const post = v.parse(TodoSchema, json);

    const postTodo = addTodo(post);

    return JSONResponse(postTodo, 201);
  } catch (error) {
    if (v.isValiError(error)) {
      const errors = v.flatten(error.issues).nested;
      return JSONResponse(errors, 400);
    }

    return JSONResponse(error, 500);
  }
}

export async function patchRoute(req: Bun.BunRequest) {
  try {
    const id = req.params.id;

    const json = await req.json();
    const patchData = v.parse(UpdateTodoSchema, json);

    const item = updateData(Number(id), { ...patchData });

    return JSONResponse(item, 201)
  } catch (error) {
    if (v.isValiError(error)) {
      const errors = v.flatten(error.issues).nested;
      return JSONResponse(errors, 400);
    }

    if (error === errors.SearchError.notFoundId) {
      return JSONResponse(error, 404);
    }

    console.error(error);
    return JSONResponse(error, 500);
  }
}

export function deleteRoute(req: Bun.BunRequest) {
  try {
    const id = req.params.id;
    
    deleteTodo(Number(id));
    return JSONResponse(null, 204);
  } catch (error) {
    if (error === errors.QueryError.itemIsNotDeleted) {
      return JSONResponse(null, 404);
    }
    return JSONResponse(error, 500);
  }
}

export function deleteAllRoute() {
  try {
    deleteAllTodo();
    return JSONResponse(null, 204);
  } catch (error) {
    return JSONResponse(error, 500);
  }
}

// Function helper
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, PATCH, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, prefer",
};

const JSONResponse = (body: unknown, status: number) => {
  return Response.json(body, { status: status, headers: corsHeaders });
};
