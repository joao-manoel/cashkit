import type { Metadata } from "next"
import { Header } from "@/components/header";
import { isAuthenticated } from "@/auth/auth";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "CashKit"
};

export default async function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  if ((await isAuthenticated())) {
      redirect('/')
    }
  return (
    <div className="container-wrapper ">
      <div className="container flex items-center">
        {children}
      </div>            
    </div>
  )
}
