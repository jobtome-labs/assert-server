import { Strategy } from "./types";

export class HistoryStrategy implements Strategy {
  private store: Array<any>;
  constructor(store: Array<any>) {
    this.store = store || [];
  }
  process(event: any): boolean {
    // TODO type of the event
    this.store.push(event);
    return true;
  }

  get(key: string): any {
    return this.store.filter((e) => e.url === key);
  }

  clear(): void {
    this.store.length = 0;
  }
}
