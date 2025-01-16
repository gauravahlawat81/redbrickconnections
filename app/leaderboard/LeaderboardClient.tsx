// app/leaderboard/LeaderboardClient.tsx
"use client";

import { log } from "node:console";
import { useEffect, useState } from "react";

// If you’re using images, you can inline or import them
function GoldMedalIcon() {
  return (
    <img src="/gold-medal-svgrepo-com.svg" alt="Gold Medal" className="h-5 w-5" />
  );
}
function SilverMedalIcon() {
  return (
    <img src="/silver-medal-svgrepo-com.svg" alt="Silver Medal" className="h-5 w-5" />
  );
}
function BronzeMedalIcon() {
  return (
    <img src="/bronze-medal-svgrepo-com.svg" alt="Bronze Medal" className="h-5 w-5" />
  );
}

interface LeaderboardProps {
  leaders: any[]; // from getLeaders
}

interface CurrentUserData {
  name: string;
  score: number;
  rank: number;
}

export default function LeaderboardClient({ leaders }: LeaderboardProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  // State for the current user (fetched from an API route)
  const [currentUser, setCurrentUser] = useState<CurrentUserData | null>(null);

  // 1) On mount, read email from localStorage, then fetch user data
  useEffect(() => {
    // 1) Get the JSON string from localStorage
    const userJson = localStorage.getItem("googleUser");
    if (userJson) {
      // 2) Parse it to get an object
      const userObj = JSON.parse(userJson);
      // userObj is something like { name: "Gaurav Ahlawat", email: "ahlawatgaurav1998@gmail.com" }

      if (userObj.email) {
        // 3) Use the email to call your API route
        fetch(`/api/user?email=${encodeURIComponent(userObj.email)}`)
          .then((res) => res.json())
          .then((data) => {
            if (!data.error) {
              // data should be { name, score, rank } from your route
              setCurrentUser(data);
            } else {
              console.error("API returned error:", data.error);
            }
          })
          .catch((err) => {
            console.error("Failed to fetch current user data:", err);
          });
      }
    }
  }, []);

  // Toggle modal
  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  return (
    <div className="min-h-screen bg-purple-50 flex flex-col items-center p-6">
      {/* 1) Show the current user’s name and score if available */}
      {currentUser && (
        <div className="mb-6 text-center">
          <h2 className="text-xl font-semibold text-black">
            Welcome, {currentUser.name}!
          </h2>
          <p className="text-gray-700 text-black">
            Your Score:{" "}
            <span className="font-bold text-black">{currentUser.score}</span>{" "}
            | Rank:{" "}
            <span className="font-bold text-black">{currentUser.rank}</span>
          </p>
        </div>
      )}

      {/* 2) Leaderboard Header */}
      <div className="flex flex-col items-center gap-2 mb-6">
        <h1 className="text-3xl font-bold text-black text-center">
          Leaderboard
        </h1>
      </div>

      {/* 3) Container holding all top 10 cards */}
      <div className="w-full max-w-md space-y-4">
        {leaders.map((leader, index) => {
          const rank = index + 1;
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
                  {leader.name ?? leader.profileName ?? "Unnamed"}
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

      {/* 4) "Learn About Scoring" link + modal */}
      <button
        onClick={openModal}
        className="underline text-blue-600 hover:text-blue-800 mt-4 flex items-center justify-center"
      >
        Learn About Scoring
      </button>

      {isModalOpen && <ScoringModal onClose={closeModal} />}
    </div>
  );
}

function ScoringModal({ onClose }: { onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/50" onClick={onClose}></div>
      
      {/* Modal content */}
      <div className="bg-white p-6 rounded-lg z-10 w-11/12 max-w-md">
        <h2 className="text-xl font-bold mb-4 text-black">How Scoring Works</h2>
        <p className="text-gray-700 mb-4">
          1000 base points for finishing.
        </p>
        <div className="flex items-center justify-center">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 flex items-center justify-center"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
