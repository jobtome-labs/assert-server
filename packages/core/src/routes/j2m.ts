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
  fastify.get("/job/*", async (request, reply) => {
    const { url } = request;
    const counter = (store.get("/api/job") | 0) + 1;
    store.set("/api/job", counter);
    request.log.info(`Call #${counter}: Received request for ${url}`);
    return reply.send({
      event: url,
    });
  });
};

export default j2m;
