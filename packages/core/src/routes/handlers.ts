import { FastifyInstance, FastifyPluginOptions } from "fastify";
import Registry from "../registry/registry";

type RegisterHandlerBodyType = {
  name: string;
  path: string;
};

type RegisterHandlerResponseType = {
  status: number;
  message: string;
};

export const route = async (
  app: FastifyInstance,
  options: FastifyPluginOptions
) => {
  const registry = options["registry"] as Registry;

  app.get("/restart", async (_, reply) => {
    await app.restart();
    reply.send({ status: "ok" });
  });

  app.post<{
    Body: RegisterHandlerBodyType;
    Reply: RegisterHandlerResponseType;
  }>("/set", async (req, reply) => {
    const { name, path } = req.body;

    const response = registry.setNewActiveMocks({ name, path });

    if (response.status === 200) {
      reply.send(response);
      await app.restart();
    } else {
      reply.send(response);
    }
  });
};
