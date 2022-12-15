import { FastifyInstance, FastifyPluginOptions } from "fastify";
import { EndpointManager } from "../endpoint-manager/EndpointManager";

export const adminRoute = async (fastify: FastifyInstance, _opts: FastifyPluginOptions) => {
  fastify.post("/addEndpoint", async (request, reply) => {
    const { body } = request;
    const { endpoint, strategyType } = body;

    endpointManager.registerEndpoint(endpoint, strategyType);

    return reply.send({
      status: "ok",
      event: endpoint,
    });
  });
};
