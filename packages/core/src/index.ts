#!/usr/bin/env node
import Fastify, { FastifyInstance } from "fastify";
import { TypeBoxTypeProvider } from "@fastify/type-provider-typebox";
import { Static, Type } from "@sinclair/typebox";
import { healthzRoute } from "./routes/healthz";
import { catchAllRoute } from "./routes/catchAll";
import { backdoorRoute } from "./routes/backdoor";
import { Store } from "./store/store";
import { MocksRegistry } from "./mocksRegistry/mocksRegistry";
import avvio from "avvio";
import { loadHandlers } from "./loader";
import Registry from "./registry/registry";
import { start } from "@fastify/restartable";

type RegisterHandlerBodyType = {
  name: string;
  path: string;
};

type RegisterHandlerResponseType = {
  status: number;
  message: string;
};

const server = Fastify({
  logger: true,
}).withTypeProvider<TypeBoxTypeProvider>();

const app = avvio();

const registry = new Registry();

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

export const store = new Map<string, any>();

const catchAllStore = new Store([]);
const mocksRegistry = new MocksRegistry();

server.register(catchAllRoute, {
  catchAllStore,
  mocksRegistry,
});
server.register(healthzRoute, { prefix: "/healthz" });
server.register(backdoorRoute, {
  prefix: "/__backdoor__",
  catchAllStore,
  mocksRegistry,
});

const EventReceived = Type.Object({
  event: Type.String(),
});

type EventReceivedType = Static<typeof EventReceived>;

const eventSchema = {
  body: EventReceived,
  response: {
    200: {
      response: Type.Any(),
    },
  },
};

server.post<{ Body: EventReceivedType; Reply: any }>(
  "/reset",
  { schema: eventSchema },
  async (request, reply) => {
    const { event } = request.body;
    store.set(event, null);
    reply.status(200).send({ status: "ok" });
  }
);

server.post<{ Body: EventReceivedType; Reply: any }>(
  "/get",
  {
    schema: eventSchema,
  },
  async (request, reply) => {
    const { event } = request.body;
    const data = store.get(event);
    request.log.info(data);
    reply.send({
      response: data,
    });
  }
);

async function myApp(app: FastifyInstance) {
  const activeMocks = registry.getActiveMocks();

  for (let value of activeMocks.values()) {
    app.route({
      method: value.method,
      url: value.path,
      handler: value.resolver,
    });
  }

  app.register(healthzRoute);

  app.get("/restart", async (_, reply) => {
    await app.restart();
    return reply.send({ status: "ok" });
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

  console.log("The following routes are now mocked:");
  console.log(app.printRoutes());
}
