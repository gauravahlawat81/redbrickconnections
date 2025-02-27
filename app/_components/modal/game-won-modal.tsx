// game-won-modal.tsx

import { Word } from "@/app/_types";
import ControlButton from "../button/control-button";
import GuessHistory from "../guess-history";
import GameModal from "./game-modal";
import React, { useRef, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faWhatsapp } from "@fortawesome/free-brands-svg-icons";
import { faTrophy } from "@fortawesome/free-solid-svg-icons"

import html2canvas from "html2canvas";

// Import your SignUpModal component
import SignUpModal from "./sign-up-modal";
import TodayThemeModal from "./today-theme-modal"; // <--- Import new component

import { log } from "console";

type GameWonModalProps = {
  isOpen: boolean;
  onClose: () => void;
  guessHistory: Word[][];
  perfection: string;
  score?:number;
};

export default function GameWonModal(props: GameWonModalProps) {
  const guessHistoryRef = useRef<HTMLDivElement>(null);

  // State to handle opening/closing the theme modal
  const [isThemeModalOpen, setIsThemeModalOpen] = useState(false);

  // State to handle opening/closing the sign up modal
  const [showSignUpModal, setShowSignUpModal] = useState(false);

  /**
   * Handler to show a secondary modal about today's theme.
   */
  const handleLearnTodayTheme = () => {
    setIsThemeModalOpen(true);
  };

  /**
   * Handler to close the secondary theme modal.
   */
  const handleCloseThemeModal = () => {
    setIsThemeModalOpen(false);
  };

  /**
   * Handler to share the game result via WhatsApp.
   */
  const handleShareToWhatsapp = async () => {
    const gameLink = "https://redbrickconnections.com"; // Replace with your actual game URL

    // Define emoji mappings aligned with getWordColor
    const levelToEmoji: { [key: number]: string } = {
      1: "🟨", // Yellow Square
      2: "🟩", // Green Square
      3: "🟦", // Blue Square
      4: "🟪", // Purple Square
    };

    // Construct the text message with emojis
    const textMessageLines = [
      "🎉 Hey I just completed today's Red Brick Connections!",
      "",
      "📜 My Guesses :",
      ...props.guessHistory.map((guess, index) => {
        const emojiLine = guess.map((word) => levelToEmoji[word.level] || "⬜️").join("");
        return `${index + 1}. ${emojiLine}`;
      }),
      "",
      `🔗 Play the game here: ${gameLink}`,
    ];

    const textMessage = textMessageLines.join("\n");

    const encodedTextMessage = encodeURIComponent(textMessage);
    const whatsappURL = `https://wa.me/?text=${encodedTextMessage}`;

    window.open(whatsappURL, "_blank");
  };
  const handleLeaderBoard = () =>{
    window.open("/leaderboard", "_blank")
  }

  return (
    <>
      {/* Main "You Won" Modal */}
      <GameModal isOpen={props.isOpen} onClose={props.onClose}>
        <div className="flex flex-col items-center justify-center px-4 py-4 md:px-12 md:py-8 w-full">
          <h1 className="text-black text-2xl md:text-4xl font-black my-2 md:my-4">
            {props.perfection}
          </h1>
          <hr className="mb-2 md:mb-4 w-full" />
          {/* {props.score !== undefined && (
            <h2 className="text-black text-lg md:text-2xl mb-4 md:mb-8">
              You&apos;ve won the game! Your final score is: {props.score}
            </h2>
          )} */}

          {/* If you want a separate message if the score is missing: */}
          {!props.score && (
            <h2 className="text-black text-lg md:text-2xl mb-4 md:mb-8">
              You&apos;ve won the game!
            </h2>
          )}

          {/* Hidden GuessHistory for Image Capture */}
          <div style={{ display: "none" }}>
            <GuessHistory guessHistory={props.guessHistory} ref={guessHistoryRef} />
          </div>

          {/* Visible GuessHistory */}
          <GuessHistory guessHistory={props.guessHistory} />

          {/* Button Container */}
          <div className="flex flex-col items-center space-y-4 mt-6">
            {/* Row 1 */}
            <div className="flex flex-col md:flex-row space-y-4 md:space-x-4 md:space-y-0">
              {/* <ControlButton text="Exit" onClick={props.onClose} /> */}
              <button onClick={props.onClose} className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-full">
                  Exit
              </button>
              <button type="button" onClick={handleShareToWhatsapp} className="text-white bg-green-700 hover:bg-green-800 focus:outline-none focus:ring-4 focus:ring-green-300 font-medium rounded-full text-sm px-5 py-2.5 text-center me-2 mb-2 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800">
                Share to Whatsapp
                
                <FontAwesomeIcon icon={faWhatsapp} className="w-4 h-4 align-middle ml-1" />
                
              </button>

              {/* <ControlButton text="Share to Whatsapp" onClick={handleShareToWhatsapp} /> */}
            </div>

            {/* Row 2 */}
            <div className="flex flex-col md:flex-row space-y-4 md:space-x-4 md:space-y-0">
              {/* <ControlButton 
                text="Learn about Today&apos;s Game" 
                onClick={handleLearnTodayTheme}
              /> */}
              <button type="button" onClick={handleLearnTodayTheme} className="text-white bg-blue-700 hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 font-medium rounded-full text-sm px-5 py-2.5 text-center me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
                Learn about Today&apos;s Game
              </button>

              <button type="button" onClick={handleLeaderBoard} className="text-black bg-yellow-400 hover:bg-yellow-500 focus:outline-none focus:ring-4 focus:ring-yellow-300 font-medium rounded-full text-sm px-5 py-2.5 text-center me-2 mb-2 dark:focus:ring-yellow-900">
              <span>Leaderboard</span>
              <FontAwesomeIcon icon={faTrophy} className="w-5 h-5 ml-2 align-middle text-black" />
              </button>

              {/* <ControlButton 
                text="Leaderboard" 
                onClick={handleLeaderBoard}
              /> */}

              {/* Sign Up for Updates Button */}
              {/* <ControlButton
                text="Sign Up for Updates"
                onClick={() => setShowSignUpModal(true)}
              /> */}
            </div>
          </div>
        </div>
      </GameModal>

      {/* Secondary Modal for Theme Info */}
      <TodayThemeModal isOpen={isThemeModalOpen} onClose={handleCloseThemeModal}/>

      {/* Sign Up Modal */}
      <SignUpModal
        isOpen={showSignUpModal}
        onClose={() => setShowSignUpModal(false)}
      />
    </>
  );
}
