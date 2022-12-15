export interface Strategy {
  process(event: any): boolean;
  clear(): void;
}
