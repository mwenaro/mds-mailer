// MongoDB-backed store for mailboxes.
import { ObjectId, InsertOneResult } from 'mongodb';
import { getDb } from './db';
import { encrypt } from './crypto';

export type Mailbox = {
  _id?: ObjectId;
  email: string;
  password: string;
  smtp: string;
  imap: string;
  createdAt?: Date;
  ownerId?: string | null;
};

export async function addMailbox(m: Omit<Mailbox, '_id' | 'createdAt'> & { ownerId?: string | null }) {
  const db = await getDb();
  const doc: Mailbox = { ...m, createdAt: new Date() };
  // encrypt the password at rest
  if (doc.password) {
    doc.password = encrypt(doc.password);
  }
  const res: InsertOneResult = await db.collection('mailboxes').insertOne(doc);
  return { id: res.insertedId.toHexString(), ...doc };
}

export async function listMailboxes(ownerId?: string | null) {
  const db = await getDb();
  const q = ownerId ? { ownerId } : {};
  const rows = await db.collection('mailboxes').find(q).toArray();
  return rows.map((r) => ({ id: r._id?.toHexString(), email: r.email, smtp: r.smtp, imap: r.imap, createdAt: r.createdAt, ownerId: r.ownerId }));
}

export const store = { addMailbox, listMailboxes };
export default store;
