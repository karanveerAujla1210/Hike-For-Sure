import type { Metadata } from "next";
import { ReactNode } from "react";

import { ClientProviders } from "@/components/layout/ClientProviders";

import "./globals.css";

export const metadata: Metadata = {
  title: "Hike For Sure",
  description: "Production-grade recruitment platform for candidates and recruiters."
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <ClientProviders>{children}</ClientProviders>
      </body>
    </html>
  );
}
