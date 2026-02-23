import dbConnect from '../../db/dbConnect';
import Entry from '../../models/entry';
import { NextResponse } from 'next/server';
import { auth } from '../../auth';
import { entrySchema } from '../../lib/validations';
import mongoose from 'mongoose';

export async function POST(request) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    await dbConnect();

    const body = await request.json();
    const result = entrySchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: result.error.flatten().fieldErrors },
        { status: 400 },
      );
    }

    const newEntry = await Entry.create({
      ...result.data,
      userId: session.user.id,
    });

    return NextResponse.json(
      { message: 'Entry created', entry: newEntry },
      { status: 201 },
    );
  } catch (error) {
    console.error('POST /api/entries:', error);
    return NextResponse.json(
      { error: 'Failed to create entry' },
      { status: 500 },
    );
  }
}

export async function GET() {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    await dbConnect();
    const userEntries = await Entry.find({ userId: session.user.id })
      .sort({ date: -1, createdAt: -1 })
      .lean();
    return NextResponse.json({ userEntries });
  } catch (error) {
    console.error('GET /api/entries:', error);
    return NextResponse.json(
      { error: 'Error fetching entries' },
      { status: 500 },
    );
  }
}

export async function DELETE(request) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const id = request.nextUrl.searchParams.get('id');

    if (!id || !mongoose.isValidObjectId(id)) {
      return NextResponse.json({ error: 'Invalid entry ID' }, { status: 400 });
    }

    await dbConnect();

    const entry = await Entry.findOneAndDelete({
      _id: id,
      userId: session.user.id,
    });

    if (!entry) {
      return NextResponse.json(
        { error: 'Entry not found or forbidden' },
        { status: 404 },
      );
    }

    return NextResponse.json({ message: 'Entry deleted' });
  } catch (error) {
    console.error('DELETE /api/entries:', error);
    return NextResponse.json(
      { error: 'Failed to delete entry' },
      { status: 500 },
    );
  }
}
