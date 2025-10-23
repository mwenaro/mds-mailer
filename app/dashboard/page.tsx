"use client";

import { useEffect, useState } from 'react';

type Mailbox = { id: string; email: string; smtp: string; imap: string };

export default function DashboardPage() {
  const [boxes, setBoxes] = useState<Mailbox[]>([]);

  useEffect(() => {
    fetch('/api/mailboxes').then((r) => r.json()).then(setBoxes).catch(() => setBoxes([]));
  }, []);

  return (
    <div className="mx-auto max-w-4xl px-6 py-12">
      <h1 className="text-2xl font-semibold">Dashboard</h1>
      <p className="mt-2 text-sm text-zinc-600">Your connected mailboxes</p>

      <ul className="mt-6 grid gap-4">
        {boxes.map((b) => (
          <li key={b.id} className="rounded border p-4">
            <div className="font-medium">{b.email}</div>
            <div className="text-sm text-zinc-600">SMTP: {b.smtp || '—'}</div>
            <div className="text-sm text-zinc-600">IMAP: {b.imap || '—'}</div>
          </li>
        ))}
      </ul>
    </div>
  );
}
