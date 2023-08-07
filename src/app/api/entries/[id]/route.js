import Entry from '../../../../../models/entry';
import connectMongoDB from '../../../../../libs/mongodb';
import { NextResponse } from 'next/server';

export async function PUT(request, { params }) {
  const { id } = params;
  const { newTitle: title, newDescription: description } = await request.json();
  await connectMongoDB();
  await Entry.findByIdAndUpdate(id, { title, description });
  return NextResponse.json({ message: 'Entry updated' }, { status: 200 });
}

export async function GET(request, { params }) {
  const { id } = params;
  await connectMongoDB();
  const entry = await Entry.findOne({ _id: id });
  return NextResponse.json({ entry }, { status: 200 });
}
