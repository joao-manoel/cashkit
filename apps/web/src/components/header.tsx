import { Button } from "./ui/button"
import Image from "next/image"
import LogoIcon from "@/assets/images/logo-icon.svg"
import Link from "next/link"
import { isAuthenticated } from "@/auth/auth"
import ProfileButton from "./profile-button"

export async function Header() {
  const isAuth = await isAuthenticated()
  
  return (
    <header className="border-grid sticky top-0 z-50 w-full border-b bg-white/30 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <div className="container-wrapper">
        <div className="container flex h-14 items-center">
          <div className="mr-4 hidden md:flex">
            <a href="/" className="mr-4 flex items-center gap-2 lg:mr-6">
              <Image src={LogoIcon} alt="Icone" className="size-5"/>
              <span className="hidden font-bold lg:inline-block">CashKit</span>
            </a>
          </div>
          <div className="flex flex-1 items-center justify-between gap-2 md:justify-end">
            {!isAuth ? (
              <Button size="sm" variant="ghost">
                <Link href="/sign-in">Entrar</Link>
              </Button>
            ) : (
              <ProfileButton />
            )}
          </div>
        </div>
      </div>
    </header>
  )
}