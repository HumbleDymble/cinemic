import HtmlWebpackPlugin from "html-webpack-plugin";
import MiniCssExtractPlugin from "mini-css-extract-plugin";
import path from "path";
import webpack, { type Configuration } from "webpack";
import { BundleAnalyzerPlugin } from "webpack-bundle-analyzer";
import { type IOptions } from "./types";
import Dotenv from "dotenv-webpack";

export function plugins({
  mode,
  analyzer,
}: IOptions): Configuration["plugins"] {
  const isDev = mode === "development";
  const isProd = mode === "production";

  const plugins: webpack.WebpackPluginInstance[] = [
    new HtmlWebpackPlugin({
      template: path.resolve("public", "index.html"),
      favicon: path.resolve("public", "favicon.ico"),
    }),
  ];

  if (isDev) {
    plugins.push(
      new webpack.ProgressPlugin({
        // Dev-specific options
        percentBy: "entries",
        profile: true,
      }),
      new Dotenv()
    );
  }

  if (isProd) {
    plugins.push(
      new webpack.ProgressPlugin({
        // Production-specific options
        percentBy: "modules",
        profile: false,
      }),
      new MiniCssExtractPlugin({
        filename: "css/[name].[contenthash:8].css",
        chunkFilename: "css/[name].[contenthash:8].css",
      }),
    );
  }

  if (analyzer) {
    plugins.push(new BundleAnalyzerPlugin());
  }

  return plugins;
}
