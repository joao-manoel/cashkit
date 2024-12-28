import type { Metadata } from "next"
import "./globals.css"
import Providers from "./providers";
import { Header } from "@/components/header";

export const metadata: Metadata = {
  title: "CashKit"
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning={true}>
      <body cz-shortcut-listen="true" className="bg-zinc-300">
        <Providers>
          <Header />
          {children}
          </Providers>
      </body>
    </html>
  )
}
