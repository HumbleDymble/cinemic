import JSDOMEnvironment from "jest-environment-jsdom";
import type { EnvironmentContext, JestEnvironmentConfig } from "@jest/environment";
import { TextDecoder, TextEncoder } from "util";

interface CustomTestEnvironmentOptions {
  customExportConditions?: string[];
}

export default class FixedJSDOMEnvironment extends JSDOMEnvironment {
  constructor(config: JestEnvironmentConfig, context: EnvironmentContext) {
    super(config, context);

    const customOptions = config.projectConfig
      .testEnvironmentOptions as CustomTestEnvironmentOptions;

    this.customExportConditions = customOptions?.customExportConditions ?? [""];

    Object.assign(this.global, {
      TextDecoder,
      TextEncoder,
      ReadableStream,
      WritableStream,
      TransformStream,
      Blob,
      BroadcastChannel,
      fetch,
      Headers,
      Request,
      Response,
      FormData,
      AbortController,
      AbortSignal,
      structuredClone: global.structuredClone,
      URL: global.URL,
      URLSearchParams: global.URLSearchParams,
    });
  }
}
