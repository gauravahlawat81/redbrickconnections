// app/api/auth/google/route.ts

import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const baseUrl = process.env.BASE_URL;
    const clientId = process.env.GOOGLE_CLIENT_ID;

    if (!baseUrl || !clientId) {
      throw new Error("Missing BASE_URL or GOOGLE_CLIENT_ID in environment variables");
    }

    const redirectUri = `${baseUrl}/api/auth/google/callback`;

    const params = new URLSearchParams({
      client_id: clientId,
      redirect_uri: redirectUri,
      response_type: "code",
      scope: "openid email profile",
      access_type: "offline",
      prompt: "consent",
    });

    const authorizationUrl = `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;

    return NextResponse.redirect(authorizationUrl);
  } catch (error) {
    console.error("Error initiating Google OAuth:", error);
    return NextResponse.redirect(new URL("/?error=oauth_init_failed", process.env.BASE_URL));
  }
}
