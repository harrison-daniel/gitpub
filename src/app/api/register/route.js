import { NextResponse } from 'next/server';
import dbConnect from '../../db/dbConnect';
import User from '../../models/user';
import bcrypt from 'bcrypt';

export async function POST(req) {
  try {
    const { name, email, password } = await req.json();
    console.log('Name: ', name);
    console.log('Email: ', email);
    console.log('Password: ', password);
    const hashedPassword = await bcrypt.hash(password, 10);
    await dbConnect();

    await User.create({
      name,
      email,
      password: hashedPassword,
    });

    return NextResponse.json({ message: 'user created' }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { message: 'error occured creating user' },
      { status: 400 },
    );
  }
}
