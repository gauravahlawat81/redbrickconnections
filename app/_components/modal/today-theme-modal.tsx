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
          <h3 className="font-semibold mb-2">IIMA Lawns</h3>
          <ul className="list-disc list-inside ml-4">
            <li>Gyspsy, Nursery, Chilrden&apos;s Park, Tower</li>
            
          </ul>
        </div>

        <div className="text-black text-base md:text-lg mb-4 w-full">
          <h3 className="font-semibold mb-2">Cars used by Amitabh Bachchan in Movies</h3>
          <ul className="list-disc list-inside ml-4">
            <li>Ambassador: Used in the movie Raja Hindustani</li>
            <li>Padmini: Used in the movie Khuddar</li>
            <li>Contessa: Used in the movie Don</li>
            <li>Beetle: Used in the movie Akayla</li>
          </ul>
        </div>

        <div className="text-black text-base md:text-lg mb-4 w-full">
          <h3 className="font-semibold mb-2">Birds in EPL Team Logos</h3>
          <ul className="list-disc list-inside ml-4">
            <li>Liver: Used by Liverpool FC</li>
            <li>Canary: Used by Norwich City FC</li>
            <li>Eagle: Used by Crystal Palace FC</li>
            <li>Rooster: Used by Tottenham Hotspur</li>
          </ul>
        </div>

        <div className="text-black text-base md:text-lg mb-4 w-full">
          <h3 className="font-semibold mb-2">Things that are Yellow</h3>
          <ul className="list-disc list-inside ml-4">
            <li>Demigrads: Section D of Batch 2025 had yellow as their color</li>
            <li>Minions and Simpsons: Fictional characters </li>
            <li>CSK: Chennai Super Kings have yellow color jersey.</li>
          </ul>
        </div>

        <ControlButton text="Close" onClick={onClose} />
      </div>
    </GameModal>
  );
}
