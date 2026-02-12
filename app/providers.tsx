"use client";

import { ThemeProvider } from "next-themes";
import { RationRepositoryProvider } from "@/src/application/contexts/RationRepositoryContext";
import { AlimentInfoRepositoryProvider } from "@/src/application/contexts/AlimentInfoRepositoryContext";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <RationRepositoryProvider>
        <AlimentInfoRepositoryProvider>
          {children}
        </AlimentInfoRepositoryProvider>
      </RationRepositoryProvider>
    </ThemeProvider>
  );
}
