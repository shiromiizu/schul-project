"use client"

import { User } from "@supabase/supabase-js"
import { LogOut, User as UserIcon, KeyRound } from "lucide-react"
import { logout } from "@/app/actions"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { useState } from "react"
import { ChangePasswordDialog } from "@/components/auth/change-password-dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

interface UserMenuProps {
  user: User | null
}

export function UserMenu({ user }: UserMenuProps) {
  const [isChangePasswordOpen, setIsChangePasswordOpen] = useState(false)

  if (!user) {
    return (
      <Button asChild variant="ghost">
        <Link href="/login">Anmelden</Link>
      </Button>
    )
  }

  return (
    <>
      <ChangePasswordDialog open={isChangePasswordOpen} onOpenChange={setIsChangePasswordOpen} />
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Avatar className="cursor-pointer">
            <AvatarImage src="" />
            <AvatarFallback>
              <UserIcon className="h-5 w-5" />
            </AvatarFallback>
          </Avatar>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>{user.email}</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => setIsChangePasswordOpen(true)}>
            <KeyRound className="mr-2 h-4 w-4" />
            <span>Passwort ändern</span>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => logout()}>
            <LogOut className="mr-2 h-4 w-4" />
            <span>Abmelden</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  )
}
