import chockidar from "chokidar";
import * as tsImport from "ts-import";

export const watcher = chockidar.watch("**/*.as.{js,ts}", {
  ignored: [/.cache/, /node_modules/],
  awaitWriteFinish: true,
});

export function requireWitoutCache(path: string) {
  // I need to delete the cache for the file that has been changed
  for (let key in require.cache) {
    if (key.includes(path.replace(".ts", ".js"))) {
      delete require.cache[key];
    }
  }

  return tsImport.loadSync(path, {
    mode: tsImport.LoadMode.Compile,
    useCache: false,
  });
}
