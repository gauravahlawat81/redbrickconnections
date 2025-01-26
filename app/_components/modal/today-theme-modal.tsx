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
          <h3 className="font-semibold mb-2">DIRE ___</h3>
          <ul className="list-disc list-inside ml-4">
            <li>DIRESOME, DIRECT, DIREWOLF, DIRE HIT</li>
            
          </ul>
        </div>

        <div className="text-black text-base md:text-lg mb-4 w-full">
          <h3 className="font-semibold mb-2">INDIAN FREEDOM FIGHTERS FIRST NAME</h3>
          <ul className="list-disc list-inside ml-4">
            <li>Mahatama Gandhi, Bhagat Singh, Mangal Pandey, Subhash Chandra Bose</li>
          </ul>
        </div>

        <div className="text-black text-base md:text-lg mb-4 w-full">
          <h3 className="font-semibold mb-2">IIMA Dorm Names</h3>
          <ul className="list-disc list-inside ml-4">
            <li>Mandir: Dorm 19 Name</li>
            <li>Pataal Lok: Dorm 20 Name</li>
            <li>Godsmen: Dorm 21 Name</li>
            <li>Imperial Blues: Dorm 39 Name</li>
          </ul>
        </div>

        <div className="text-black text-base md:text-lg mb-4 w-full">
          <h3 className="font-semibold mb-2">PLACES YOU FIND YOUR FUTURE SPOUSE</h3>
          <ul className="list-disc list-inside ml-4">
            <li>Bumble, Linkedin, Newspaper, Shaadi.com</li>
          </ul>
        </div>

        <ControlButton text="Close" onClick={onClose} />
      </div>
    </GameModal>
  );
}
