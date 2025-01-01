// game-won-modal.tsx

import { Word } from "@/app/_types";
import ControlButton from "../button/control-button";
import GuessHistory from "../guess-history";
import GameModal from "./game-modal";
import React, { useRef } from "react";
import html2canvas from "html2canvas";

type GameWonModalProps = {
  isOpen: boolean;
  onClose: () => void;
  guessHistory: Word[][];
  perfection: string;
};

export default function GameWonModal(props: GameWonModalProps) {
  const guessHistoryRef = useRef<HTMLDivElement>(null);

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
        const emojiLine = guess.map(word => levelToEmoji[word.level] || "⬜️").join("");
        return `${index + 1}. ${emojiLine}`;
      }),
      "",
      `🔗 Play the game here: ${gameLink}`
    ];

    const textMessage = textMessageLines.join("\n");

    // Encode the text message
    const encodedTextMessage = encodeURIComponent(textMessage);

    // WhatsApp share URL for text
    const whatsappURL = `https://wa.me/?text=${encodedTextMessage}`;

    // Open WhatsApp in a new tab/window
    const newWindow = window.open(whatsappURL, "_blank");


    // Capture the GuessHistory component as an image
   
  };

  return (
    <GameModal isOpen={props.isOpen} onClose={props.onClose}>
      <div className="flex flex-col items-center justify-center px-12">
        <h1 className="text-black text-4xl font-black my-4 ml-4">
          {props.perfection}
        </h1>
        <hr className="mb-2 md:mb-4 w-full" />
        <h2 className="text-black mb-8">{"You've won the game!"}</h2>
        
        {/* Hidden GuessHistory for Image Capture */}
        <div style={{ display: "none" }}>
          <GuessHistory guessHistory={props.guessHistory} ref={guessHistoryRef} />
        </div>

        {/* Visible GuessHistory */}
        <GuessHistory guessHistory={props.guessHistory} />
        
        {/* Button Container */}
        <div className="flex space-x-4 mt-6">
          <ControlButton text="Exit" onClick={props.onClose} />
          <ControlButton text="Share to Whatsapp" onClick={handleShareToWhatsapp} />
        </div>
      </div>
    </GameModal>
  );
}
