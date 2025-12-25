import Link from 'next/link';
import { UserPlus, ArrowLeft } from 'lucide-react';

import { SignUpMethodsContainer } from '@kit/auth/sign-up';
import { Heading } from '@kit/ui/heading';
import { Trans } from '@kit/ui/trans';

import authConfig from '~/config/auth.config';
import pathsConfig from '~/config/paths.config';
import { createI18nServerInstance } from '~/lib/i18n/i18n.server';
import { withI18n } from '~/lib/i18n/with-i18n';

export const generateMetadata = async () => {
  const i18n = await createI18nServerInstance();

  return {
    title: `${i18n.t('auth:signUp')} | Blogify`,
    description: 'Create a Blogify account to start writing and sharing your stories with the world.',
  };
};

const paths = {
  callback: pathsConfig.auth.callback,
  appHome: pathsConfig.app.home,
};

function SignUpPage() {
  return (
    <div className="w-full max-w-md mx-auto space-y-6 py-6">
      {/* Back to home link */}
      <div className="flex justify-start">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors group"
        >
          <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
          Back to Blog
        </Link>
      </div>

      {/* Header */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 mb-2">
          <UserPlus className="w-6 h-6 text-primary" />
        </div>
        <Heading level={3} className="font-bold tracking-tight">
          <Trans i18nKey={'auth:signUpHeading'} />
        </Heading>
        <p className="text-sm text-muted-foreground">
          Join our community and start sharing your stories
        </p>
      </div>

      {/* Auth Methods */}
      <div className="space-y-4">
        <SignUpMethodsContainer
          providers={authConfig.providers}
          displayTermsCheckbox={authConfig.displayTermsCheckbox}
          paths={paths}
        />
      </div>

      {/* Sign in link */}
      <div className="text-center pt-3 border-t border-border/50">
        <p className="text-sm text-muted-foreground">
          Already have an account?{' '}
          <Link
            href={pathsConfig.auth.signIn}
            className="font-medium text-primary hover:underline"
          >
            Sign in
          </Link>
        </p>
      </div>

      {/* Help text */}
      <div className="text-center pb-4">
        <p className="text-xs text-muted-foreground">
          By creating an account, you agree to our{' '}
          <Link href="/terms-of-service" className="underline hover:text-foreground">
            Terms of Service
          </Link>{' '}
          and{' '}
          <Link href="/privacy-policy" className="underline hover:text-foreground">
            Privacy Policy
          </Link>
        </p>
      </div>
    </div>
  );
}

export default withI18n(SignUpPage);
