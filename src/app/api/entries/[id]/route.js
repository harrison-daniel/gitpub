import Entry from '../../../models/entry';
import dbConnect from '../../../db/dbConnect';
import { NextResponse } from 'next/server';
import { auth } from '../../../auth';

export async function PUT(request, { params }) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { id } = await params;
    await dbConnect();

    const existing = await Entry.findById(id).lean();
    if (!existing) {
      return NextResponse.json({ error: 'Entry not found' }, { status: 404 });
    }
    if (existing.userId !== session.user.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const {
      newTitle: title,
      newStreetAddress: streetAddress,
      newCityStateAddress: cityStateAddress,
      newDescription: description,
      newDate: date,
      newWebsiteUrl: websiteUrl,
      newPhoneNumber: phoneNumber,
    } = await request.json();

    await Entry.findByIdAndUpdate(id, {
      title,
      streetAddress,
      cityStateAddress,
      description,
      date,
      websiteUrl,
      phoneNumber,
    });
    return NextResponse.json({ message: 'Entry updated' }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to update entry' },
      { status: 500 },
    );
  }
}

export async function GET(request, { params }) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { id } = await params;
    await dbConnect();
    const entry = await Entry.findOne({ _id: id, userId: session.user.id }).lean();
    if (entry) {
      return NextResponse.json({ entry }, { status: 200 });
    } else {
      return NextResponse.json({ error: 'Entry not found' }, { status: 404 });
    }
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch entry' },
      { status: 500 },
    );
  }
}
