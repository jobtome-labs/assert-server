import { readdir } from "fs-extra";
import { resolve } from "node:path";
import { cwd } from "node:process";
import * as tsImport from 'ts-import';
import { server } from "../index";

export const start = async () => {
  try {
    await server.listen({ port: 3100 });
  } catch (err) {
    server.log.error(err);
    process.exit(1);
  }
};

async function* getFiles(dir: string): any {
  const dirents = await readdir(dir, { withFileTypes: true });
  for (const dirent of dirents) {
    const res = resolve(dir, dirent.name);
    if (dirent.name === "node_modules" || dirent.name === ".cache") {
      continue;
    }
    if (dirent.isDirectory()) {
      yield* getFiles(res);
    } else {
      yield res;
    }
  }
}

export default (async () => {
  for await (const f of getFiles(cwd())) {
    if (f.includes('.as.')) {
      server.register(tsImport.loadSync(f))
    }
  }
  start();
})()

