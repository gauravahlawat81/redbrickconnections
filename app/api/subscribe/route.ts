// /app/api/subscribe/route.ts

import { NextResponse } from "next/server";
import { google } from "googleapis";

// export const dynamic = "force-dynamic";
// export const runtime = "nodejs"; 


export async function POST(request: Request) {
  try {
    const { name, email } = await request.json();

    // 1. Parse the service account key from env
    const serviceAccountKey = process.env.GOOGLE_SERVICE_ACCOUNT_KEY;
    if (!serviceAccountKey) {
      throw new Error("No Google service account key in environment");
    }

    // 2. Set up auth
    const auth = new google.auth.GoogleAuth({
      credentials: JSON.parse(serviceAccountKey),
      scopes: ["https://www.googleapis.com/auth/spreadsheets"],
    });

    // 3. Create a Sheets client
    const sheets = google.sheets({ version: "v4", auth });

    // 4. The ID of the spreadsheet. (From .env)
    const spreadsheetId = process.env.SPREADSHEET_ID;
    if (!spreadsheetId) {
      throw new Error("No spreadsheet ID in environment");
    }

    // 5. Which sheet and columns you want to insert into, e.g., "Sheet1!A:B"
    const range = "Sheet1!A:B"; // Adjust to your needs
    const values = [[name, email]];

    // 6. Append the data
    await sheets.spreadsheets.values.append({
      spreadsheetId,
      range,
      valueInputOption: "USER_ENTERED",
      requestBody: {
        values,
      },
    });

    return NextResponse.json({ success: true, message: "Saved to Google Sheet!" });
  } catch (error) {
    console.error("Error saving subscription:", error);
    return NextResponse.json(
      { success: false, message: "Error storing subscription" },
      { status: 500 }
    );
  }
}
