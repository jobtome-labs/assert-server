import { FastifyInstance, FastifyPluginOptions } from "fastify";
import Assert, { AssertData } from "../registry/assert";

type AssertRequestBody = {
  path: string;
  method: string;
};

type AssertResponsePayload = AssertData[];

export const assertRoute = async (
  fastify: FastifyInstance,
  options: FastifyPluginOptions
) => {
  const assert = options["assert"] as Assert;
  fastify.post<{ Body: AssertRequestBody; Reply: AssertResponsePayload }>(
    "/assert",
    async (request, reply) => {
      const { path, method } = request.body;
      const assertResponse = assert.get({ method, path });
      return reply.send(assertResponse);
    }
  );

  fastify.get("/assert/reset", async (_, reply) => {
    assert.resetAll();
    return reply.send({ status: "ok" });
  });
  fastify.post<{ Body: AssertRequestBody }>(
    "/assert/reset",
    async (request, reply) => {
      const { path, method } = request.body;
      assert.reset({ method, path });
      return reply.send({ status: "ok" });
    }
  );
};
