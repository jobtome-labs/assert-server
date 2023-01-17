import { FastifyRequest } from "fastify";

type AssertServerRequest = Partial<FastifyRequest>;
type StoreData = Array<AssertServerRequest>;

export interface AssertServerStore {
  process(event: AssertServerRequest): AssertServerStore;
  clear(): AssertServerStore;
  get(): StoreData;
}

export class Store implements AssertServerStore {
  private data: StoreData;
  constructor(initialData: StoreData) {
    this.data = initialData || [];
  }

  process(event: AssertServerRequest) {
    this.data.push(event);
    return this;
  }

  get(): StoreData {
    return this.data;
  }

  clear() {
    console.log("called clear");
    this.data.length = 0;
    return this;
  }
}
