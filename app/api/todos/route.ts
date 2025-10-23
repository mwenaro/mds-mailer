/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server";
import connectMongoose from "../../../lib/mongoose";
import TodoModel from "../../../models/todoModel";

export async function GET() {
  try {
    await connectMongoose();
    const todos = await TodoModel.find().sort({ createdAt: -1 }).lean().exec();

    const normalized = todos.map((doc: any) => ({
      _id: doc._id ? String(doc._id) : undefined,
      title: doc.title ?? "",
      completed: !!doc.completed,
      createdAt: doc.createdAt ?? null,
    }));

    return NextResponse.json(normalized);
  } catch (err: any) {
    return NextResponse.json({ error: err.message || String(err) }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    await connectMongoose();
    const todo = await TodoModel.create({
      title: body.title,
      completed: !!body.completed,
    });

    return NextResponse.json({ insertedId: String(todo._id) });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || String(err) }, { status: 500 });
  }
}
