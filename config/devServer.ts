import { readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import type { Configuration } from "webpack-dev-server";
import type { IClient } from "./types.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const devServer = (options: IClient): Configuration => {
  return {
    port: options.port ?? 3443,
    hot: true,
    compress: true,
    historyApiFallback: true,
    server: {
      type: "https",
      options: {
        key: readFileSync(path.resolve(__dirname, "../certs/localhost-key.pem")),
        cert: readFileSync(path.resolve(__dirname, "../certs/localhost.pem")),
      },
    },
  };
};
