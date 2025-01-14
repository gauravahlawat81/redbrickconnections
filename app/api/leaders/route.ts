// app/api/leaders/route.ts

import { NextResponse } from "next/server";
import { MongoClient } from "mongodb";

export async function GET() {
  const mongoUri = process.env.MONGODB_URI;
  const dbName = process.env.MONGODB_DB;
  if (!mongoUri || !dbName) {
    return NextResponse.json(
      { error: "Missing MONGODB_URI or MONGODB_DB" },
      { status: 500 }
    );
  }

  const client = new MongoClient(mongoUri);
  await client.connect();

  try {
    const db = client.db(dbName);
    const usersCollection = db.collection("Users");
    const leaders = await usersCollection
      .find({})
      .sort({ score: -1 })
      .limit(10)
      .toArray();

    return NextResponse.json(leaders);
  } catch (error) {
    console.error("Failed to fetch leaders:", error);
    return NextResponse.json({ error: "Failed to fetch leaders" }, { status: 500 });
  } finally {
    await client.close();
  }
}
