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
  // 2) Fetch the top 10 leaders from the database
  const leaders = await getLeaders();

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center py-8 px-4">
      <h1 className="text-3xl font-bold mb-6 text-center text-black">Leaderboard</h1>

      <div className="overflow-x-auto w-full max-w-2xl">
        <table className="min-w-full bg-white rounded shadow">
          <thead className="bg-purple-500 text-white">
            <tr>
              <th className="px-4 py-2 text-left font-semibold text-black">Rank</th>
              <th className="px-4 py-2 text-left font-semibold text-black">Name</th>
              <th className="px-4 py-2 text-left font-semibold text-black">Score</th>
            </tr>
          </thead>
          <tbody>
            {leaders.map((leader, index) => (
              <tr
                key={leader._id?.toString()}
                className={index % 2 === 0 ? "bg-gray-100" : "bg-white"}
              >
                <td className="px-4 py-2 font-medium text-black">{index + 1}</td>
                <td className="px-4 py-2 text-black">{leader.name || "Unnamed"}</td>
                <td className="px-4 py-2 text-black">{leader.score}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// Helper function to fetch top 10 from MongoDB
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

    return await usersCollection
      .find({})
      .sort({ score: -1 })
      .limit(10)
      .toArray();
  } finally {
    await client.close();
  }
}
