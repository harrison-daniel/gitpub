import Entry from '../../../../models/entry';
import dbConnect from '../../../../db/dbConnect';
import { NextResponse } from 'next/server';
import { auth } from '../../../../auth';
import mongoose from 'mongoose';

export async function POST(request, { params }) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { id } = await params;

    if (!mongoose.isValidObjectId(id)) {
      return NextResponse.json({ error: 'Invalid entry ID' }, { status: 400 });
    }

    const { name, rating } = await request.json();

    if (!name?.trim() || !Number.isInteger(rating) || rating < 1 || rating > 5) {
      return NextResponse.json(
        { error: 'Name and rating (1-5) required' },
        { status: 400 },
      );
    }

    await dbConnect();

    const entry = await Entry.findOneAndUpdate(
      { _id: id, userId: session.user.id },
      { $push: { beers: { name: name.trim(), rating } } },
      { new: true },
    );

    if (!entry) {
      return NextResponse.json({ error: 'Entry not found' }, { status: 404 });
    }

    return NextResponse.json({ entry }, { status: 201 });
  } catch (error) {
    console.error('POST /api/entries/[id]/beers:', error);
    return NextResponse.json({ error: 'Failed to add beer' }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { id } = await params;
    const beerId = request.nextUrl.searchParams.get('beerId');

    if (!mongoose.isValidObjectId(id) || !mongoose.isValidObjectId(beerId)) {
      return NextResponse.json({ error: 'Invalid ID' }, { status: 400 });
    }

    await dbConnect();

    const entry = await Entry.findOneAndUpdate(
      { _id: id, userId: session.user.id },
      { $pull: { beers: { _id: beerId } } },
      { new: true },
    );

    if (!entry) {
      return NextResponse.json({ error: 'Entry not found' }, { status: 404 });
    }

    return NextResponse.json({ entry });
  } catch (error) {
    console.error('DELETE /api/entries/[id]/beers:', error);
    return NextResponse.json({ error: 'Failed to remove beer' }, { status: 500 });
  }
}
