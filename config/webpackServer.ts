import path from "node:path";
import { fileURLToPath } from "node:url";
import type { Configuration } from "webpack";
import nodeExternals from "webpack-node-externals";
import { IServer } from "./types.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const webpackServer = (options: IServer): Configuration => {
  const { mode, pathServer } = options;

  const isProd = mode === "production";

  return {
    name: "server",
    mode: mode ?? "production",
    entry: pathServer.entry,
    target: "node",
    externalsPresets: { node: true },
    externals: [nodeExternals()],
    output: {
      path: pathServer.output,
      filename: "[name].[contenthash].js",
      publicPath: "/",
      clean: true,
      asyncChunks: true,
    },
    module: {
      rules: [
        {
          test: /\.[jt]sx?$/,
          exclude: /node_modules/,
          use: {
            loader: "swc-loader",
            options: {
              configFile: path.resolve(__dirname, "../.swcrc.node.json"),
              sourceMaps: !isProd,
            },
          },
        },
      ],
    },
    resolve: {
      extensions: [".js", ".ts", ".json"],
      extensionAlias: {
        ".js": [".ts", ".js"],
      },
      alias: { "~": pathServer.src },
    },
    optimization: {
      minimize: isProd,
      splitChunks: {
        chunks: "all",
        minSize: 20000,
      },
      runtimeChunk: "single",
      moduleIds: "deterministic",
    },
    watchOptions: {
      ignored: /node_modules/,
    },
  };
};
