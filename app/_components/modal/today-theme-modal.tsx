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
          <h3 className="font-semibold mb-2">Beers</h3>
          <ul className="list-disc list-inside ml-4">
            <li>Elephant, Kingfisher, Magnum, Miller: Popular beer brands</li>
            
          </ul>
        </div>

        <div className="text-black text-base md:text-lg mb-4 w-full">
          <h3 className="font-semibold mb-2">Fast Fauna</h3>
          <ul className="list-disc list-inside ml-4">
            <li>Cheetah, Falcon, Ostrich, Horse: Animals known for their speed.</li>
          </ul>
        </div>

        <div className="text-black text-base md:text-lg mb-4 w-full">
          <h3 className="font-semibold mb-2">____ Effect</h3>
          <ul className="list-disc list-inside ml-4">
            <li>Bandwagon: Following trends because others do.</li>
            <li>Butterfly: Small changes causing significant effects</li>
            <li>Halo: One positive trait influencing perception.</li>
            <li>Ikea: Valuing items more because you assembled them</li>
          </ul>
        </div>

        <div className="text-black text-base md:text-lg mb-4 w-full">
          <h3 className="font-semibold mb-2">Economics Courses at IIMA</h3>
          <ul className="list-disc list-inside ml-4">
            <li>Hitch: Hitchhiker&apos;s Guide to Business and Economies Across Five Centuries</li>
            <li>ME: Microeconomics.</li>
            <li>GTA: Game Theory and Applications.</li>
            <li>BEE: Behavioral and Experimental Economics</li>
          </ul>
        </div>

        <ControlButton text="Close" onClick={onClose} />
      </div>
    </GameModal>
  );
}
