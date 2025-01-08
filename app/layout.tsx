import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Red Brick Connections",
  description: "Group four groups of four!",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
       <head>
        <meta charSet="UTF-8" />
        {/* <link rel="icon" type="image/png" href="/favicon-32x32.png" sizes="32x32" /> */}
      </head>
      <body className={inter.className}>{children}</body>
    </html>
  );
}
