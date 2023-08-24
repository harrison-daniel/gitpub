import connectMongoDB from "../../libs/mongodb";
import Entry from "../../models/entry";

import { NextResponse } from "next/server";

export async function POST(request) {
  const { title, address, description } = await request.json();
  await connectMongoDB();
  await Entry.create({ title, address, description });
  return NextResponse.json({ message: "Entry created" }, { status: 201 });
}

export async function GET() {
  await connectMongoDB();
  const entries = await Entry.find();
  return NextResponse.json({ entries });
}

export async function DELETE(request) {
  const id = request.nextUrl.searchParams.get("id");
  await connectMongoDB();
  await Entry.findByIdAndDelete(id);
  return NextResponse.json({ message: "Entry deleted" }, { status: 200 });
}
