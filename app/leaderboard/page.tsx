// app/leaderboard/page.tsx

import { MongoClient } from "mongodb";
import { Metadata } from "next";

// If you want a custom <title> in the browser tab
export const metadata: Metadata = {
  title: "Leaderboard",
};

export default async function LeaderboardPage() {
  // 1) Fetch the top 10 leaders from the database
  const leaders = await getLeaders();

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center py-8 px-4">
      <h1 className="text-3xl font-bold mb-6 text-center">Leaderboard</h1>

      <div className="overflow-x-auto w-full max-w-2xl">
        <table className="min-w-full bg-white rounded shadow">
          <thead className="bg-purple-500 text-white">
            <tr>
              <th className="px-4 py-2 text-left font-semibold">Rank</th>
              <th className="px-4 py-2 text-left font-semibold">Name</th>
              <th className="px-4 py-2 text-left font-semibold">Score</th>
            </tr>
          </thead>
          <tbody>
            {leaders.map((leader, index) => (
              <tr
                key={leader._id?.toString()} // or some unique key
                className={index % 2 === 0 ? "bg-gray-100" : "bg-white"}
              >
                <td className="px-4 py-2 font-medium text-black" >{index + 1}</td>
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

/**
 * Fetch top 10 users by score (descending).
 */
async function getLeaders() {
  // 1) Read environment variables (must be set in your hosting env or .env)
  const mongoUri = process.env.MONGODB_URI;
  const dbName = process.env.MONGODB_DB;
  if (!mongoUri || !dbName) {
    throw new Error("Missing MONGODB_URI or MONGODB_DB environment variables");
  }

  // 2) Connect to MongoDB
  const client = new MongoClient(mongoUri);
  await client.connect();

  try {
    const db = client.db(dbName);
    const usersCollection = db.collection("Users");

    // 3) Query the top 10 by score (descending)
    //    If 'score' is stored as a *number* in MongoDB,
    //    this will correctly sort in descending order (-1).
    const leaders = await usersCollection
      .find({})
      .sort({ score: -1 }) // Descending
      .limit(10)
      .toArray();

    return leaders;
  } finally {
    // 4) Close the connection
    await client.close();
  }
}
