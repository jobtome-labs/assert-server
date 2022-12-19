import { FastifyInstance, FastifyPluginOptions } from "fastify";
import { AssertServerStore } from "../store/store";

export const catchAllRoute = async (fastify: FastifyInstance, options: FastifyPluginOptions) => {
  const store = options["catchAllStore"] as AssertServerStore;
  fastify.all("*", async (request, reply) => {
    store.process({
      method: request.method,
      url: request.url,
      body: request.body,
      headers: request.headers,
    });

    return reply.send({
      ok: true,
    });
  });
};
