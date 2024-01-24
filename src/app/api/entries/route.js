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

export async function GET(request) {
  const session = await auth();
  if (session) {
    try {
      // console.log('session in APIIIII', session);
      await dbConnect();
      const userEntries = await Entry.find({ userId: session.user.id });
      return new Response(JSON.stringify({ userEntries }));
    } catch (error) {
      // Handle the error, log it, or send a specific message

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

// export const GET = auth(async (req) => {
//   if (req.auth) {
//     try {
//       await dbConnect();
//       // const userId = session.user.id
//       const userEntries = await Entry.find({});
//       return new Response(JSON.stringify({ userEntries }));
//     } catch (error) {
//       // Handle the error, log it, or send a specific message

//       return new Response(
//         JSON.stringify({ message: 'Error fetching entries' }),
//         { status: 500 },
//       );
//     }
//   }

//   return new Response(JSON.stringify({ message: 'Not authenticated' }), {
//     status: 401,
//   });
// });
// export async function GET(request) {
//   try {
//     await dbConnect();
//     const sortOption = request.nextUrl.searchParams.get('sort') || 'date';
//     const direction = request.nextUrl.searchParams.get('direction') || 'desc';
//     let sortValue = direction === 'desc' ? -1 : 1;
//     let sortCriteria = { [sortOption]: sortValue };
//     const userId = request.headers.get('X-User-ID'); // Extract userId from 'X-User-ID' header
//     if (!userId) {
//       return new Response(JSON.stringify({ error: 'User ID not provided' }), {
//         status: 401,
//       });
//     }

//     const userEntries = await Entry.find({ userId }).sort(sortCriteria).exec();

//     return new Response(JSON.stringify({ userEntries }), {
//       status: 200,
//       headers: { 'Content-Type': 'application/json' },
//     });
//   } catch (error) {
//     return new Response(JSON.stringify({ error: 'Failed to fetch entries' }), {
//       status: 500,
//       headers: { 'Content-Type': 'application/json' },
//     });
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

// export async function DELETE(request) {
//   const session = await auth();
//   if (session) {
//     try {
//       const id = request.nextUrl.searchParams.get('id');
//       await dbConnect();
//       await Entry.findByIdAndDelete(id);
//       return NextResponse.json({ message: 'Entry deleted' }, { status: 200 });
//     } catch (error) {
//       return NextResponse.json(
//         { error: 'Failed to delete entry' },
//         { status: 500 },
//       );
//     }
//   } else {
//     return new Response(JSON.stringify({ error: 'Unauthorized' }), {
//       status: 401,
//     });
//   }
// }
