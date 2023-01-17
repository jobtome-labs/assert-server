import { FastifyInstance, FastifyPluginOptions } from "fastify";
import { MocksRegistry } from "../mocksRegistry/mocksRegistry";
import { AssertServerStore } from "../store/store";

export const catchAllRoute = async (fastify: FastifyInstance, options: FastifyPluginOptions) => {
  const store = options["catchAllStore"] as AssertServerStore;
  const mocksRegistry = options["mocksRegistry"] as MocksRegistry;

  fastify.all("*", async (request, reply) => {
    store.process({
      method: request.method,
      url: request.url,
      body: request.body,
      headers: request.headers,
    });

    const mockReply = mocksRegistry.getMock(request.method + request.url);
    if (mockReply) {
      return reply.send(mockReply);
    }

    return reply.send({
      ok: true,
    });
  });
};
