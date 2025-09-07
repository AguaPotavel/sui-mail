import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "@mysten/dapp-kit/dist/index.css";
import { Providers } from "./providers";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Bubble",
  description: "Social Network on SUI Blockchain",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
      </head>
      <body className={inter.className}>
        <Providers>
          <div className="px-4">{children}</div>
        </Providers>
      </body>
    </html>
  );
}
