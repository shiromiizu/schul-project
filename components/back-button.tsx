import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { cn } from '@/lib/utils';

interface BackButtonProps {
  href?: string;
  label?: string;
  className?: string;
}

export function BackButton({ href = '/', label = 'Zurück', className }: BackButtonProps) {
  return (
    <Button variant="ghost" asChild className={cn('p-0 hover:bg-transparent', className)}>
      <Link
        href={href}
        className="text-md font-medium text-primary hover:underline flex items-center gap-1 group"
      >
        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
        {label}
      </Link>
    </Button>
  );
}
