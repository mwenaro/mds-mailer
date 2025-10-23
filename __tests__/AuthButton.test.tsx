import React from 'react';
import { render, screen } from '@testing-library/react';
import AuthButton from '../components/AuthButton';

jest.mock('@clerk/nextjs', () => ({
  useUser: () => ({ isSignedIn: false, user: null }),
  UserButton: () => <button>Profile</button>,
  SignInButton: () => <button>Sign in</button>,
  SignOutButton: () => <button>Sign out</button>,
}));

describe('AuthButton', () => {
  it('shows sign in when not authenticated', () => {
    render(<AuthButton />);
    expect(screen.getByText(/sign in/i)).toBeInTheDocument();
  });
});
