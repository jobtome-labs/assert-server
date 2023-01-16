export class MocksRegistry {
  private mocks: Map<string, any> = new Map();

  public registerMock = (key: string, mock: any) => {
    this.mocks.set(key, mock);
  };

  public getMock = (key: string) => {
    return this.mocks.get(key);
  };

  public clear = () => {
    this.mocks.clear();

    return this;
  };
}
