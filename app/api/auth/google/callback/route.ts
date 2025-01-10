// app/api/auth/google/callback/route.ts

import { NextRequest, NextResponse } from "next/server";
import axios from "axios";
import { DynamoDBClient, PutItemCommand } from "@aws-sdk/client-dynamodb";
import { log } from "node:console";

export async function GET(request: NextRequest) {
  try {
    // 1) Parse the `code` from the URL
    const url = new URL(request.url);
    const code = url.searchParams.get("code");

    if (!code) {
      return NextResponse.redirect(new URL("/?error=missing_code", request.url));
    }

    const redirectUri = `${request.nextUrl.origin}/api/auth/google/callback`;

    // 2) Exchange the code for tokens
    const tokenRes = await axios.post("https://oauth2.googleapis.com/token", {
      code,
      client_id: process.env.GOOGLE_CLIENT_ID,
      client_secret: process.env.GOOGLE_CLIENT_SECRET,
      redirect_uri: redirectUri, 
      // ^ same as your route.ts "redirect_uri"

      grant_type: "authorization_code",
    });
    const { access_token } = tokenRes.data;

    // 3) Fetch the user’s profile from Google
    const userInfoRes = await axios.get(
      `https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${access_token}`
    );
    const userInfo = userInfoRes.data; 
    // e.g., { id, email, verified_email, name, given_name, family_name, picture, ... }

    // 4) Write to DynamoDB
    //    - The table has partition key: "email_id" (String)
    //    - The sort key is "score" (String)
    //    - We'll default the user's score to "0" 
    //      (If you want to store actual user scores, you can update it later.)

    const dynamoClient = new DynamoDBClient({ region: "ap-south-1" }); 
    // or your actual region

    await dynamoClient.send(
      new PutItemCommand({
        TableName: "Users", // The name of your DynamoDB table
        Item: {
          email_id: { S: userInfo.email ?? "unknown_email" },
          score: { S: "0" },
          // Additional attributes
          name: { S: userInfo.name ?? "" },
          // example: userId if you want
          // user_id: { S: userInfo.id ?? "" },
        },
      })
    );

    // 5) Redirect user to home page
    //    Optionally attach name/email so your front-end can store them
    //    in localStorage, or do a session-based approach
    const redirectUrl = new URL("/", request.url);
    redirectUrl.searchParams.set("name", userInfo.name ?? "");
    redirectUrl.searchParams.set("email", userInfo.email ?? "");
    console.log("Redirecting to "+ redirectUrl);
    

    return NextResponse.redirect(redirectUrl);

  } catch (error) {
    console.error("Google OAuth callback error:", error);
    return NextResponse.redirect(new URL("/?error=oauth_failed", request.url));
  }
}
