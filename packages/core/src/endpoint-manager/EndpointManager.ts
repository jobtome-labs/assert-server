import { Strategy } from "../strategies/types";

export class EndpointManager {
  private store: Map<string, any>;
  constructor(store: Map<string, any>) {
    this.store = store || new Map();
  }

  registerEndpoint(endpoint: string, strategy: Strategy) {
    this.store.set(endpoint, strategy);
  }

  getStrategy(endpoint: string) {
    return this.store.get(endpoint);
  }
}
