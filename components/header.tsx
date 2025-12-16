import { createClient } from "@/utils/supabase/server"
import { UserMenu } from "./user-menu"
import { ModeToggle } from "./mode-toggle"
import Link from "next/link"
import Image from 'next/image';

export async function Header() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  let role = null
  if (user) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single()
    role = profile?.role
  }

  return (
    <header className="w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 shadow-sm">
      <div className="w-full flex h-14 items-center justify-between px-4">
        <div className="mr-4 flex">
          <Link href="/" className="flex hover:opacity-80 transition-opacity">
            <Image src={'/b3echo-grafitti.svg'} alt={'B3Echo'} width={140} height={0} />
          </Link>
        </div>
        <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
          <div className="w-full flex-1 md:w-auto md:flex-none">
          </div>
          <ModeToggle />
          <UserMenu user={user} role={role} />
        </div>
      </div>
    </header>
  );
}
