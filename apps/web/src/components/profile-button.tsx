import { auth } from "@/auth/auth"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from './ui/dropdown-menu'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import { Separator } from './ui/separator'
import { ChevronDown } from "lucide-react"
import ThemeSwitcher from "./theme-switcher"
import { getInitials } from "@/utils/format"
import Image from "next/image"

export default async function ProfileButton(){
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
            className="rounded-full"
          />
          )}
          <AvatarFallback>{getInitials(user?.name || '')}</AvatarFallback>
        </Avatar>
        
        <div className="flex flex-col items-start">
          <span className="text-sm font-medium">{user?.name}</span>
          <span className="text-xs text-muted-foreground">{user?.email}</span>
        </div>
        <ChevronDown className="size-4 text-muted-foreground" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[200px]">
        <DropdownMenuItem asChild>
          <a href="/api/auth/sign-out">Sair</a>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}