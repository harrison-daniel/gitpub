import dbConnect from '../../db/dbConnect';
import Entry from '../../models/entry';
// import User from '../../models/user';
import { NextResponse } from 'next/server';
// import { getServerSession } from 'next-auth/next';
// import { authOptions } from '../auth/[...nextauth]/options';
import { auth } from '../../auth';

export async function POST(request) {
  // const session = await getServerSession(authOptions);
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
        // userId,
      } = await request.json();

      const newEntry = await Entry.create({
        title,
        streetAddress,
        cityStateAddress,
        description,
        date,
        websiteUrl,
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
  try {
    await dbConnect();

    const sortOption = request.nextUrl.searchParams.get('sort') || 'date';
    const direction = request.nextUrl.searchParams.get('direction') || 'desc';
    let sortValue = direction === 'desc' ? -1 : 1;
    let sortCriteria = { [sortOption]: sortValue };

    const userId = request.headers.get('X-User-ID'); // Extract userId from 'X-User-ID' header
    if (!userId) {
      return new Response(JSON.stringify({ error: 'User ID not provided' }), {
        status: 401,
      });
    }

    const userEntries = await Entry.find({ userId }).sort(sortCriteria).exec();
    return new Response(JSON.stringify({ userEntries }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Failed to fetch entries' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}

// export async function GET(request) {
//   try {
//     await dbConnect();
//     const sortOption = request.nextUrl.searchParams.get('sort') || 'date';
//     // const sortOption = request.nextUrl.searchParams.get('sort');
//     const direction = request.nextUrl.searchParams.get('direction') || 'desc'; // default to 'desc' if not provided
//     let sortValue = direction === 'desc' ? -1 : 1;
//     let sortCriteria = { [sortOption]: sortValue };

//     const entries = await Entry.find({}).sort(sortCriteria).exec();
//     return NextResponse.json({ entries });
//   } catch (error) {
//     return NextResponse.json(
//       { error: 'Failed to fetch entries' },
//       { status: 500 },
//     );
//   }
// }

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
