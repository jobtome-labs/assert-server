import Fastify from "fastify";
import { TypeBoxTypeProvider } from "@fastify/type-provider-typebox";
import { Static, Type } from "@sinclair/typebox";
import healthz from "./routes/healthz";
import j2m from "./routes/j2m";

export const store = new Map<string, any>();

const server = Fastify({
  logger: true,
}).withTypeProvider<TypeBoxTypeProvider>();

server.register(healthz, { prefix: "/healthz" });
server.register(j2m, { prefix: "/api" });

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
