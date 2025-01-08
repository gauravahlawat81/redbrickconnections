"use client";

import { useCallback, useState, useRef, useEffect } from "react";
import ControlButton from "./_components/button/control-button";
import Grid from "./_components/game/grid";
import GameLostModal from "./_components/modal/game-lost-modal";
import GameWonModal from "./_components/modal/game-won-modal";
import HelpModal from "./_components/modal/help-modal"; // Import the HelpModal component
import SignUpModal from "./_components/modal/sign-up-modal"; // [ADDED] import the new modal


import Popup from "./_components/popup";
import useAnimation from "./_hooks/use-animation";
import useGameLogic from "./_hooks/use-game-logic";
import usePopup from "./_hooks/use-popup";
import { SubmitResult, Word } from "./_types";
import { getPerfection } from "./_utils";
import dynamic from "next/dynamic";
import { MenuIcon, XIcon } from "@heroicons/react/outline"; // Import Heroicons

// Dynamic import with ssr: false
const Countdown = dynamic(() => import("./countdown"), { ssr: false });

export default function Home() {
  const [popupState, showPopup] = usePopup();
  const {
    gameWords,
    selectedWords,
    clearedCategories,
    mistakesRemaining,
    isWon,
    isLost,
    guessHistoryRef,
    selectWord,
    shuffleWords,
    deselectAllWords,
    getSubmitResult,
    handleWin,
    handleLoss,
  } = useGameLogic();

  const [showGameWonModal, setShowGameWonModal] = useState(false);
  const [showGameLostModal, setShowGameLostModal] = useState(false);
  const [showSignUpModal, setShowSignUpModal] = useState(false); // [ADDED]

  const [submitted, setSubmitted] = useState(false);
  const [isHelpOpen, setIsHelpOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false); // State for hamburger menu

  // Reference for detecting outside clicks
  const menuRef = useRef<HTMLDivElement>(null);

  // Close the hamburger menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        isMenuOpen &&
        menuRef.current &&
        !menuRef.current.contains(event.target as Node) &&
        !(event.target as HTMLElement).closest('button[aria-label="Toggle Menu"]')
      ) {
        setIsMenuOpen(false);
      }
    };

    if (isMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isMenuOpen]);

  // 2025-03-29 at 00:00:00 IST (UTC+5:30)
  const targetDate = new Date("2025/03/29 00:00:00 UTC+5:30");

  const {
    guessAnimationState,
    wrongGuessAnimationState,
    animateGuess,
    animateWrongGuess,
  } = useAnimation();

  const handleSubmit = async () => {
    setSubmitted(true);
    await animateGuess(selectedWords);

    const result: SubmitResult = getSubmitResult();

    switch (result.result) {
      case "same":
        showPopup("You've already guessed that!");
        break;
      case "one-away":
        animateWrongGuess();
        showPopup("One away...");
        break;
      case "loss":
        showPopup("Better luck next time!");
        await handleLoss();
        setShowGameLostModal(true);
        break;
      case "win":
        showPopup(getPerfection(mistakesRemaining));
        await handleWin();
        setShowGameWonModal(true);
        break;
      case "incorrect":
        animateWrongGuess();
        break;
    }
    setSubmitted(false);
  };

  const onClickCell = useCallback(
    (word: Word) => {
      selectWord(word);
    },
    [selectWord]
  );

  const renderControlButtons = () => {
    const showResultsWonButton = (
      <ControlButton
        text="Show Results"
        onClick={() => {
          setShowGameWonModal(true);
        }}
      />
    );

    const showResultsLostButton = (
      <ControlButton
        text="Show Results"
        onClick={() => {
          setShowGameLostModal(true);
        }}
      />
    );

    const inProgressButtons = (
      <div className="flex gap-2 mb-12">
        <ControlButton
          text="Shuffle"
          onClick={shuffleWords}
          unclickable={submitted}
        />
        <ControlButton
          text="Deselect All"
          onClick={deselectAllWords}
          unclickable={selectedWords.length === 0 || submitted}
        />
        <ControlButton
          text="Submit"
          unclickable={selectedWords.length !== 4 || submitted}
          onClick={handleSubmit}
        />
      </div>
    );

    if (isWon) {
      return showResultsWonButton;
    } else if (isLost) {
      return showResultsLostButton;
    } else {
      return inProgressButtons;
    }
  };

  return (
    <>
      <div className="flex flex-col items-center w-11/12 md:w-3/4 lg:w-7/12 mx-auto mt-14 relative px-4 sm:px-6 lg:px-8">
        {/* Top Header: Buttons or Hamburger Menu */}
        <div className="w-full flex justify-end items-center mb-4">
          {/* Buttons for Desktop (Right Side) */}
          <div className="hidden md:flex gap-4">
            <button
              className="bg-blue-500 hover:bg-blue-600 text-white text-sm sm:text-base font-medium rounded py-2 px-4"
              onClick={() => setIsHelpOpen(true)}
            >
              Instructions
            </button>
            <button
              className="bg-blue-500 hover:bg-green-600 text-white text-sm sm:text-base font-medium rounded py-2 px-4"
              onClick={() =>
                window.open("https://forms.gle/Dqg9U2rJvpuN5KJ56", "_blank")
              }
            >
              Feedback
            </button>
            <button
              className="bg-green-500 hover:bg-blue-600 text-white text-sm sm:text-base font-medium rounded py-2 px-4"
              onClick={() =>
                window.open("https://forms.gle/xW5EJGG6YKUfoxnL8", "_blank")
                
              }
            >
              Create a Game
            </button>
            
            {/* <button
              className="bg-green-500 hover:bg-blue-600 text-white text-sm sm:text-base font-medium rounded py-2 px-4"
              onClick={() =>
                setShowSignUpModal(true)
              }
            >
              Sign Up for Updates!
            </button> */}

          </div>

          {/* Hamburger Menu for Mobile (Top-Right) */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-700 focus:outline-none"
              aria-label="Toggle Menu"
            >
              {isMenuOpen ? (
                <XIcon className="h-6 w-6" />
              ) : (
                <MenuIcon className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>

        {/* Dropdown Menu for Mobile */}
        {isMenuOpen && (
          <div
            ref={menuRef}
            className="absolute top-12 right-0 bg-white shadow-md rounded-md flex flex-col space-y-2 p-4 md:hidden z-10 w-40"
          >
            <button
              className="bg-blue-500 hover:bg-blue-600 text-white text-sm sm:text-base font-medium rounded py-2 px-4 text-left w-full"
              onClick={() => {
                setIsHelpOpen(true);
                setIsMenuOpen(false);
              }}
            >
              Instructions
            </button>
            <button
              className="bg-blue-500 hover:bg-green-600 text-white text-sm sm:text-base font-medium rounded py-2 px-4 text-left w-full"
              onClick={() => {
                window.open("https://forms.gle/Dqg9U2rJvpuN5KJ56", "_blank");
                setIsMenuOpen(false);
              }}
            >
              Feedback
            </button>
            <button
              className="bg-green-500 hover:bg-blue-600 text-white text-sm sm:text-base font-medium rounded py-2 px-4 text-left w-full"
              onClick={() => {
                window.open("https://forms.gle/xW5EJGG6YKUfoxnL8", "_blank");
                setIsMenuOpen(false);
              }}
            >
              Create a Game
            </button>
          </div>
        )}

        {/* Title */}
        <h1 className="text-black text-2xl sm:text-3xl md:text-5xl text-center whitespace-nowrap font-semibold my-4 px-2 sm:px-4">
          <span style={{ color: "#bc4a3c" }} className="font-bold">
            Red Brick
          </span>{" "}
          Connections
        </h1>

        <hr className="mb-4 md:mb-4 w-full" />
        <h1 className="text-black mb-4 text-center">Create four groups of four!</h1>
        <h1 className="text-black mb-4 text-center">Today&apos;s puzzle was partially created by Tanmay using our Create a Game feature!</h1>
        <div className="relative w-full">
          <Popup show={popupState.show} message={popupState.message} />
          <Grid
            words={gameWords}
            selectedWords={selectedWords}
            onClick={onClickCell}
            clearedCategories={clearedCategories}
            guessAnimationState={guessAnimationState}
            wrongGuessAnimationState={wrongGuessAnimationState}
          />
        </div>

        <h2 className="text-black my-4 md:my-8 mx-8">
          Mistakes Remaining:{" "}
          {mistakesRemaining > 0 ? Array(mistakesRemaining).fill("🟥") : ""}
        </h2>

        {/* Render your normal control buttons */}
        {renderControlButtons()}

        {/* Countdown Section */}
        <div className="flex justify-center items-center h-full">
          <div className="flex flex-col items-center my-12">
            <h1 className="text-4xl font-bold text-center text-black">Batch of 2025</h1>
            <h1 className="text-lg mb-6 text-center text-black">graduates in</h1>
            <Countdown targetTime={targetDate} />
          </div>
        </div>

        <div className="my-f flex flex-col items-center">
          <h3 className="text-black italic mb-2 text-base sm:text-xl md:text-2xl text-center">
            Have you made a memory today?
          </h3>
        </div>


      </div>

      {/* Modals */}
      <GameWonModal
        isOpen={showGameWonModal}
        onClose={() => setShowGameWonModal(false)}
        guessHistory={guessHistoryRef.current}
        perfection={getPerfection(mistakesRemaining)}
      />
      <GameLostModal
        isOpen={showGameLostModal}
        onClose={() => setShowGameLostModal(false)}
        guessHistory={guessHistoryRef.current}
      />
      <HelpModal isOpen={isHelpOpen} onClose={() => setIsHelpOpen(false)} />
      <SignUpModal 
        isOpen={showSignUpModal} 
        onClose={() => setShowSignUpModal(false)} 
      />
    </>
  );
}
