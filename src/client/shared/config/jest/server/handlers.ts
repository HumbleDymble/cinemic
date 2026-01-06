import { http, HttpResponse } from "msw";

export const handlers = [
  http.delete("*/auth/signout", () => {
    return new HttpResponse(null, { status: 204 });
  }),

  http.get("*/auth/session", () => {
    return HttpResponse.json(null, { status: 401 });
  }),

  http.get("*/notifications/unread", () => {
    return HttpResponse.json([]);
  }),

  http.get("*/notifications", () => {
    return HttpResponse.json({ notifications: [] });
  }),
];
