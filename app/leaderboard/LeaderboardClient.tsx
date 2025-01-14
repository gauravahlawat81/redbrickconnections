// app/leaderboard/LeaderboardClient.tsx
"use client";

import { useState } from "react";

// Inline MedalIcons or import them
function GoldMedalIcon() {
  return (
    <img
      src="/gold-medal-svgrepo-com.svg"
      alt="Gold Medal"
      className="h-5 w-5"
    />
  );
}
function SilverMedalIcon() {
  return (
    <img
      src="/silver-medal-svgrepo-com.svg"
      alt="Silver Medal"
      className="h-5 w-5"
    />
  );
}
function BronzeMedalIcon() {
  return (
    <img
      src="/bronze-medal-svgrepo-com.svg"
      alt="Bronze Medal"
      className="h-5 w-5"
    />
  );
}

export default function LeaderboardClient({ leaders }: { leaders: any[] }) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Toggle modal
  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  return (
    <div className="min-h-screen bg-purple-50 flex flex-col items-center p-6">
      {/* Header + Learn About Scoring link */}
      <div className="flex flex-col items-center gap-2 mb-6">
        <h1 className="text-3xl font-bold text-black text-center">
          Leaderboard
        </h1>
      </div>

      {/* Container holding all cards */}
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

      <button
          onClick={openModal}
          className="underline text-blue-600 hover:text-blue-800 mt-2 flex items-center justify-center"
        >
          Learn About Scoring
        </button>

      {/* Modal */}
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
          1000 base points for finishing. There are streak points as well, 100 points for each day played continously, capped at 500.
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
