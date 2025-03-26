import { IPaths, IPathsClient } from "config/types";
import path from "path";
import { type Configuration } from "webpack";
import { type Mode, webpackClient, webpackServer } from "./config";

interface IEnv {
  mode: Mode;
  port: number;
  analyzer?: boolean;
}

export default (env: IEnv): Configuration[] => {
  const pathClient: IPathsClient = {
    output: path.resolve("build/client"),
    entry: path.resolve("src/client/app/entrypoint", "index.tsx"),
    src: path.resolve(__dirname, "src/client"),
  };

  const pathServer: IPaths = {
    output: path.resolve("build/server"),
    entry: path.resolve("src/server", "index.js"),
  };

  const configServer: Configuration = webpackServer({
    pathServer,
    mode: env.mode ?? "production",
  });

  const configClient: Configuration = webpackClient({
    port: env.port ?? 5555,
    pathClient,
    mode: env.mode ?? "production",
    analyzer: env.analyzer,
  });

  return [configServer, configClient];
};
