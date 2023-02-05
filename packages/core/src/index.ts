#!/usr/bin/env node
export { as } from "./loader/rest";
import { FastifyInstance } from "fastify";
import { healthzRoute } from "./routes/healthz";
import avvio from "avvio";
import { start } from "@fastify/restartable";
import { loadHandlers } from "./loader";
import Registry from "./registry/registry";
import Store from "./registry/requestStore";
import { assertRoute } from "./routes/assert";
import { route } from "./routes/handlers";
const app = avvio();

const registry = new Registry();
const store = new Store();

app.use(loadHandlers, registry);

export async function startApplication() {
  const { listen } = await start({
    protocol: "http", // or 'https'
    hostname: "127.0.0.1",
    port: 3100,
    app: myApp,
    logger: true,
  });

  await listen();
}

async function myApp(app: FastifyInstance) {
  const activeMocks = registry.getActiveMocks();

  for (let value of activeMocks.values()) {
    app.route({
      method: value.method,
      url: value.path,
      handler: value.resolver,
      onResponse: (request, _, done) => {
        store.set({
          method: value.method,
          path: value.path,
          request: request,
        });
        done();
      },
    });
  }

  app.register(healthzRoute, { prefix: "/healthz" });

  app.register(route, {
    registry,
    prefix: "/route",
  });

  app.register(assertRoute, {
    store,
    prefix: "/assert",
  });

  console.log("The following routes are now mocked:");
  console.log(app.printRoutes());
}
