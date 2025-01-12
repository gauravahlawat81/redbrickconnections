// app/api/auth/google/callback/route.ts

import { NextRequest, NextResponse } from "next/server";
import axios from "axios";
import { DynamoDBClient, PutItemCommand } from "@aws-sdk/client-dynamodb";
import { MongoClient } from "mongodb";

export async function GET(request: NextRequest) {
    const code = request.nextUrl.searchParams.get("code");
    try {
    // 1) Parse the `code` from the URL using request.nextUrl
   

    if (!code) {
      if (!process.env.BASE_URL) {
        throw new Error("BASE_URL is not defined in environment variables");
      }
      return NextResponse.redirect(new URL("/?error=missing_code", process.env.BASE_URL));
    }

    // 2) Retrieve BASE_URL from environment variables
    const baseUrl = process.env.BASE_URL;
    if (!baseUrl) {
      throw new Error("BASE_URL is not defined in environment variables");
    }
    const redirectUri = `${baseUrl}/api/auth/google/callback`;
    console.log("RedirectURI in route callback  "+ redirectUri);

    // 3) Exchange the code for tokens
    const tokenRes = await axios.post("https://oauth2.googleapis.com/token", null, {
      params: {
        code,
        client_id: process.env.GOOGLE_CLIENT_ID,
        client_secret: process.env.GOOGLE_CLIENT_SECRET,
        redirect_uri: redirectUri,
        grant_type: "authorization_code",
      },
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    });

    const { access_token } = tokenRes.data;

    // 4) Fetch the user’s profile from Google
    const userInfoRes = await axios.get("https://www.googleapis.com/oauth2/v1/userinfo", {
      params: {
        alt: "json",
        access_token,
      },
    });
    const userInfo = userInfoRes.data;
    // Example response: { id, email, verified_email, name, given_name, family_name, picture, ... }

    // 5) Write to DynamoDB
    // const dynamoClient = new DynamoDBClient({ region: "ap-south-1" }); 
    // // Replace with your actual AWS region if different

    // await dynamoClient.send(
    //   new PutItemCommand({
    //     TableName: "Users", // The name of your DynamoDB table
    //     Item: {
    //       email_id: { S: userInfo.email ?? "unknown_email" },
    //       score: { S: "0" },
    //       // Additional attributes
    //       name: { S: userInfo.name ?? "" },
    //       // Example: userId if you want
    //       // user_id: { S: userInfo.id ?? "" },
    //     },
    //   })
    // );

    const mongoUri = process.env.MONGODB_URI;
    const dbName = process.env.MONGODB_DB;

    if (!mongoUri || !dbName) {
        throw new Error("MONGODB_URI or MONGODB_DB are not defined in environment variables");
      }
    
      const client = new MongoClient(mongoUri);
      await client.connect();
    
      try {
        const db = client.db(dbName);
        const usersCollection = db.collection("Users");
    
        // Check if there's already a document with this email
        const existingUser = await usersCollection.findOne({ email_id: userInfo.email });
    
        const today = new Date();
        if (!existingUser) {
          // If not found, insert a new document
          await usersCollection.insertOne({
            email_id: userInfo.email ?? "unknown_email",
            score: 0, // Initial score
            name: userInfo.name ?? "", // User's name
            gamesWon: [], // Initialize gamesWon as empty
            profileName: userInfo.name ?? "", // Profile name
            LastLoginDate: today, // Current login date
            streak: 0, // Initial streak
          });
        } else {
          // If the user exists, update their LastLoginDate and streak
          const lastLoginDate = existingUser.LastLoginDate ? new Date(existingUser.LastLoginDate) : null;
    
          let newStreak = existingUser.streak || 0;
    
          if (lastLoginDate) {
            const diffInDays =
              Math.floor((today.getTime() - lastLoginDate.getTime()) / (1000 * 60 * 60 * 24));
    
            if (diffInDays === 1) {
              // Increment streak if the user logs in consecutively
              newStreak += 1;
            } else if (diffInDays > 1) {
              // Reset streak if the user skipped a day
              newStreak = 0;
            }
          }
    
          // Update the user's document with the new LastLoginDate and streak
          await usersCollection.updateOne(
            { email_id: userInfo.email },
            {
              $set: {
                LastLoginDate: today, // Update the last login date
                streak: newStreak, // Update the streak
              },
            }
          );
        }
      } finally {
        // Ensure we close the connection to avoid leaving idle connections
        await client.close();
      }
    // 6) Redirect user to home page with name and email as query parameters
    const redirectUrl = new URL("/", baseUrl);
    redirectUrl.searchParams.set("name", userInfo.name ?? "");
    redirectUrl.searchParams.set("email", userInfo.email ?? "");
    console.log("Redirecting to " + redirectUrl);

    return NextResponse.redirect(redirectUrl);
  } catch (error) {
    console.error("Google OAuth callback error:", error);

    if (!process.env.BASE_URL) {
      // If BASE_URL is not set, respond with a 500 Internal Server Error
      return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }

    return NextResponse.redirect(new URL("/?error=oauth_failed", process.env.BASE_URL));
  }
}
