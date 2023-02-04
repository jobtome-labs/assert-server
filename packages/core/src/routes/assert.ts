import { FastifyInstance, FastifyPluginOptions } from "fastify";
import Store, { StoreData } from "../registry/requestStore";

type AssertRequestBody = {
  path: string;
  method: string;
};

type AssertResponsePayload = StoreData[];

export const assertRoute = async (
  fastify: FastifyInstance,
  options: FastifyPluginOptions
) => {
  const store = options["store"] as Store;
  fastify.post<{ Body: AssertRequestBody; Reply: AssertResponsePayload }>(
    "/",
    async (request, reply) => {
      const { path, method } = request.body;
      const assertResponse = store.get({ method, path });
      reply.send(assertResponse);
    }
  );

  fastify.get("/reset", async (_, reply) => {
    store.resetAll();
    reply.send({ status: "ok" });
  });

  fastify.post<{ Body: AssertRequestBody }>(
    "/reset",
    async (request, reply) => {
      const { path, method } = request.body;
      store.reset({ method, path });
      reply.send({ status: "ok" });
    }
  );
};
