import { auth } from '../../auth';
import dbConnect from '../../db/dbConnect';
import Entry from '../../models/entry';
import { NextResponse } from 'next/server';


// export const GET = auth((req) => {

//   if (req.auth) {
//     dbConnect();
//     const sortOption = req.nextUrl.searchParams.get('sort') || 'date';
//     const direction = req.nextUrl.searchParams.get('direction') || 'desc';
//     let sortValue = direction === 'desc' ? -1 : 1;
//     let sortCriteria = { [sortOption]: sortValue };

//     const userEntries = Entry.find({ userId }).sort(sortCriteria).exec();

//     return userEntries.json({ data: "Protected userEntries data" })
//   }

//   return Response.json({ message: "Not authenticated" }, { status: 401 })
// }) as any // TODO: Fix `auth()` return type


export async function GET(request) {
  // export const GET = auth(async (request) => {
    const session = await auth();
    console.log('APIIIII SESSION', session);  
    if (session) {
  
    // console.log('APIIIII SESSION', session);
    try {
      await dbConnect();
      const sortOption = request.nextUrl.searchParams.get('sort') || 'date';
      const direction = request.nextUrl.searchParams.get('direction') || 'desc';
      let sortValue = direction === 'desc' ? -1 : 1;
      let sortCriteria = { [sortOption]: sortValue };
    
      const userEntries = await Entry.find({ userId: session.user.id }).sort(sortCriteria).exec();
      console.log(userEntries);
      return new Response(
        JSON.stringify({ userEntries }),
     
      );
    } catch (error) {
      console.error(error);
      return new Response(
        JSON.stringify({
          error: 'Failed to Fetch userEntries',
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
  


