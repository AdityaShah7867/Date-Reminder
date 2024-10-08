import { MongoClient } from 'mongodb';
import { NextResponse } from 'next/server';

const uri = process.env.MONGODB_URI;

export async function GET() {
  try {
   
    const client = await MongoClient.connect(uri);
    const db = client.db('birthday-app');
    const usersCollection = db.collection('users');

    const currentMonth = new Date().getMonth() + 1;
    const birthdays = await usersCollection.find({
      $expr: {
        $eq: [{ $month: { $toDate: "$birthday" } }, currentMonth]
      }
    }).toArray();

    client.close();
    return NextResponse.json(birthdays);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch birthdays' }, { status: 500 });
  }
}