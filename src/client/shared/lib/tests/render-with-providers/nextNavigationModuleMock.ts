import type { ReadonlyURLSearchParams } from "next/navigation";
import type { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";

type Params = Record<string, string | string[]>;

let _pathname = "/";
let _params: Params = {};
let _searchParams = new URLSearchParams() as unknown as ReadonlyURLSearchParams;

export const mockRouter: AppRouterInstance = {
  back: jest.fn(),
  forward: jest.fn(),
  push: jest.fn(),
  replace: jest.fn(),
  refresh: jest.fn(),
  prefetch: jest.fn(async () => {}),
} as unknown as AppRouterInstance;

export function setMockRoute(route: string) {
  const url = new URL(route, "http://localhost");
  _pathname = url.pathname;
  _searchParams = new URLSearchParams(url.search) as unknown as ReadonlyURLSearchParams;
}

export function setMockParams(params: Params) {
  _params = params;
}

export function setMockSearchParams(input: string | URLSearchParams) {
  const sp = typeof input === "string" ? new URLSearchParams(input) : input;
  _searchParams = sp as unknown as ReadonlyURLSearchParams;
}

export function getMockPathname() {
  return _pathname;
}

export function getMockParams() {
  return _params;
}

export function getMockSearchParams() {
  return _searchParams;
}

export function useRouter() {
  return mockRouter;
}
export function usePathname() {
  return _pathname;
}
export function useParams() {
  return _params;
}
export function useSearchParams() {
  return _searchParams;
}

export function redirect(url: string): never {
  throw new Error(`redirect(${url}) was called in a unit test`);
}
export function notFound(): never {
  throw new Error("notFound() was called in a unit test");
}
