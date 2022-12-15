import { FastifyInstance } from "fastify";

async function healthz(fastify: FastifyInstance) {
  fastify.get("/", async (_request, reply) => {
    return reply.send({ status: "ok" });
  });
}

export default healthz;
