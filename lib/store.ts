// Very small in-memory store for demo purposes. Replace with a real DB in production.
type Mailbox = {
  id: string;
  email: string;
  password: string;
  smtp: string;
  imap: string;
};

const mailboxes: Mailbox[] = [];

export function addMailbox(m: Omit<Mailbox, 'id'>) {
  const id = String(Date.now()) + Math.random().toString(36).slice(2, 8);
  const box = { id, ...m };
  mailboxes.push(box);
  return box;
}

export function listMailboxes() {
  return mailboxes.slice();
}

export const store = { addMailbox, listMailboxes };
export default store;
