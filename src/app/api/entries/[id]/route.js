import Entry from '../../../models/entry';
import dbConnect from '../../../db/mongodb';
import { NextResponse } from 'next/server';

export async function PUT(request, { params }) {
  try {
    const { id } = params;
    const {
      newTitle: title,
      newAddress: address,
      newDescription: description,
      newDate: date,
    } = await request.json();
    // Input validation can be added here
    await dbConnect();
    await Entry.findByIdAndUpdate(id, { title, address, description, date });
    return NextResponse.json({ message: 'Entry updated' }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to update entry' },
      { status: 500 },
    );
  }
}

export async function GET(request, { params }) {
  try {
    const { id } = params;
    await dbConnect();
    const entry = await Entry.findOne({ _id: id }).lean();
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
