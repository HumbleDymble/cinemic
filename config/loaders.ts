import path from "node:path";
import { fileURLToPath } from "node:url";
import type { ModuleOptions } from "webpack";
import type { IOptions } from "./types.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const loaders = (options: IOptions): ModuleOptions["rules"] => {
  const isDev = options.mode === "development";

  return [
    {
      test: /\.[jt]sx?$/,
      exclude: /node_modules/,
      use: {
        loader: "swc-loader",
        options: {
          configFile: path.resolve(__dirname, "../.swcrc.web.json"),
          sourceMaps: isDev,
        },
      },
    },
  ];
};
