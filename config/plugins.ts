import path from "node:path";
import { fileURLToPath } from "node:url";
import type { Configuration } from "webpack";
import webpack from "webpack";
import Dotenv from "dotenv-webpack";
import HtmlWebpackPlugin from "html-webpack-plugin";
import { BundleAnalyzerPlugin } from "webpack-bundle-analyzer";
import CopyPlugin from "copy-webpack-plugin";
import type { IOptions } from "./types.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const plugins = ({ mode, analyzer }: IOptions): Configuration["plugins"] => {
  const isDev = mode === "development";
  const isProd = mode === "production";

  const plugins: webpack.WebpackPluginInstance[] = [
    new HtmlWebpackPlugin({
      template: path.resolve("public", "index.html"),
      favicon: path.resolve("public", "favicon.ico"),
    }),
    new CopyPlugin({
      patterns: [
        {
          from: path.resolve("src", "client", "shared", "i18n", "locales"),
          to: "locales",
        },
      ],
    }),
  ];

  if (isDev) {
    plugins.push(
      new webpack.ProgressPlugin({
        percentBy: "modules",
        profile: true,
      }),
      new Dotenv({
        path: path.resolve(__dirname, "../.env.production"),
      }),
    );
  }

  if (isProd) {
    plugins.push(
      new webpack.ProgressPlugin({
        percentBy: "modules",
        profile: true,
      }),
    );
  }

  if (analyzer) {
    plugins.push(new BundleAnalyzerPlugin());
  }

  return plugins;
};
