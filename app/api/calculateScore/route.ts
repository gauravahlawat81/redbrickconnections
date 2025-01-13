// app/api/calculate-score/route.ts (for Next.js App Router)
import { NextRequest, NextResponse } from "next/server";
import { MongoClient } from "mongodb";

export async function POST(request: NextRequest) {
  try {
    const { mistakesRemaining, userEmail } = await request.json();

    // Connect to DB, fetch streak, compute final
    const finalScore = await computeScoreFromDb(mistakesRemaining, userEmail);

    // Return JSON
    return NextResponse.json({ finalScore }, { status: 200 });
  } catch (err) {
    console.error("Score calculation error:", err);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}

// A helper function to do the actual DB logic
async function computeScoreFromDb(mistakesRemaining: number, userEmail: string) {
  // do your mongodb logic, read streak, etc.
  // e.g. 
  const client = new MongoClient(process.env.MONGODB_URI!);
  await client.connect();
  try {
    const db = client.db(process.env.MONGODB_DB);
    const userDoc = await db.collection("Users").findOne({ email_id: userEmail });
    const streak = userDoc?.streak ?? 0;

    const baseScore = 1000 + 250 * mistakesRemaining;
    const streakBonus = Math.min(streak * 10, 50);
    return baseScore + streakBonus;
  } finally {
    await client.close();
  }
}
