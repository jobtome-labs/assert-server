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

    console.log("Processing request: ", request.method, request.url);

    const mockKey = request.method + request.url.split("?")[0];
    console.log("Trying to fetch mock reply for: ", mockKey);

    const mockReply = mocksRegistry.getMock(mockKey);
    if (mockReply) {
      console.log("Sending mock reply to: ", request.method, request.url);
      return reply.send(mockReply);
    }

    console.log("Sending default reply to: ", request.method, request.url);
    return reply.send({
      ok: true,
    });
  });
};
