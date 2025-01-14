// app/leaderboard/page.tsx

import { Metadata } from "next";
import { MongoClient } from "mongodb";
import LeaderboardClient from "./LeaderboardClient";

// Server-only export: metadata
export const metadata: Metadata = {
  title: "Leaderboard",
};

// Server-only export: revalidate
export const revalidate = 0;

// Server Component
export default async function LeaderboardPage() {
  const leaders = await getLeaders();

  return (
    <LeaderboardClient leaders={leaders} />
  );
}

/**
 * Fetch top 10 users by score (descending) from MongoDB
 */
async function getLeaders() {
  const mongoUri = process.env.MONGODB_URI;
  const dbName = process.env.MONGODB_DB;
  if (!mongoUri || !dbName) {
    throw new Error("Missing MONGODB_URI or MONGODB_DB environment variables");
  }

  const client = new MongoClient(mongoUri);
  await client.connect();
  try {
    const db = client.db(dbName);
    const usersCollection = db.collection("Users");
    return await usersCollection.find({}).sort({ score: -1 }).limit(10).toArray();
  } finally {
    await client.close();
  }
}
