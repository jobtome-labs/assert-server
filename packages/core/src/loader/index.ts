import glob from "glob";
import * as tsImport from "ts-import";
import { startApplication } from "..";
import Registry, { RegistryMock } from "../registry/registry";

export const loadHandlers = (instance: any, registry: Registry, cb: any) => {
  const items = glob.sync("**/*.as.{js,ts}", { absolute: true });

  const availableMocks: RegistryMock[] = [];

  items.forEach((item) => {
    const mocks = tsImport.loadSync(item, {
      mode: tsImport.LoadMode.Compile,
    }).handlers;

    mocks.forEach((mock: RegistryMock) => {
      availableMocks.push(mock);
    });
  });

  registry.loadAllMocks(availableMocks);
  registry.loadDefaultMocks(availableMocks);

  console.log("All mocks has been loaded, ready to mock!");

  instance.use(startApplication);
  cb();
};
