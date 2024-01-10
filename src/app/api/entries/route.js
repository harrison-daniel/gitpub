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
    return new Response(JSON.stringify({ error: 'Unauthorized' }), {
      status: 401,
    });
  }
}
