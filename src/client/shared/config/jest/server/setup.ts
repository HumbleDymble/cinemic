import "@testing-library/jest-dom";
import { afterAll, afterEach, beforeAll } from "@jest/globals";
import { setupServer } from "msw/node";
import { handlers } from "./handlers";
import { initI18n } from "@/shared/i18n";

export const server = setupServer(...handlers);

beforeAll(async () => {
  await initI18n({ lng: "en", initAsync: false });
  server.listen({ onUnhandledRequest: "error" });
});

afterEach(() => {
  server.resetHandlers();
});

afterAll(() => {
  server.close();
});
