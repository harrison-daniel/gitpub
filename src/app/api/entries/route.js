import dbConnect from '../../db/dbConnect';
import Entry from '../../models/entry';
import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const { title, address, description, date } = await request.json();
    await dbConnect();
    await Entry.create({ title, address, description, date });
    return NextResponse.json({ message: 'Entry created' }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to create entry' },
      { status: 500 },
    );
  }
}

export async function GET(request) {
  try {
    await dbConnect();
    const sortOption = request.nextUrl.searchParams.get('sort') || 'date';
    // const sortOption = request.nextUrl.searchParams.get('sort');
    const direction = request.nextUrl.searchParams.get('direction') || 'desc'; // default to 'desc' if not provided
    let sortValue = direction === 'desc' ? -1 : 1;
    let sortCriteria = { [sortOption]: sortValue };

    const entries = await Entry.find({}).sort(sortCriteria).exec();
    return NextResponse.json({ entries });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch entries' },
      { status: 500 },
    );
  }
  // let sortCriteria = {};

  //   switch (sortOption) {
  //     case 'date':
  //       sortCriteria = { date: sortValue };
  //       break;
  //     case 'title':
  //       sortCriteria = { title: sortValue };
  //       break;
  //     case 'address':
  //       sortCriteria = { address: sortValue };
  //       break;
  //     // case 'city':
  //     //   sortCriteria = { city: sortValue };
  //     //   break;
  //     default:
  //       sortCriteria = { date: -1 };
  //   }

  //   const entries = await Entry.find({}).sort(sortCriteria).exec();
  //   return NextResponse.json({ entries });
  // } catch (error) {
  //   return NextResponse.json(
  //     { error: 'Failed to fetch entries' },
  //     { status: 500 },
  //   );
  // }
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
