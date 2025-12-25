import { ExclamationTriangleIcon } from '@radix-ui/react-icons';
import { AlertCircle } from 'lucide-react';

import { Alert, AlertDescription, AlertTitle } from '@kit/ui/alert';
import { Trans } from '@kit/ui/trans';

/**
 * @name AuthErrorAlert
 * @param error This error comes from Supabase as the code returned on errors
 * This error is mapped from the translation auth:errors.{error}
 * To update the error messages, please update the translation file
 * https://github.com/supabase/gotrue-js/blob/master/src/lib/errors.ts
 * @constructor
 */
export function AuthErrorAlert({
  error,
}: {
  error: Error | null | undefined | string;
}) {
  if (!error) {
    return null;
  }

  const DefaultError = <Trans i18nKey="auth:errors.default" />;
  const errorCode = error instanceof Error ? error.message : error;

  // Map common error codes to user-friendly messages with helpful guidance
  const getErrorGuidance = (code: string) => {
    const guidanceMap: Record<string, string> = {
      'Invalid login credentials': 'Please check your email and password and try again.',
      'Email not confirmed': 'Please check your email inbox and click the verification link we sent you.',
      'User already registered': 'An account with this email already exists. Try signing in instead.',
      'Password should be at least 6 characters': 'Please use a stronger password with at least 6 characters.',
      'Unable to validate email address: invalid format': 'Please enter a valid email address.',
      'Signup requires a valid password': 'Please enter a password to create your account.',
      'Email rate limit exceeded': 'Too many attempts. Please wait a few minutes before trying again.',
      'default': 'If this problem persists, please contact support.',
    };

    return guidanceMap[code] || guidanceMap.default;
  };

  return (
    <Alert variant={'destructive'} className="border-destructive/50 bg-destructive/5">
      <AlertCircle className="w-4 h-4" />

      <AlertTitle className="font-semibold">
        <Trans i18nKey={`auth:errorAlertHeading`} />
      </AlertTitle>

      <AlertDescription data-test={'auth-error-message'} className="space-y-2">
        <div className="font-medium">
          <Trans
            i18nKey={`auth:errors.${errorCode}`}
            defaults={'<DefaultError />'}
            components={{ DefaultError }}
          />
        </div>
        <div className="text-sm opacity-90">
          {getErrorGuidance(errorCode)}
        </div>
      </AlertDescription>
    </Alert>
  );
}
