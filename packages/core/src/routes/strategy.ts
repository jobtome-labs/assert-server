import { FastifyInstance, FastifyPluginOptions } from "fastify";
import { Strategy } from "../strategies/types";

export const strategyRoute = async (fastify: FastifyInstance, _opts: FastifyPluginOptions) => {
  fastify.post("*", async (request, reply) => { // TODO asterisk 
    const strategy: Strategy = request.endpointManager.getStrategy(request.url);

    if (!strategy) {
      return reply.send({
        error: "No strategy found for ...",
      });
    }

    strategy.process(request.body);

    return reply.send({
      event: url,
    });
  });

  fastify.get("/get", async (request, reply) => { // get, filter? Or what? more like a query to the strategy
    const { url } = request.query;
    const strategy: Strategy = request.endpointManager.getStrategy(url);

    if (!strategy) {
      return reply.send({
        error: "No strategy found for ...",
      });
    }

    const result = strategy.get(url); // TODO url or key? how about params?

    return reply.send({
      event: url,
      result,
    });
  }

};
