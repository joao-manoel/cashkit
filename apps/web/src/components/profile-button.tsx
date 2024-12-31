import { LogOut } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

import { auth } from '@/auth/auth'
import { getInitials } from '@/utils/format'

import { Avatar, AvatarFallback } from './ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from './ui/dropdown-menu'
import { Separator } from './ui/separator'

export default async function ProfileButton() {
  const { user } = await auth()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="flex items-center gap-3 outline-none">
        <Avatar>
          {user?.avatar && (
            <Image
              src={user?.avatar}
              alt={user?.name}
              width={40}
              height={40}
              className="rounded-xs"
            />
          )}
          <AvatarFallback>{getInitials(user?.name || '')}</AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="mt-6 w-[354px] bg-muted">
        <DropdownMenuItem
          asChild
          className="flex cursor-pointer items-center justify-between p-4 transition-colors hover:bg-zinc-200 dark:hover:bg-black"
        >
          <Link href="/account">
            <div className="flex gap-2">
              <Avatar>
                {user?.avatar && (
                  <Image
                    src={user?.avatar}
                    alt={user?.name}
                    width={40}
                    height={40}
                    className="rounded-sm"
                  />
                )}
                <AvatarFallback>{getInitials(user?.name || '')}</AvatarFallback>
              </Avatar>
              <div className="flex flex-col justify-center">
                <span className="text-sm font-bold text-black dark:text-white">
                  {user?.name}
                </span>
                <span className="text-xs font-thin text-muted-foreground">
                  {user?.email}
                </span>
              </div>
            </div>
            <div className="rounded-sm p-2 hover:bg-muted">
              <span>Ver Perfil</span>
            </div>
          </Link>
        </DropdownMenuItem>
        <Separator />
        <DropdownMenuItem
          asChild
          className="cursor-pointer p-4 transition-colors hover:bg-zinc-200 hover:text-red-400 dark:hover:bg-black"
        >
          <a
            href="/api/auth/sign-out"
            className="text-red-400 hover:text-red-400"
          >
            <LogOut />
            <span className="font-bold">Sair da conta</span>
          </a>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
