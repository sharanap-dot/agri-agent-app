import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "AgriLedger ERP",
  description: "Agricultural Commission ERP Dashboard",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-[#F8F7F4] text-gray-900">
        {children}
      </body>
    </html>
  );
}