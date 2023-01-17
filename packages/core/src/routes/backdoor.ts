import { FastifyInstance, FastifyPluginOptions } from "fastify";
import { MocksRegistry } from "../mocksRegistry/mocksRegistry";
import { AssertServerStore } from "../store/store";

export const backdoorRoute = async (fastify: FastifyInstance, options: FastifyPluginOptions) => {
  const store = options["catchAllStore"] as AssertServerStore;
  const mocksRegistry = options["mocksRegistry"] as MocksRegistry;

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

  fastify.post("/registerMock", async (request, reply) => {
    mocksRegistry.registerMock(request.body.method + request.body.path, request.body.mock);

    return reply.send({
      ok: true,
    });
  });
};
