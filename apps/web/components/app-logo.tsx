import Link from 'next/link';
import { BookOpen } from 'lucide-react';
import { cn } from '@kit/ui/utils';

function LogoImage({
  className,
}: {
  className?: string;
}) {
  return (
    <div className={cn('flex items-center gap-2.5', className)}>
      <div className="w-9 h-9 rounded-lg bg-primary flex items-center justify-center">
        <BookOpen className="w-5 h-5 text-primary-foreground" strokeWidth={2.5} />
      </div>
      <span className="text-xl font-bold tracking-tight text-foreground">
        Blogify
      </span>
    </div>
  );
}

export function AppLogo({
  href,
  label,
  className,
}: {
  href?: string | null;
  className?: string;
  label?: string;
}) {
  if (href === null) {
    return <LogoImage className={className} />;
  }

  return (
    <Link aria-label={label ?? 'Home Page'} href={href ?? '/'}>
      <LogoImage className={className} />
    </Link>
  );
}
