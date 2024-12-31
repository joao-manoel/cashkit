import { redirect } from 'next/navigation'

import { isAuthenticated } from '@/auth/auth'
import Header from '@/components/header'
import NavBar from '@/components/navbar'

export default async function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  if (!(await isAuthenticated())) {
    redirect('/sign-in')
  }

  return (
    <div className="h-screen">
      <Header />
      <div className="flex h-full">
        <div className="w-[80px] md:w-[80px] lg:w-[240px] xl:w-[250px]">
          <NavBar />
        </div>
        <div className="w-full overflow-scroll">{children}</div>
      </div>
    </div>
  )
}
