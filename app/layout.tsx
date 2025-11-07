import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "BluSlide.AI - The Idea Gallery",
  description: "An intelligent idea exploration platform for discovering and refining creative concepts",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
