import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "F1 Interview — Prepare before they ask.",
  description:
    "A thoughtful, realistic way to practice for your F-1 student visa interview.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="bg-paper font-sans text-ink">{children}</body>
    </html>
  );
}
