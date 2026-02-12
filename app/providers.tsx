"use client";

import { ThemeProvider } from "next-themes";
import { RationRepositoryProvider } from "@/src/application/contexts/RationRepositoryContext";
import { AlimentInfoRepositoryProvider } from "@/src/application/contexts/AlimentInfoRepositoryContext";
import { CustomAlimentRepositoryProvider } from "@/src/application/contexts/CustomAlimentRepositoryContext";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <RationRepositoryProvider>
        <AlimentInfoRepositoryProvider>
          <CustomAlimentRepositoryProvider>
            {children}
          </CustomAlimentRepositoryProvider>
        </AlimentInfoRepositoryProvider>
      </RationRepositoryProvider>
    </ThemeProvider>
  );
}
