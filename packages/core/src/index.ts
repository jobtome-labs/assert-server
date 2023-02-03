#!/usr/bin/env node
import { FastifyInstance } from "fastify";
import { healthzRoute } from "./routes/healthz";
import avvio from "avvio";
import { loadHandlers } from "./loader";
import Registry from "./registry/registry";
import Assert from "./registry/assert";
import { start } from "@fastify/restartable";
import { assertRoute } from "./routes/assert";
import { as } from "./loader/rest";

export default as;

type RegisterHandlerBodyType = {
  name: string;
  path: string;
};

type RegisterHandlerResponseType = {
  status: number;
  message: string;
};

const app = avvio();

const registry = new Registry();
const assert = new Assert();

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
        assert.set({
          method: value.method,
          path: value.path,
          request: request,
        });
        done();
      },
    });
  }

  app.register(healthzRoute, { prefix: "/healthz" });

  app.get("/restart", async (_, reply) => {
    await app.restart();
    reply.send({ status: "ok" });
  });

  app.post<{
    Body: RegisterHandlerBodyType;
    Reply: RegisterHandlerResponseType;
  }>("/set", async (req, reply) => {
    const { name, path } = req.body;

    const response = registry.setNewActiveMocks({ name, path });

    if (response.status === 200) {
      reply.send(response);
      await app.restart();
    } else {
      reply.send(response);
    }
  });

  app.register(assertRoute, {
    assert,
  });

  console.log("The following routes are now mocked:");
  console.log(app.printRoutes());
}
