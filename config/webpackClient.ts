import { type Configuration } from "webpack";
import { devServer } from "./devServer";
import { loaders } from "./loaders";
import { plugins } from "./plugins";
import { type IClient } from "./types";

export function webpackClient(options: IClient): Configuration {
  const { mode, pathClient } = options;

  const isDev = mode === "development";

  return {
    name: "client",
    mode: mode ?? "production",
    entry: pathClient.entry,
    output: {
      filename: "[name].[contenthash].js",
      path: pathClient.output,
      clean: true,
      publicPath: "/",
      asyncChunks: true,
    },
    plugins: plugins(options),
    module: {
      rules: loaders(options),
    },
    resolve: {
      extensions: [".tsx", ".ts", ".js", ".jsx"],
      alias: {
        "@": pathClient.src,
      },
    },
    devtool: isDev ? "eval-source-map" : "source-map",
    devServer: isDev ? devServer(options) : undefined,
  };
}
