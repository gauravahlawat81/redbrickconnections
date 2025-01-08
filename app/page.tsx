"use client";

import { useCallback, useState, useRef, useEffect } from "react";
import ControlButton from "./_components/button/control-button";
import Grid from "./_components/game/grid";
import GameLostModal from "./_components/modal/game-lost-modal";
import GameWonModal from "./_components/modal/game-won-modal";
import HelpModal from "./_components/modal/help-modal";
import SignUpModal from "./_components/modal/sign-up-modal";
import Popup from "./_components/popup";
import useAnimation from "./_hooks/use-animation";
import useGameLogic from "./_hooks/use-game-logic";
import usePopup from "./_hooks/use-popup";
import { SubmitResult, Word } from "./_types";
import { getPerfection } from "./_utils";
import dynamic from "next/dynamic";
import { MenuIcon, XIcon } from "@heroicons/react/outline";

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
  const [showSignUpModal, setShowSignUpModal] = useState(false);
  const [isHelpOpen, setIsHelpOpen] = useState(false);

  const [submitted, setSubmitted] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const { guessAnimationState, wrongGuessAnimationState, animateGuess, animateWrongGuess } =
    useAnimation();

  // Countdown target date
  const targetDate = new Date("2025/03/29 00:00:00 UTC+5:30");

  // Submit logic
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
    if (isWon) {
      return (
        <ControlButton
          text="Show Results"
          onClick={() => setShowGameWonModal(true)}
        />
      );
    } else if (isLost) {
      return (
        <ControlButton
          text="Show Results"
          onClick={() => setShowGameLostModal(true)}
        />
      );
    } else {
      return (
        <div className="flex gap-2 mb-12">
          <ControlButton text="Shuffle" onClick={shuffleWords} unclickable={submitted} />
          <ControlButton
            text="Deselect All"
            onClick={deselectAllWords}
            unclickable={selectedWords.length === 0 || submitted}
          />
          <ControlButton
            text="Submit"
            onClick={handleSubmit}
            unclickable={selectedWords.length !== 4 || submitted}
          />
        </div>
      );
    }
  };

  return (
    <>
      <div className="flex flex-col items-center w-11/12 md:w-3/4 lg:w-7/12 mx-auto mt-14 relative px-4 sm:px-6 lg:px-8">

        {/* Top Bar */}
        <div className="w-full flex items-center justify-between mb-4">
          {/* Hamburger (visible on mobile only) - top left */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden text-gray-700 focus:outline-none"
            aria-label="Toggle Menu"
          >
            {isMenuOpen ? <XIcon className="h-6 w-6" /> : <MenuIcon className="h-6 w-6" />}
          </button>

          {/* Right side buttons (hidden on mobile, shown on md and up) */}
          <div className="flex gap-4 items-center">
            {/* We intentionally skip putting anything in the space on the left 
                because we want the big 4 buttons on the top right. 
                On mobile, these are hidden in favor of the hamburger. */}
            <div className="hidden md:flex gap-4">
              <button
                className="bg-blue-500 hover:bg-blue-600 text-white text-sm sm:text-base font-medium rounded py-2 px-4"
                onClick={() => setIsHelpOpen(true)}
              >
                Instructions
              </button>
              <button
                className="bg-blue-500 hover:bg-green-600 text-white text-sm sm:text-base font-medium rounded py-2 px-4"
                onClick={() => window.open("https://forms.gle/Dqg9U2rJvpuN5KJ56", "_blank")}
              >
                Feedback
              </button>
              <button
                className="bg-green-500 hover:bg-blue-600 text-white text-sm sm:text-base font-medium rounded py-2 px-4"
                onClick={() => window.open("https://forms.gle/xW5EJGG6YKUfoxnL8", "_blank")}
              >
                Create a Game
              </button>
              <button
                className="bg-green-500 hover:bg-blue-600 text-white text-sm sm:text-base font-medium rounded py-2 px-4"
                onClick={() => setShowSignUpModal(true)}
              >
                Sign Up for Updates!
              </button>
            </div>
          </div>
        </div>

        {/* SIDE NAV + BACKDROP (mobile only) */}
        {isMenuOpen && (
          <>
            {/* Blurred/Dim Background */}
            <div
              className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40"
              onClick={() => setIsMenuOpen(false)}
            />

            {/* Slide-In Menu from the Left */}
            <div
              className={`
                fixed top-0 left-0 h-full w-64 bg-white shadow-md z-50 p-4
                transform transition-transform duration-300
                translate-x-0
                flex flex-col
              `}
            >
              {/* Close Icon inside the side nav (optional) */}
              <button
                onClick={() => setIsMenuOpen(false)}
                className="text-gray-700 focus:outline-none mb-4"
              >
                <XIcon className="h-6 w-6" />
              </button>

              {/* Buttons: spaced out so there's less blank space at bottom */}
              <div className="flex flex-col space-y-3">
                <button
                  className="bg-blue-500 hover:bg-blue-600 text-white text-sm font-medium rounded py-2 px-4 w-full text-left"
                  onClick={() => {
                    setIsHelpOpen(true);
                    setIsMenuOpen(false);
                  }}
                >
                  Instructions
                </button>
                <button
                  className="bg-blue-500 hover:bg-green-600 text-white text-sm font-medium rounded py-2 px-4 w-full text-left"
                  onClick={() => {
                    window.open("https://forms.gle/Dqg9U2rJvpuN5KJ56", "_blank");
                    setIsMenuOpen(false);
                  }}
                >
                  Feedback
                </button>
                <button
                  className="bg-green-500 hover:bg-blue-600 text-white text-sm font-medium rounded py-2 px-4 w-full text-left"
                  onClick={() => {
                    window.open("https://forms.gle/xW5EJGG6YKUfoxnL8", "_blank");
                    setIsMenuOpen(false);
                  }}
                >
                  Create a Game
                </button>
                {/* <button
                  className="bg-green-500 hover:bg-blue-600 text-white text-sm font-medium rounded py-2 px-4 w-full text-left"
                  onClick={() => {
                    setShowSignUpModal(true);
                    setIsMenuOpen(false);
                  }}
                >
                  Sign Up for Updates!
                </button> */}
              </div>
            </div>
          </>
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
        <h1 className="text-black mb-4 text-center">
          Today&apos;s puzzle was partially created by Tanma using our Create a Game feature!
        </h1>

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
          Mistakes Remaining: {mistakesRemaining > 0 ? Array(mistakesRemaining).fill("🟥") : ""}
        </h2>

        {renderControlButtons()}

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
      <SignUpModal isOpen={showSignUpModal} onClose={() => setShowSignUpModal(false)} />
    </>
  );
}
