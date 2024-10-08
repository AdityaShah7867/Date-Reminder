import { MongoClient } from 'mongodb';
import { NextResponse } from 'next/server';

const uri = process.env.MONGODB_URI;

export async function GET() {
  try {
    const client = await MongoClient.connect(uri);
    const db = client.db('event-app');
    const eventsCollection = db.collection('events');

    const events = await eventsCollection.find().sort({ date: 1 }).toArray();

    client.close();
    return NextResponse.json(events);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch all events' }, { status: 500 });
  }
}