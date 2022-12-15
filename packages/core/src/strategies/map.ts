import { Strategy } from "./types";

export class MapStrategy implements Strategy {
  private store: Map<string, any>;
  constructor(store: Map<string, any>) {
    this.store = store || new Map();
  }
  process(event: any): boolean {
    // TODO type of the event
    this.store.set(event.url, event.body);
    return true;
  }

  get(key: string): any {
    return this.store.get(key);
  }

  clear(): void {
    this.store.clear();
  }
}
