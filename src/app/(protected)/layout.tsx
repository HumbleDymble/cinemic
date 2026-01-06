"use client";

import type { ReactNode } from "react";
import { IsAuthenticated } from "@/client/pages/auth";

export default function Layout({ children }: { children: ReactNode }) {
  return <IsAuthenticated>{children}</IsAuthenticated>;
}
