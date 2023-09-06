import Entry from '../../../models/entry';
import connectToDatabase from '../../../libs/mongodb';
import { NextResponse } from 'next/server';

export async function PUT(request, { params }) {
  const { id } = params;
  const {
    newTitle: title,
    newAddress: address,
    newDescription: description,
  } = await request.json();
  await connectToDatabase();
  await Entry.findByIdAndUpdate(id, { title, address, description });
  return NextResponse.json({ message: 'Entry updated' }, { status: 200 });
}

export async function GET(request, { params }) {
  const { id } = params;
  await connectToDatabase();
  const entry = await Entry.findOne({ _id: id });
  return NextResponse.json({ entry }, { status: 200 });
}
