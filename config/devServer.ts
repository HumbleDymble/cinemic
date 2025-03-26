import type { Configuration } from "webpack-dev-server";
import { type IClient } from "./types";

export function devServer(options: IClient): Configuration {
  return {
    port: options.port ?? 5555,
    compress: true,
    historyApiFallback: true,
  };
}
