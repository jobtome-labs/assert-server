import { RouteHandlerMethod } from "fastify";
import { RESTMethods } from "../loader/rest";

export type RegistryMock = {
  method: RESTMethods;
  path: string;
  resolver: RouteHandlerMethod;
  isDefault: boolean;
  name: string;
};

export default class Registry {
  private activeMocks: Map<string, RegistryMock> = new Map();

  private allMocks: RegistryMock[] = [];

  public loadAllMocks = (mocks: RegistryMock[]) => {
    mocks.forEach((mock) => {
      this.allMocks.push(mock);
    });
  };

  public loadDefaultMocks = (mocks: RegistryMock[]) => {
    mocks
      .filter((mock: RegistryMock) => mock.isDefault)
      .forEach((mock) => {
        this.activeMocks.set(`${mock.method} ${mock.path}`, mock);
      });
  };

  public setNewActiveMocks = ({
    name,
    path,
  }: {
    name: string;
    path: string;
  }) => {
    try {
      let currentHandler = this.allMocks.find(
        (mock) => mock.name === name && mock.path === path
      );
      if (currentHandler) {
        this.activeMocks.set(
          `${currentHandler.method} ${currentHandler.path}`,
          currentHandler
        );

        return {
          status: 200,
          message: `Active mock ${name} for ${path} has been set`,
        };
      } else {
        return {
          status: 404,
          message: `Unable to set active mock for ${name}`,
        };
      }
    } catch (error) {
      return {
        status: 500,
        message: `Unable to set active mock for ${name}`,
      };
    }
  };

  public getActiveMocks = () => {
    return this.activeMocks;
  };

  public reloadMocks = (mocks: RegistryMock[]) => {
    const newMocks = this.allMocks.filter((mock) =>
      mocks.filter((newMock) => {
        return newMock.name === mock.name && newMock.path === mock.path;
      })
    );

    this.allMocks = [];
    this.activeMocks.clear();
    this.loadAllMocks([...mocks, ...newMocks]);
    this.loadDefaultMocks(this.allMocks);
  };
}
