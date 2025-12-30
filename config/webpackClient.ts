import type { Configuration } from "webpack";
import { devServer } from "./devServer.js";
import { loaders } from "./loaders.js";
import { plugins } from "./plugins.js";
import type { IClient } from "./types.js";

export const webpackClient = (options: IClient): Configuration => {
  const { mode, pathClient } = options;
  const isDev = mode === "development";
  const isProd = mode === "production";

  return {
    name: "client",
    mode: mode ?? "production",
    entry: pathClient.entry,
    output: {
      filename: isDev ? "[name].js" : "[name].[contenthash].js",
      chunkFilename: isDev ? "[name].chunk.js" : "[name].[contenthash].chunk.js",
      path: pathClient.output,
      clean: true,
      publicPath: "/",
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
      mainFields: ["module", "main"],
      conditionNames: ["import", "module", "default"],
    },
    optimization: {
      minimize: isProd,
      splitChunks: {
        chunks: "all",
        minSize: 20000,
        cacheGroups: {
          reactCore: {
            test: /[\\/]node_modules[\\/](react|react-dom|react-router|react-router-dom|scheduler)[\\/]/,
            name: "vendor-react",
            priority: 30,
          },
          mui: {
            test: /[\\/]node_modules[\\/](@mui|@emotion)[\\/]/,
            name: "vendor-mui",
            priority: 20,
          },
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            name: "vendors",
            priority: 10,
          },
        },
      },
      runtimeChunk: "single",
      moduleIds: "deterministic",
    },
    devtool: isDev ? "eval-cheap-module-source-map" : false,
    devServer: isDev ? devServer(options) : undefined,
  };
};
