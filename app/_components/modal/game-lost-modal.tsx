// game-lost-modal.tsx

import React, { useState } from "react";
import { Word } from "@/app/_types";
import ControlButton from "../button/control-button";
import GuessHistory from "../guess-history";
import GameModal from "./game-modal";
import TodayThemeModal from "./today-theme-modal"; // <-- import your separate modal

type GameLostModalProps = {
  isOpen: boolean;
  onClose: () => void;
  guessHistory: Word[][];
  score?:number;
};

export default function GameLostModal(props: GameLostModalProps) {
  // State to handle opening/closing the "today's theme" modal
  const [isThemeModalOpen, setIsThemeModalOpen] = useState(false);

  const handleLearnTodayTheme = () => {
    setIsThemeModalOpen(true);
  };

  const handleCloseThemeModal = () => {
    setIsThemeModalOpen(false);
  };

  return (
    <>
      {/* Main "Game Lost" Modal */}
      <GameModal isOpen={props.isOpen} onClose={props.onClose}>
        {/* 
          Outer container with responsive padding and a max-height.
          overflow-y-auto ensures scrolling if content is taller than 80% of the viewport.
        */}
        <div className="flex flex-col items-center justify-center w-full max-w-[600px] 
                        px-4 md:px-12 py-4 md:py-8
                        max-h-[80vh] overflow-y-auto">
          <h1 className="text-black text-3xl font-black my-4">
            Next time!
          </h1>
          <hr className="mb-4 w-full" />

          <GuessHistory guessHistory={props.guessHistory} />

          {/* Button Container */}
          <div className="flex flex-col md:flex-row space-y-4 md:space-x-4 md:space-y-0 mt-4">
            <ControlButton text="Exit" onClick={props.onClose} />
            <ControlButton
              text="Learn about today's game"
              onClick={handleLearnTodayTheme}
            />
          </div>
        </div>
      </GameModal>

      {/* "Today’s Theme" Modal */}
      <TodayThemeModal isOpen={isThemeModalOpen} onClose={handleCloseThemeModal} />
    </>
  );
}
