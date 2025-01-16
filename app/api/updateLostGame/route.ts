// app/api/updateScore/route.ts
import { NextRequest, NextResponse } from "next/server";
import { MongoClient } from "mongodb";

// Adjust your environment variables / configuration as needed
const mongoUri = process.env.MONGODB_URI as string;
const dbName = process.env.MONGODB_DB as string;

export async function POST(request: NextRequest) {
  try {
    // 1) Parse the incoming JSON from the request body
    const { email, gameID } = await request.json();

    if (!email || !gameID ) {
      return NextResponse.json(
        { error: "Missing or invalid parameters" },
        { status: 400 }
      );
    }

    // 2) Connect to MongoDB
    const client = new MongoClient(mongoUri);
    await client.connect();

    const db = client.db(dbName);
    const usersCollection = db.collection("Users");

    // 3) Find the user
    const userDoc = await usersCollection.findOne({ email_id: email });
    if (!userDoc) {
      await client.close();
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    // 4) Check if gameID is already in gamesWon
    const alreadyWon = Array.isArray(userDoc.gamesWon) 
      && userDoc.gamesWon.includes(gameID);

    if (!alreadyWon) {
      // (a) Convert user's existing "score" to a number
      // (b) Update the user's score and push the gameID
      await usersCollection.updateOne(
        { email_id: email },
        {
          $push: { gamesWon: gameID },
        }
      );

      console.log(`User ${email} lost  
        gameID: ${gameID} added to gamesWon.`);
    } else {
      console.log(`User ${email} has already won game ${gameID}; skipping any update.`);
    }

    await client.close();
    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("Error updating user score:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
