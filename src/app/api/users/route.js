import { MongoClient } from 'mongodb';
import { NextResponse } from 'next/server';

const uri = process.env.MONGODB_URI;

export async function POST(request) {
  try {
    const { name, birthday } = await request.json();
    const client = await MongoClient.connect(uri);
    const db = client.db('birthday-app');
    const usersCollection = db.collection('users');

    await usersCollection.insertOne({ name, birthday });

    client.close();
    return NextResponse.json({ message: 'User added successfully' }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to add user' }, { status: 500 });
  }
}
