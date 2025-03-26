import MiniCssExtractPlugin from "mini-css-extract-plugin";
import { type ModuleOptions } from "webpack";
import { type IOptions } from "./types";

export function loaders(options: IOptions): ModuleOptions["rules"] {
  const isDev = options.mode === "development";

  // const assetLoader = {
  //     test: /\.(png|jpg|jpeg|gif)$/i,
  //     type: 'asset/resource',
  // }

  // const svgrLoader = {
  //     test: /\.svg$/i,
  //     use: [
  //         {
  //             Loader: '@svgr/webpack',
  //             options: {
  //                 icon: true,
  //                 svgoConfig: {
  //                     plugins: [
  //                         {
  //                             name: 'convertColors',
  //                             params: {
  //                                 currentColor: true,
  //                             }
  //                         }
  //                     ]
  //                 }
  //             }
  //         }
  //     ],
  // }

  const scssLoader = {
    test: /\.(css|scss|sass)$/,
    use: [
      // Creates `style` nodes from JS strings
      isDev ? "style-loader" : MiniCssExtractPlugin.loader,
      // Translates CSS into CommonJS
      {
        loader: "css-loader",
        options: {
          modules: {
            auto: true,
            localIdentName: isDev
              ? "[name]__[local]--[hash:base64:5]"
              : "[hash:base64:8]",
            exportLocalsConvention: "camelCase",
          },
        },
      },
      // Compiles Sass to CSS
      "sass-loader",
    ],
  };

  const tsLoader = {
    test: /\.tsx?$/,
    use: "ts-Loader",
    exclude: /node_modules/,
  };

  const babelLoader = {
    test: /\.(js|jsx)$/,
    exclude: /node_modules/,
    use: {
      loader: "babel-Loader",
      options: {
        presets: [
          "@babel/preset-env",
          "@babel/preset-typescript",
          [
            "@babel/preset-react",
            {
              runtime: isDev ? "classic" : "automatic",
            },
          ],
        ],
      },
    },
  };

  return [scssLoader, tsLoader, babelLoader];
}
