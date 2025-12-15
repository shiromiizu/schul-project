import Link from "next/link"
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { LucideIcon } from "lucide-react"

type LinkCardProps = {
  href: string
  icon: LucideIcon
  title: string
  description: string
}

const LinkCard = ({ href, icon: Icon, title, description }: LinkCardProps) => {
  return (
    <Link href={href}>
      <Card className="hover:shadow-lg">
        <CardHeader className="flex items-center space-x-4">
          <Icon className="w-6 h-6 text-primary" />
          <div>
            <CardTitle>{title}</CardTitle>
            <CardDescription>{description}</CardDescription>
          </div>
        </CardHeader>
      </Card>
    </Link>
  )
}

export default LinkCard