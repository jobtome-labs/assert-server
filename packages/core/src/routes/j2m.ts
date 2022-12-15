import { FastifyInstance, FastifyPluginOptions } from "fastify";
import { store } from "../index";

const j2m = async (fastify: FastifyInstance, _opts: FastifyPluginOptions) => {
  fastify.post("*", async (request, reply) => {
    const { body, url } = request;
    store.set(url, body);
    return reply.send({
      event: url,
    });
  });
};

export default j2m;
