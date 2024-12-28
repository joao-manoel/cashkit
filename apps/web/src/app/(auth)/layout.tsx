import type { Metadata } from "next"
import { Header } from "@/components/header";

export const metadata: Metadata = {
  title: "CashKit"
};

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="container-wrapper ">
      <div className="container flex items-center">
        {children}
      </div>            
    </div>
  )
}
