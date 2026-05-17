import type { Metadata, Viewport } from "next";
import { Roboto } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";
import { SerwistProvider } from "@serwist/turbopack/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { OfflineIndicator } from "./components/OfflineIndicator";

const APP_NAME = "Rations Calculator";
const APP_DESCRIPTION = "Offline-first PWA for calculating food rations";

const roboto = Roboto({
  weight: ["300", "400", "500", "700"],
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: APP_NAME,
  description: APP_DESCRIPTION,
  applicationName: APP_NAME,
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: APP_NAME,
  },
  formatDetection: {
    telephone: false,
  },
  icons: {
    apple: "/icons/apple-touch-icon.png",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#6750a4",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head />
      <body className={roboto.className}>
        <SerwistProvider swUrl="/serwist/sw.js">
          <Providers>{children}</Providers>
          <OfflineIndicator />
        </SerwistProvider>
        <SpeedInsights />
      </body>
    </html>
  );
}
