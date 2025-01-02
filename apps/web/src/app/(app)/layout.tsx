import { redirect } from 'next/navigation'

import { isAuthenticated } from '@/auth/auth'
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
      <div className="flex h-full">
        <div className="w-[80px] md:w-[80px] lg:w-[240px] xl:w-[250px]">
          <NavBar />
        </div>
        <div className="w-full overflow-scroll">
          <div className="container-wrapper">
            <div className="container p-4">{children}</div>
          </div>
        </div>
      </div>
    </div>
  )
}
