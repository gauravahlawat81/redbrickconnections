// app/leaderboard/page.tsx

import { MongoClient } from "mongodb";
import { Metadata } from "next";

// 1) Force Next.js to re-fetch data every time (no caching)
export const revalidate = 0;

// If you want a custom <title> in the browser tab
export const metadata: Metadata = {
  title: "Leaderboard",
};

export default async function LeaderboardPage() {
  // Fetch top 10 leaders from MongoDB
  const leaders = await getLeaders();

  return (
    <div className="min-h-screen bg-purple-50 flex flex-col items-center p-6">
      <h1 className="text-3xl font-bold text-black mb-6 text-center">
        Leaderboard
      </h1>

      {/* Container holding all cards */}
      <div className="w-full max-w-md space-y-4">
        {leaders.map((leader, index) => {
          // rank is index + 1
          const rank = index + 1;

          // Determine medal icon if rank is 1, 2, or 3
          let MedalIcon = null;
          if (rank === 1) MedalIcon = <GoldMedalIcon />;
          if (rank === 2) MedalIcon = <SilverMedalIcon />;
          if (rank === 3) MedalIcon = <BronzeMedalIcon />;

          return (
            <div
              key={leader._id?.toString()}
              className="bg-white rounded-xl shadow p-4 flex items-center justify-between"
            >
              {/* Left side: rank + (optional medal) + name */}
              <div className="flex items-center gap-3">
                <span className="text-xl font-bold text-gray-800">{rank}</span>
                
                <span className="text-gray-700 font-medium">
                  {leader.name ?? "Unnamed"}
                </span>
                {MedalIcon}
              </div>

              {/* Right side: score */}
              <div className="text-gray-700 font-semibold">
                {leader.score ?? 0}
              </div>
            </div>
          );
        })}
      </div>
    </div>
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

    // get top 10 by descending score
    return await usersCollection
      .find({})
      .sort({ score: -1 })
      .limit(10)
      .toArray();
  } finally {
    await client.close();
  }
}

/**
 * Medal Icons (inline SVG)
 * You can replace these with any icon library or custom images.
 */
function GoldMedalIcon() {
  return (
    <img
      src="../gold-medal-svgrepo-com.svg" 
      alt="Gold Medal"
      className="h-5 w-5"
    />
  );
}

function SilverMedalIcon() {
  return (
    <img
      src="../silver-medal-svgrepo-com.svg" 
      alt="Silver Medal"
      className="h-5 w-5"
    />
  );
}

function BronzeMedalIcon() {
  return (
    <img
    src="../bronze-medal-svgrepo-com.svg" 
    alt="Bronze Medal"
    className="h-5 w-5"
  />
  );
}
