"use client";

import { ThemeProvider } from "next-themes";
import { RationRepositoryProvider } from "@/src/application/contexts/RationRepositoryContext";
import { AlimentInfoRepositoryProvider } from "@/src/application/contexts/AlimentInfoRepositoryContext";
import { CustomAlimentRepositoryProvider } from "@/src/application/contexts/CustomAlimentRepositoryContext";
import { MenuRepositoryProvider } from "@/src/application/contexts/MenuRepositoryContext";
import { LocalStorageMenuRepository } from "@/src/infrastructure/repositories/LocalStorageMenuRepository";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <RationRepositoryProvider>
        <AlimentInfoRepositoryProvider>
          <CustomAlimentRepositoryProvider>
            <MenuRepositoryProvider repository={new LocalStorageMenuRepository()}>
              {children}
            </MenuRepositoryProvider>
          </CustomAlimentRepositoryProvider>
        </AlimentInfoRepositoryProvider>
      </RationRepositoryProvider>
    </ThemeProvider>
  );
}
