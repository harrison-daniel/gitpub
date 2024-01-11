import { auth } from '../../auth';
import dbConnect from '../../db/dbConnect';
import Entry from '../../models/entry';
import { NextResponse } from 'next/server';

export async function GET(request) {
// export const GET = auth(async (request) => {
  const session = await auth();

  // console.log('APIIIII SESSION', session);
  try {
    await dbConnect();
    const sortOption = request.nextUrl.searchParams.get('sort') || 'date';
    const direction = request.nextUrl.searchParams.get('direction') || 'desc';
    let sortValue = direction === 'desc' ? -1 : 1;
    let sortCriteria = { [sortOption]: sortValue };
  
    const userEntries = await Entry.find({ userId: session.user.id }).sort(sortCriteria).exec();
    // console.log(userEntries);
    return new NextResponse(JSON.stringify({ userEntries }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in GET API:', error);
    new NextResponse.json({ error: 'Internal Server Error' });
  }

}



