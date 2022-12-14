import fastify from "fastify";
import { TypeBoxTypeProvider } from "@fastify/type-provider-typebox";
import { Static, Type } from "@sinclair/typebox";

const store = new Map<string, any>();

const server = fastify({
  logger: true,
}).withTypeProvider<TypeBoxTypeProvider>();

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

server.get("/healthz", async (_request, response) => {
  return response.send({ status: "ok" });
});

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

server.post("/api/*", async (request, reply) => {
  const { body, url } = request;
  store.set(url, body);
  return reply.send({
    event: url,
    body: body,
  });
});

// Run the server!
const start = async () => {
  try {
    await server.listen({ port: 3100 });
  } catch (err) {
    server.log.error(err);
    process.exit(1);
  }
};
start();
