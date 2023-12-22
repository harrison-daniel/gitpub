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
  // const session = await getServerSession(authOptions);
  const session = await auth();
  if (!session) {
    return NextResponse.json({ message: 'You are not logged in' });
  }
  // return NextResponse.json({ name: session.user.name });

  // if (session) {
  try {
    await dbConnect();
    if (!session) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
      });
    }

    const sortOption = request.nextUrl.searchParams.get('sort') || 'date';

    const direction = request.nextUrl.searchParams.get('direction') || 'desc'; // default to 'desc' if not provided
    let sortValue = direction === 'desc' ? -1 : 1;
    let sortCriteria = { [sortOption]: sortValue };

    const userId = session.user.id;

    const userEntries = await Entry.find({ userId }).sort(sortCriteria).exec();
    return NextResponse.json({ userEntries });

    // const entries = await Entry.find({ userId });
    // return new Response(JSON.stringify({ entries }), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Failed to fetch entries' }), {
      status: 500,
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
  const session = await auth();
  if (!session) {
    return NextResponse.json({ message: 'You are not logged in' });
  }
  if (session) {
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
  } else {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
}
