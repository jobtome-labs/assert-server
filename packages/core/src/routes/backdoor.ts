import { FastifyInstance, FastifyPluginOptions } from "fastify";
import { AssertServerStore } from "../store/store";

export const backdoorRoute = async (fastify: FastifyInstance, options: FastifyPluginOptions) => {
  const store = options["catchAllStore"] as AssertServerStore;
  fastify.get("/calls", async (_, reply) => {
    return reply.send({
      ok: true,
      data: store.get(),
    });
  });

  fastify.get("/clear", async (_, reply) => {
    return reply.send({
      ok: true,
      data: store.clear().get(),
    });
  });
};
