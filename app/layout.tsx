import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AgriLedger ERP",
  description: "Agricultural Trading ERP",
  manifest: "/manifest.json",

  icons: {
    icon: "/icon-192.png",
    apple: "/icon-192.png",
  },

  appleWebApp: {
    capable: true,
    title: "AgriLedger ERP",
    statusBarStyle: "default",
  },
};

export const viewport: Viewport = {
  themeColor: "#1F5E3B",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}