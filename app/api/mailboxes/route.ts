import { NextResponse } from 'next/server';
import { addMailbox, listMailboxes } from '../../../lib/store';
import getServerAuthSession from '../../../lib/auth';

export async function GET() {
  // server-side auth: only return mailboxes for the authenticated user
  const session = await getServerAuthSession();
  if (!session) return NextResponse.json({ error: 'unauthenticated' }, { status: 401 });
  const rows = await listMailboxes(session.userId);
  return NextResponse.json(rows);
}

export async function POST(req: Request) {
  const body = await req.json();
  const { email, password, smtp, imap } = body as Record<string, string>;
  if (!email || !password) {
    return NextResponse.json({ error: 'email and password required' }, { status: 400 });
  }
  const session = await getServerAuthSession();
  if (!session) return NextResponse.json({ error: 'unauthenticated' }, { status: 401 });
  const box = await addMailbox({ email, password, smtp: smtp || '', imap: imap || '', ownerId: session.userId });
  return NextResponse.json(box, { status: 201 });
}
