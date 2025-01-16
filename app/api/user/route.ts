// app/api/user/route.ts
import { NextRequest, NextResponse } from "next/server";
import { MongoClient } from "mongodb";
import { log } from "console";

/**
 * Sample GET route:
 * /api/user?email=someone@example.com
 */
export async function GET(request: NextRequest) {
  const email = request.nextUrl.searchParams.get("email");
  
  if (!email) {
    return NextResponse.json({ error: "Missing email" }, { status: 400 });
  }

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

    // Grab user by email_id
    const userDoc = await usersCollection.findOne({ email_id: email });
    if (!userDoc) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Calculate rank = # of users with strictly greater scores + 1
    const rank =
      (await usersCollection.countDocuments({ score: { $gt: userDoc.score } })) +
      1;

    // Return only necessary info
    return NextResponse.json({
      name: userDoc.name ?? userDoc.profileName ?? "Unnamed",
      score: userDoc.score ?? 0,
      rank,
    });
  } catch (err) {
    console.error("Error in /api/user route:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  } finally {
    await client.close();
  }
}
