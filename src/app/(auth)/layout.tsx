"use client";

import type { ReactNode } from "react";
import { IsGuest } from "@/client/pages/auth";

export default function Layout({ children }: { children: ReactNode }) {
  return <IsGuest>{children}</IsGuest>;
}
