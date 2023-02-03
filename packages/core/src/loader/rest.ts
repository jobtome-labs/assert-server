export type Path = string | RegExp;
import { RouteHandlerMethod } from "fastify";

export enum RESTMethods {
  HEAD = "HEAD",
  GET = "GET",
  POST = "POST",
  PUT = "PUT",
  PATCH = "PATCH",
  OPTIONS = "OPTIONS",
  DELETE = "DELETE",
}

class RestHandler {
  constructor(
    public method: RESTMethods | RegExp,
    public path: Path,
    public isDefault: boolean,
    public name: string,
    public resolver: RouteHandlerMethod
  ) {
    this.method = method;
    this.path = path;
    this.isDefault = isDefault;
    this.name = name;
    this.resolver = resolver;
  }
}

export type RestHandlerType = typeof RestHandler;

function createHandler<Method extends RESTMethods | RegExp>(method: Method) {
  return (
    path: Path,
    isDefault: boolean,
    name: string,
    resolver: RouteHandlerMethod
  ) => {
    return new RestHandler(method, path, isDefault, name, resolver);
  };
}

export const as = {
  all: createHandler(/.+/),
  head: createHandler(RESTMethods.HEAD),
  get: createHandler(RESTMethods.GET),
  post: createHandler(RESTMethods.POST),
  put: createHandler(RESTMethods.PUT),
  delete: createHandler(RESTMethods.DELETE),
  patch: createHandler(RESTMethods.PATCH),
  options: createHandler(RESTMethods.OPTIONS),
};
