import type { Configuration } from "webpack";
import type { IServer } from "./types";
import nodeExternals from "webpack-node-externals";

export function webpackServer(options: IServer): Configuration {
  const { mode, pathServer } = options;

  return {
    name: "server",
    mode: mode ?? "production",
    entry: pathServer.entry,
    externalsPresets: { node: true },
    externals: [nodeExternals()],
    output: {
      path: pathServer.output,
      filename: "[name].[contenthash].js",
      publicPath: "/",
      clean: true,
    },
    module: {
      rules: [
        {
          exclude: /node_modules/,
        },
      ],
    },
  };
}
