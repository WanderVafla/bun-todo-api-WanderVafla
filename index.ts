import index from "./index.html";
import { initBD } from "./src/sql/db";
import { deleteAllRoute, deleteRoute, getRoute, optionRoute, patchRoute, postRoute } from "./src/routes";

initBD();

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, PATCH, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, prefer",
};

const server = Bun.serve({
  port: 3000,
  routes: {
    "/": index,
    "/todos": {
      OPTIONS: () => optionRoute(),
      GET: () => getRoute(),
      POST: (req) => postRoute(req), 
      DELETE: () => deleteAllRoute()
    },
    "/todos/:id": {
      OPTIONS: () => optionRoute(),
      PATCH: (req) => patchRoute(req),
      DELETE: (req) => deleteRoute(req)
    },
  },
});

console.log(`Listening on ${server.url}`);
