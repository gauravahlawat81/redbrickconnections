// app/api/auth/google/route.ts

import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  // The Google OAuth 2.0 endpoint:
  const rootUrl = "https://accounts.google.com/o/oauth2/v2/auth";


  const redirectUri = `${request.nextUrl.origin}/api/auth/google/callback`;
  // The query parameters to pass to Google
  const options = {
    redirect_uri: redirectUri,
    // ^ Change this if your domain is different (e.g., "https://www.yoursite.com/api/auth/google/callback")

    client_id: process.env.GOOGLE_CLIENT_ID ?? "",
    access_type: "offline",
    response_type: "code",
    prompt: "consent",
    scope: ["openid", "profile", "email"].join(" "),
  };

  // Convert to a query string
  const qs = new URLSearchParams(options).toString();

  // Redirect the user to Google's OAuth consent screen
  return NextResponse.redirect(`${rootUrl}?${qs}`);
}
