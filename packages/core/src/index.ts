#!/usr/bin/env node
import Fastify from "fastify";
import { TypeBoxTypeProvider } from "@fastify/type-provider-typebox";
import { Static, Type } from "@sinclair/typebox";
import { healthzRoute } from "./routes/healthz";
import { catchAllRoute } from "./routes/catchAll";
import { backdoorRoute } from "./routes/backdoor";
import { Store } from "./store/store";
import { MocksRegistry } from "./mocksRegistry/mocksRegistry";
import * as tsImport from 'ts-import';
import { glob } from "glob";

glob("**/*.as.{js,ts}", (_err, files) => {
  for (const file of files) {
    console.log(file)
    server.register(tsImport.loadSync(file))
  }

  start()
})

export const start = async () => {
  try {
    await server.listen({ port: 3100 });
  } catch (err) {
    server.log.error(err);
    process.exit(1);
  }
};

export const store = new Map<string, any>();
export const server = Fastify({
  logger: true,
}).withTypeProvider<TypeBoxTypeProvider>();

const catchAllStore = new Store([]);
const mocksRegistry = new MocksRegistry();

server.register(catchAllRoute, {
  catchAllStore,
  mocksRegistry,
});
server.register(healthzRoute, { prefix: "/healthz" });
server.register(backdoorRoute, { prefix: "/__backdoor__", catchAllStore, mocksRegistry });

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

server.post<{ Body: EventReceivedType; Reply: any }>("/reset", { schema: eventSchema }, async (request, reply) => {
  const { event } = request.body;
  store.set(event, null);
  reply.status(200).send({ status: "ok" });
});

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