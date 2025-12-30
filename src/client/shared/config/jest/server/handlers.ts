import { http, HttpResponse } from "msw";
import { env } from "@/shared/config";

export const handlers = [
  http.delete(`${env.SERVER_URL}/auth/signout`, () => {
    return new HttpResponse(null, { status: 204 });
  }),

  http.get(`${env.SERVER_URL}/auth/session`, () => {
    return HttpResponse.json(null, { status: 401 });
  }),

  http.get(`${env.SERVER_URL}/notifications/unread`, () => {
    return HttpResponse.json([]);
  }),

  http.get(`${env.SERVER_URL}/notifications`, () => {
    return HttpResponse.json({ notifications: [] });
  }),
];
