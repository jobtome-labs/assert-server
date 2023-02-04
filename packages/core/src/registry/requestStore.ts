import { FastifyRequest } from "fastify";
import { RESTMethods } from "../loader/rest";

export type StoreData = {
  body: FastifyRequest["body"];
  query: FastifyRequest["query"];
  headers: FastifyRequest["headers"];
};

export default class Store {
  public request: Map<string, StoreData[]> = new Map();

  public set = ({
    method,
    path,
    request,
  }: {
    method: RESTMethods;
    path: string;
    request: FastifyRequest;
  }) => {
    const previusRequests = this.request.get(`${method} ${path}`) || [];
    this.request.set(`${method} ${path}`, [
      ...previusRequests,
      {
        body: request.body,
        query: request.query,
        headers: request.headers,
      },
    ]);
  };

  public get = ({ method, path }: { method: string; path: string }) => {
    return this.request.get(`${method} ${path}`);
  };

  public reset = ({ method, path }: { method: string; path: string }) => {
    this.request.delete(`${method} ${path}`);
  };

  public resetAll = () => {
    this.request.clear();
  };
}
