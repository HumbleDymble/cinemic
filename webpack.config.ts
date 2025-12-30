import path from "node:path";
import { fileURLToPath } from "node:url";
import { Configuration } from "webpack";
import { IPaths, Mode } from "./config/types.js";
import { webpackClient } from "./config/webpackClient.js";
import { webpackServer } from "./config/webpackServer.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

interface IEnv {
  mode: Mode;
  port: number;
  analyzer?: boolean;
}

export default (env: IEnv): Configuration[] => {
  const pathClient: IPaths = {
    output: path.resolve("build/client"),
    entry: path.resolve("src/client/app/entrypoint", "index.tsx"),
    src: path.resolve(__dirname, "src/client"),
  };

  const pathServer: IPaths = {
    output: path.resolve("build/server"),
    entry: path.resolve("src/server/app/entrypoint", "index.ts"),
    src: path.resolve(__dirname, "src/server"),
  };

  const configClient: Configuration = {
    name: "client",
    ...webpackClient({
      port: env.port ?? 3443,
      pathClient,
      mode: env.mode ?? "production",
      analyzer: env.analyzer,
    }),
  };

  const configServer: Configuration = {
    name: "server",
    ...webpackServer({ port: env.port ?? 8443, pathServer, mode: env.mode ?? "production" }),
  };

  return [configClient, configServer];
};
