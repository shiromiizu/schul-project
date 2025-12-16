'use client';

import {User} from '@supabase/supabase-js';
import {KeyRound, LogOut, User as UserIcon} from 'lucide-react';
import {logout} from '@/app/actions';
import {Button} from '@/components/ui/button';
import {getRoleLabel} from '@/lib/types';
import Link from 'next/link';
import {useState} from 'react';
import {ChangePasswordDialog} from '@/components/auth/change-password-dialog';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {Avatar, AvatarFallback, AvatarImage} from '@/components/ui/avatar';

interface UserMenuProps {
  user: User | null;
  role?: string | null;
}

export function UserMenu({ user, role }: UserMenuProps) {
  const [isChangePasswordOpen, setIsChangePasswordOpen] = useState(false);

  if (!user) {
    return (
      <Button asChild variant="ghost">
        <Link href="/login">Anmelden</Link>
      </Button>
    );
  }

  const roleLabel = getRoleLabel(role);

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
          <DropdownMenuLabel>
            <div className="flex flex-col space-y-1">
              <p className="text-sm font-medium leading-none">{user.email}</p>
              {roleLabel && (
                <p className="text-xs leading-none text-muted-foreground">{roleLabel}</p>
              )}
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          {role === 'teacher' && (
            <>
              <DropdownMenuItem asChild>
                <Link href="/teacher/feedbacks" className="cursor-pointer w-full">
                  Feedback Übersicht
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
            </>
          )}
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
  );
}
