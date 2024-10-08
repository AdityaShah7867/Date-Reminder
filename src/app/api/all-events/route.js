import { MongoClient } from 'mongodb';
import { NextResponse } from 'next/server';

const uri = process.env.MONGODB_URI;

export async function GET() {
  let client;
  try {
    console.log('Attempting to connect to MongoDB...');
    client = await MongoClient.connect(uri);
    console.log('Connected to MongoDB successfully');

    const db = client.db('event-app');
    const eventsCollection = db.collection('events');

    console.log('Fetching events from database...');
    const events = await eventsCollection.find().sort({ date: 1 }).toArray();
    console.log(`Fetched ${events.length} events`);

    return NextResponse.json(events);
  } catch (error) {
    console.error('Error in /api/all-events:', error);
    return NextResponse.json({ error: 'Failed to fetch all events', details: error.message }, { status: 500 });
  } finally {
    if (client) {
      console.log('Closing MongoDB connection');
      await client.close();
    }
  }
}