import figlet from "figlet";
import index from "./index.html";
import { getTodos, initBD } from "./db";

initBD()

const server = Bun.serve({
  port: 3000,
  routes: {
    '/': index,
    '/figlet': () => {
      const body = figlet.textSync('Bun!');
      return new Response(body)
    },
    '/todos': () => Response.json(getTodos())
  }
})

console.log(`Listening on ${server.url}`);