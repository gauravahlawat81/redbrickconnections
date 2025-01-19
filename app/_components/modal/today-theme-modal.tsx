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
          <h3 className="font-semibold mb-2">Ahmedabad Businesses</h3>
          <ul className="list-disc list-inside ml-4">
            <li>Rasna, Vadilal, Gandhi Soda Shop, Adani.</li>
            
          </ul>
        </div>

        <div className="text-black text-base md:text-lg mb-4 w-full">
          <h3 className="font-semibold mb-2">Eateries on Campus</h3>
          <ul className="list-disc list-inside ml-4">
            <li>Prithvi, Kamla, Radhika, Jaya Vairab Nath: Food spots at IIMA. Prithvi Mess, Kamla Café. Radhika’s and JBN (Jaya Vairab Nath)</li>
          </ul>
        </div>

        <div className="text-black text-base md:text-lg mb-4 w-full">
          <h3 className="font-semibold mb-2">___ Sarabhai</h3>
          <ul className="list-disc list-inside ml-4">
            <li>Vikram: Renowned scientist and founder of ISRO</li>
            <li>Mallika: Activist, Padma Bhushan awardee, and accomplished Kuchipudi and Bharatanatyam dancer who uses art for social change.</li>
            <li>Mrinalini: Celebrated Bharatanatyam dancer and founder of Darpana Academy.</li>
            <li>Anasuya: Social worker, women&apos;s rights activist, and nationalist leader.</li>
          </ul>
        </div>

        <div className="text-black text-base md:text-lg mb-4 w-full">
          <h3 className="font-semibold mb-2">Names with Body Parts in Them</h3>
          <ul className="list-disc list-inside ml-4">
            <li>Chinmay:  like Prof. Chinmay Tumbe - contains &quot;Chin.&quot;</li>
            <li>Palmo - like Thupstan Palmo - contains &quot;Palm.&quot;</li>
            <li>Armando - contains &quot;Arm.&quot;</li>
            <li>Handa: Contains &quot;Hand.&quot;</li>
          </ul>
        </div>

        <ControlButton text="Close" onClick={onClose} />
      </div>
    </GameModal>
  );
}
