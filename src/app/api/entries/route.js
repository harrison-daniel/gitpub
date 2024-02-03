import dbConnect from '../../db/dbConnect';
import Entry from '../../models/entry';
import { NextResponse } from 'next/server';
import { auth } from '../../auth';

export async function POST(request) {
  const session = await auth();
  if (session) {
    try {
      await dbConnect();

      const {
        title,
        streetAddress,
        cityStateAddress,
        description,
        date,
        websiteUrl,
        phoneNumber,
      } = await request.json();

      const newEntry = await Entry.create({
        title,
        streetAddress,
        cityStateAddress,
        description,
        date,
        websiteUrl,
        phoneNumber,
        userId: session.user.id,
      });

      return new Response(
        JSON.stringify({ message: 'Entry created', entry: newEntry }),
        {
          status: 201,
          headers: {
            'Content-Type': 'application/json',
          },
        },
      );
    } catch (error) {
      console.error(error);
      return new Response(
        JSON.stringify({
          error: 'Failed to create entry',
          details: error.message,
        }),
        {
          status: 500,
          headers: {
            'Content-Type': 'application/json',
          },
        },
      );
    }
  } else {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), {
      status: 401,
    });
  }
}

export async function GET(request) {
  const session = await auth();
  if (session) {
    try {
      await dbConnect();
      const userEntries = await Entry.find({ userId: session.user.id });
      return new Response(JSON.stringify({ userEntries }));
    } catch (error) {
      return new Response(
        JSON.stringify({ message: 'Error fetching entries' }),
        { status: 500 },
      );
    }
  } else {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), {
      status: 401,
    });
  }
}

export async function DELETE(request) {
  try {
    const id = request.nextUrl.searchParams.get('id');
    await dbConnect();
    await Entry.findByIdAndDelete(id);
    return NextResponse.json({ message: 'Entry deleted' }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to delete entry' },
      { status: 500 },
    );
  }
}
