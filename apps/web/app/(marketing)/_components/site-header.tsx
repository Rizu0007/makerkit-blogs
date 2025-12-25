import type { JwtPayload } from '@supabase/supabase-js';
import Link from 'next/link';
import { Button } from '@kit/ui/button';
import { PenSquare, Sun, Moon } from 'lucide-react';
import { AppLogo } from '~/components/app-logo';
import { SiteHeaderAccountSection } from './site-header-account-section';

export function SiteHeader(props: { user?: JwtPayload | null }) {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <div className="flex items-center">
            <AppLogo />
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center gap-4">
            {props.user ? (
              <>
                <Link href="/home/posts/new">
                  <Button size="sm" className="gap-2">
                    <PenSquare className="w-4 h-4" />
                    <span className="hidden sm:inline">Write</span>
                  </Button>
                </Link>
                <SiteHeaderAccountSection user={props.user} />
              </>
            ) : (
              <>
                <Link href="/auth/sign-in">
                  <Button variant="ghost" size="sm">
                    Sign In
                  </Button>
                </Link>
                <Link href="/auth/sign-up">
                  <Button size="sm">
                    Get Started
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
