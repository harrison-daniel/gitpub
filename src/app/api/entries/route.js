import connectMongoDB from 'libs/mongodb';
import Entry from '../../../../models/entry';
import { NextResponse } from 'next/server';

export async function POST(request) {
  const { title, description } = await request.json();

  await connectMongoDB();
  await Entry.create({ title, description });
  return NextResponse.json({ message: 'Entry created' }, { status: 201 });
}
