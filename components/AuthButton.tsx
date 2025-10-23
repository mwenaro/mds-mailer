'use client';

import { UserButton, useUser, SignInButton, SignOutButton } from '@clerk/nextjs';

export default function AuthButton() {
  const { isSignedIn, user } = useUser();

  if (isSignedIn) {
    return (
      <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
        <UserButton />
        <span>
          {user?.primaryEmailAddress?.emailAddress ?? user?.emailAddresses?.[0]?.emailAddress}
        </span>
        <SignOutButton />
      </div>
    );
  }

  return <SignInButton />;
}
