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
          <h3 className="font-semibold mb-2">___ WARS</h3>
          <ul className="list-disc list-inside ml-4">
            <li>Section: Refers to Section Wars at IIMA.</li>
            <li>Star: Star Wars, the iconic movie series.</li>
            <li>World: World Wars, significant historical events</li>
            <li>Fan: Fan Wars, debates or clashes among fandoms.</li>

          </ul>
        </div>

        <div className="text-black text-base md:text-lg mb-4 w-full">
          <h3 className="font-semibold mb-2">Sources of Light</h3>
          <ul className="list-disc list-inside ml-4">
            <li>Sun, Tubelight, Lighter, Candle.</li>
          </ul>
        </div>

        <div className="text-black text-base md:text-lg mb-4 w-full">
          <h3 className="font-semibold mb-2">Things that are rolled</h3>
          <ul className="list-disc list-inside ml-4">
            <li>Cigarette, Dice, Wrap, Dough.</li>
          </ul>
        </div>

        <div className="text-black text-base md:text-lg mb-4 w-full">
          <h3 className="font-semibold mb-2">Things Professors Hate</h3>
          <ul className="list-disc list-inside ml-4">
            <li>Globe: Refers to giving vague, generalized answers in class</li>
            <li>Sleep: Dozing off during lectures.</li>
            <li>Smoking: Discouraged on campus</li>
            <li>Electronics: Misusing devices like laptops or phones during class</li>
          </ul>
        </div>

        <ControlButton text="Close" onClick={onClose} />
      </div>
    </GameModal>
  );
}
