import Entry from '../../../models/entry';
import dbConnect from '../../../db/dbConnect';
import { NextResponse } from 'next/server';
import { auth } from '../../../auth';
import { entrySchema } from '../../../lib/validations';

export async function PUT(request, { params }) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { id } = await params;
    await dbConnect();

    const body = await request.json();
    const result = entrySchema.safeParse({
      title: body.newTitle,
      streetAddress: body.newStreetAddress,
      cityStateAddress: body.newCityStateAddress,
      description: body.newDescription,
      date: body.newDate,
      websiteUrl: body.newWebsiteUrl,
      phoneNumber: body.newPhoneNumber,
    });

    if (!result.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: result.error.flatten().fieldErrors },
        { status: 400 },
      );
    }

    const updated = await Entry.findOneAndUpdate(
      { _id: id, userId: session.user.id },
      result.data,
      { new: true },
    );

    if (!updated) {
      return NextResponse.json(
        { error: 'Entry not found or forbidden' },
        { status: 404 },
      );
    }

    return NextResponse.json({ message: 'Entry updated' });
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
    const entry = await Entry.findOne({
      _id: id,
      userId: session.user.id,
    }).lean();

    if (!entry) {
      return NextResponse.json({ error: 'Entry not found' }, { status: 404 });
    }

    return NextResponse.json({ entry });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch entry' },
      { status: 500 },
    );
  }
}
