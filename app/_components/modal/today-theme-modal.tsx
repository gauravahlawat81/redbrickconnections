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
          <h3 className="font-semibold mb-2">Types of Dosas at Radhikas</h3>
          <ul className="list-disc list-inside ml-4">
            <li>Pizza, Garlic, Paneer, Plain</li>
          </ul>
        </div>

        <div className="text-black text-base md:text-lg mb-4 w-full">
          <h3 className="font-semibold mb-2">Types of Rice Preparations</h3>
          <ul className="list-disc list-inside ml-4">
            <li>Curd, Lemon, Tamarind and Fried.</li>
          </ul>
        </div>

        <div className="text-black text-base md:text-lg mb-4 w-full">
          <h3 className="font-semibold mb-2">IIM World Sports Fests in English</h3>
          <ul className="list-disc list-inside ml-4">
            <li>Struggle (Sangharsh): Sports fest between IIMA, IIMB, IIMC, and IIML</li>
            <li>Outrage (Aakrosh): Sports fest within IIMA for section wars.</li>
            <li>Valour (Shaurya): Sports fest for Gujarat colleges.</li>
            <li>Battle (Yalgaar): Sports fest between junior and senior batches.</li>
          </ul>
        </div>

        <div className="text-black text-base md:text-lg mb-4 w-full">
          <h3 className="font-semibold mb-2">Words That Sound Like Philosophers</h3>
          <ul className="list-disc list-inside ml-4">
            <li>Plateau: Sounds like &quot;Plato,&quot; the Greek philosopher.</li>
            <li>Niche: Sounds like &quot;Nietzsche,&quot; the German philosopher</li>
            <li>Lock: Sounds like &quot;Locke,&quot; the English philosopher.</li>
            <li>Marks: Sounds like &quot;Marx,&quot; the German philosopherg</li>
          </ul>
        </div>

        <ControlButton text="Close" onClick={onClose} />
      </div>
    </GameModal>
  );
}
