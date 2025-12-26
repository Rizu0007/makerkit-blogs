'use client';

import { useEffect } from 'react';

import { usePathname } from 'next/navigation';

import type { AuthChangeEvent, Session } from '@supabase/supabase-js';

import { useSupabase } from './use-supabase';

/**
 * @name PRIVATE_PATH_PREFIXES
 * @description A list of private path prefixes
 */
const PRIVATE_PATH_PREFIXES = ['/home', '/update-password'];

/**
 * @name AUTH_PATHS
 * @description A list of auth paths
 */
const AUTH_PATHS = ['/auth'];

/**
 * @name useAuthChangeListener
 * @param privatePathPrefixes - A list of private path prefixes
 * @param appHomePath - The path to redirect to when the user is signed out
 * @param onEvent - Callback function to be called when an auth event occurs
 */
export function useAuthChangeListener({
  privatePathPrefixes = PRIVATE_PATH_PREFIXES,
  appHomePath,
  onEvent,
}: {
  appHomePath: string;
  privatePathPrefixes?: string[];
  onEvent?: (event: AuthChangeEvent, user: Session | null) => void;
}) {
  const client = useSupabase();

  useEffect(() => {
    // keep this running for the whole session unless the component was unmounted
    const listener = client.auth.onAuthStateChange((event, user) => {
      // ALWAYS use window.location.pathname - don't trust usePathname() during hydration
      if (typeof window === 'undefined') {
        return; // Skip on server-side
      }

      const currentPath = window.location.pathname;

      if (onEvent) {
        onEvent(event, user);
      }

      // Don't redirect if we're already on an auth page
      const isOnAuthPage = AUTH_PATHS.some((path) => currentPath.startsWith(path));

      if (isOnAuthPage) {
        // Only handle SIGNED_IN event on auth pages
        if (event === 'SIGNED_IN' && user) {
          // Check if there's a 'next' parameter in the URL
          const urlParams = new URLSearchParams(window.location.search);
          const nextPath = urlParams.get('next');

          if (nextPath) {
            window.location.assign(nextPath);
            return;
          }

          // No next parameter, redirect to app home
          window.location.assign(appHomePath);
        }
        return;
      }

      // log user out if user is falsy and if the current path is a private route
      const shouldRedirectUser =
        !user && isPrivateRoute(currentPath, privatePathPrefixes);

      if (shouldRedirectUser) {
        // send user away when signed out
        window.location.assign('/');
        return;
      }

      // revalidate user session when user signs in or out
      if (event === 'SIGNED_OUT') {
        window.location.reload();
      }
    });

    // destroy listener on un-mounts
    return () => listener.data.subscription.unsubscribe();
  }, [client.auth, appHomePath, privatePathPrefixes, onEvent]);
}

/**
 * Determines if a given path is a private route.
 */
function isPrivateRoute(path: string, privatePathPrefixes: string[]) {
  return privatePathPrefixes.some((prefix) => path.startsWith(prefix));
}
