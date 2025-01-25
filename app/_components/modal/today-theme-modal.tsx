// today-theme-modal.tsx

import React from "react";
import GameModal from "./game-modal";
import ControlButton from "../button/control-button";

interface TodayThemeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function TodayThemeModal({ isOpen, onClose }: TodayThemeModalProps) {
  return (
    <GameModal isOpen={isOpen} onClose={onClose}>
      <div className="flex flex-col items-center justify-center px-4 py-4 md:px-6 md:py-6">
        <h2 className="text-black text-xl md:text-2xl font-bold mb-4">
          Today&apos;s Theme
        </h2>

        {/* Everything that was originally inside your second modal */}
        <div className="text-black text-base md:text-lg mb-4 w-full">
          <h3 className="font-semibold mb-2">___ Play</h3>
          <ul className="list-disc list-inside ml-4">
            <li>Foreplay, Screenplay, Downplay, Coldplay</li>
            
          </ul>
        </div>

        <div className="text-black text-base md:text-lg mb-4 w-full">
          <h3 className="font-semibold mb-2">Terms Related to the Placement Process</h3>
          <ul className="list-disc list-inside ml-4">
            <li>Relate, Dream, Hold, Accept</li>
          </ul>
        </div>

        <div className="text-black text-base md:text-lg mb-4 w-full">
          <h3 className="font-semibold mb-2">Regional groups at IIMA</h3>
          <ul className="list-disc list-inside ml-4">
            <li>WTF - WIMWIAN Tamil Fraternity</li>
            <li>SPAM: Some People Are Mallus</li>
            <li>USA: United States of Andhra</li>
            <li>Token Diversity Gang</li>
          </ul>
        </div>

        <div className="text-black text-base md:text-lg mb-4 w-full">
          <h3 className="font-semibold mb-2">4th</h3>
          <ul className="list-disc list-inside ml-4">
            <li>IIMA @ Sangharsh: IIMA finished 4th this year.</li>
            <li>Alan Bean: The 4th person to walk on the moon.</li>
            <li>Press: Known as the 4th Estate in democracy.</li>
            <li>US Independence: Celebrated on July 4th.</li>
          </ul>
        </div>

        <ControlButton text="Close" onClick={onClose} />
      </div>
    </GameModal>
  );
}
