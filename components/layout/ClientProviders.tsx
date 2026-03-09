"use client";

import { useEffect } from "react";
import type { ReactNode } from "react";

import { initAnalytics } from "@/lib/api/analytics";

export function ClientProviders({ children }: { children: ReactNode }) {
  useEffect(() => {
    initAnalytics();
  }, []);

  return <>{children}</>;
}
