import Entry from '../../../models/entry';
import dbConnect from '../../../db/dbConnect';
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../../auth/[...nextauth]/options';

export async function PUT(request, { params }) {
  const session = await getServerSession(authOptions);

  if (session) {
    try {
      const { id } = params;
      const {
        newTitle: title,
        newStreetAddress: streetAddress,
        newCityStateAddress: cityStateAddress,
        newDescription: description,
        newDate: date,
        newWebsiteUrl: websiteUrl,
      } = await request.json();
      // Input validation can be added here
      await dbConnect();
      await Entry.findByIdAndUpdate(id, {
        title,
        streetAddress,
        cityStateAddress,
        description,
        date,
        websiteUrl,
      });
      return NextResponse.json({ message: 'Entry updated' }, { status: 200 });
    } catch (error) {
      return NextResponse.json(
        { error: 'Failed to update entry' },
        { status: 500 },
      );
    }
  } else {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
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

// export async function PUT(request, { params }) {
//   try {
//     const { id } = params;
//     const {
//       newTitle: title,
//       newStreetAddress: streetAddress,
//       newCityStateAddress: cityStateAddress,
//       newDescription: description,
//       newDate: date,
//       newWebsiteUrl: websiteUrl,
//     } = await request.json();
//     // Input validation can be added here
//     await dbConnect();
//     await Entry.findByIdAndUpdate(id, {
//       title,
//       streetAddress,
//       cityStateAddress,
//       description,
//       date,
//       websiteUrl,
//     });
//     return NextResponse.json({ message: 'Entry updated' }, { status: 200 });
//   } catch (error) {
//     return NextResponse.json(
//       { error: 'Failed to update entry' },
//       { status: 500 },
//     );
//   }
// }

// export async function GET(request, { params }) {
//   try {
//     const { id } = params;
//     await dbConnect();
//     const entry = await Entry.findOne({ _id: id }).lean();
//     if (entry) {
//       return NextResponse.json({ entry }, { status: 200 });
//     } else {
//       return NextResponse.json({ error: 'Entry not found' }, { status: 404 });
//     }
//   } catch (error) {
//     return NextResponse.json(
//       { error: 'Failed to fetch entry' },
//       { status: 500 },
//     );
//   }
// }
