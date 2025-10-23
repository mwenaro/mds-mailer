import { NextResponse } from 'next/server';
import { addMailbox, listMailboxes } from '../../../lib/store';

export async function GET() {
  return NextResponse.json(listMailboxes());
}

export async function POST(req: Request) {
  const body = await req.json();
  const { email, password, smtp, imap } = body;
  if (!email || !password) {
    return NextResponse.json({ error: 'email and password required' }, { status: 400 });
  }
  const box = addMailbox({ email, password, smtp: smtp || '', imap: imap || '' });
  return NextResponse.json(box, { status: 201 });
}
