import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AgriLedger ERP",
  description: "Agricultural Trading ERP",
  manifest: "/manifest.json",
  icons: {
    icon: "/logo.png",
    apple: "/icon-192.png",
  },
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