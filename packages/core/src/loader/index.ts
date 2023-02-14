import { startApplication } from "..";
import Registry, { RegistryMock } from "../registry/registry";
import { watcher, requireWitoutCache } from "./runtimeLoader";
import fetch from "node-fetch-commonjs";

type MocksImportType = {
  handlers: RegistryMock[];
};

export const loadHandlers = (instance: any, registry: Registry, cb: any) => {
  watcher.on("all", (event, path) => {
    if (event === "change" || event === "add") {
      const mocks = requireWitoutCache(path) as MocksImportType;
      if (!mocks.handlers) {
        console.log(`No handlers found in ${path}`);
        return;
      }

      registry.reloadMocks(mocks.handlers);
      // Restart the application
      fetch("http://localhost:3100/route/restart");
    }
  });

  console.log("All mocks have been loaded, ready to mock requests! 😀");

  instance.use(startApplication);
  cb();
};
