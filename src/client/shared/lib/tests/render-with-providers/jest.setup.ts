import { jest } from "@jest/globals";
import {
  getMockParams,
  getMockPathname,
  getMockSearchParams,
  mockRouter,
} from "./nextNavigationModuleMock";

(mockRouter.push as unknown) = jest.fn();
(mockRouter.replace as unknown) = jest.fn();
(mockRouter.refresh as unknown) = jest.fn();
(mockRouter.back as unknown) = jest.fn();
(mockRouter.forward as unknown) = jest.fn();
(mockRouter.prefetch as unknown) = jest.fn(async () => {});

jest.mock("next/navigation", () => ({
  __esModule: true,
  useRouter: () => mockRouter,
  usePathname: () => getMockPathname(),
  useParams: () => getMockParams(),
  useSearchParams: () => getMockSearchParams(),

  redirect: (url: string) => {
    throw new Error(`redirect(${url}) was called in a unit test`);
  },
  notFound: () => {
    throw new Error("notFound() was called in a unit test");
  },
}));
