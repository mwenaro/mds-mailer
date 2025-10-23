"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { SignInButton, SignUpButton, useUser } from '@clerk/nextjs';

export default function RegisterPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [smtp, setSmtp] = useState('');
  const [imap, setImap] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    if (!user || !user.id) {
      setLoading(false);
      alert('Please sign in to add a mailbox');
      return;
    }
    const res = await fetch('/api/mailboxes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, smtp, imap }),
    });
    setLoading(false);
    if (res.ok) {
      router.push('/dashboard');
    } else {
      alert('Failed to add mailbox');
    }
  }

  const { user } = useUser();

  return (
    <div className="mx-auto max-w-2xl px-6 py-12">
      <h1 className="text-2xl font-semibold">Add mailbox</h1>
      {!user && (
        <div className="mt-4">
          <p className="mb-2">You must be signed in to add a mailbox.</p>
          <SignInButton />
          <SignUpButton />
        </div>
      )}
      <form onSubmit={submit} className="mt-6 grid gap-4">
        <input required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" className="rounded border p-2" />
        <input required value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" type="password" className="rounded border p-2" />
        <input value={smtp} onChange={(e) => setSmtp(e.target.value)} placeholder="SMTP (e.g. smtp.example.com:587)" className="rounded border p-2" />
        <input value={imap} onChange={(e) => setImap(e.target.value)} placeholder="IMAP (e.g. imap.example.com:993)" className="rounded border p-2" />
        <div>
          <button className="rounded bg-foreground px-4 py-2 text-background" disabled={loading}>{loading ? 'Saving...' : 'Save mailbox'}</button>
        </div>
      </form>
    </div>
  );
}
