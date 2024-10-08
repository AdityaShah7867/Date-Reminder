import { MongoClient } from 'mongodb';
import { NextResponse } from 'next/server';

const uri = process.env.MONGODB_URI;

export async function GET() {
  try {
    const client = await MongoClient.connect(uri);
    const db = client.db('event-app');
    const eventsCollection = db.collection('events');

    const currentMonth = new Date().getMonth() + 1;
    const events = await eventsCollection.find({
      $expr: {
        $eq: [{ $month: { $toDate: "$date" } }, currentMonth]
      }
    })
    .sort({ date: 1 }) // Sort events by date in ascending order
    .toArray();

    client.close();
    return NextResponse.json(events);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch events' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const eventData = await request.json();
    const client = await MongoClient.connect(uri);
    const db = client.db('event-app');
    const eventsCollection = db.collection('events');

    await eventsCollection.insertOne(eventData);

    client.close();
    return NextResponse.json({ message: 'Event added successfully' }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to add event' }, { status: 500 });
  }
}