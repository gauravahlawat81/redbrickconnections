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
          <h3 className="font-semibold mb-2">UNDER ___</h3>
          <ul className="list-disc list-inside ml-4">
            <li>Pass: An underpass connects the Old and New Campus at IIMA.</li>
            <li>Stand: Refers to &quot;Understand&quot;, meaning to comprehend.</li>
            <li>Cut: Common phrase &quot;Undercut&quot;, meaning to lower prices or undermine.</li>
            <li>Write: Refers to &quot;Underwrite&quot;, meaning to assume financial risk or support.</li>
          </ul>
        </div>

        <div className="text-black text-base md:text-lg mb-4 w-full">
          <h3 className="font-semibold mb-2">Gen NB Hot Topics</h3>
          <ul className="list-disc list-inside ml-4">
            <li>Coldplay: A hot topic due to the reselling of concert tickets.</li>
            <li>Dogs: Infamous on IIMA campus for their antics and their biting of Rajas Joshi.</li>
            <li>Survey: Frequently shared for academic purposes.</li>
            <li>Lost & Found: &apos;Lost my earphones in new sports complex please help, here is generic image from amazon&apos;.</li>
          </ul>
        </div>

        <div className="text-black text-base md:text-lg mb-4 w-full">
          <h3 className="font-semibold mb-2">Followed by a Number</h3>
          <ul className="list-disc list-inside ml-4">
            <li>Alpha: Refers to Alpha One, the mall near IIMA.</li>
            <li>Ocean&apos;s: From the movie series Ocean&apos;s 11, 12, 13, or 8.</li>
            <li>Ben: Refers to Ben 10, a TV show deserving of an RJM screening.</li>
            <li>Famous: Refers to Famous Five, a classic book series.</li>
          </ul>
        </div>

        <div className="text-black text-base md:text-lg mb-4 w-full">
          <h3 className="font-semibold mb-2">Places One Might Find CP</h3>
          <ul className="list-disc list-inside ml-4">
            <li>Delhi: Connaught Place, a landmark in Delhi</li>
            <li>Classroom: Class Participation (CP), a grading metric at IIMA.</li>
            <li>Commissioner&apos;s Office: CP refers to Commissioner of Police.</li>
            <li>Profit Calculation: CP stands for Cost Price in accounting</li>
          </ul>
        </div>

        <ControlButton text="Close" onClick={onClose} />
      </div>
    </GameModal>
  );
}
