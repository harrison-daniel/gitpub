import { auth } from '../../auth';
import Entry from '../../models/entry';
import dbConnect from '../../db/dbConnect';
import { NextResponse } from 'next/server';

export async function DELETE() {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    await dbConnect();
    await Entry.deleteMany({ userId: session.user.id });
    return NextResponse.json({ message: 'Account data deleted' }, { status: 200 });
  } catch {
    return NextResponse.json({ error: 'Failed to delete account data' }, { status: 500 });
  }
}
