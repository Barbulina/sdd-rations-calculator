"use client";

import { ThemeProvider } from "next-themes";
import { RationRepositoryProvider } from "@/src/application/contexts/RationRepositoryContext";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <RationRepositoryProvider>{children}</RationRepositoryProvider>
    </ThemeProvider>
  );
}
