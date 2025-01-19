// app/page.tsx

"use client";

import React, { useCallback, useState, Suspense } from "react";
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
import { calculateScore} from "./scoring"

import UserHandler from "./UserHandler"; // Adjust the path as necessary

// Dynamically import Countdown with SSR disabled
const Countdown = dynamic(() => import("./countdown"), { ssr: false });

export default function Home() {
  // Initialize googleUser as undefined to represent the loading state
  const [googleUser, setGoogleUser] = useState<{ name: string; email: string } | null | undefined>(undefined);

  const [popupState, showPopup] = usePopup();
  const {
    gameWords,
    selectedWords,
    clearedCategories,
    mistakesRemaining,
    score,
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

  // Google Sign-In Logic
  const handleGoogleSignIn = () => {
    console.log("Redirecting to Google OAuth...");
    window.location.href = "/api/auth/google"; // Redirect to Google OAuth
  };

  const handleLogOut = () => {
    localStorage.removeItem("googleUser");
    setGoogleUser(null);
  };

  

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
      {/* Suspense Boundary for UserHandler */}
      <Suspense fallback={<div>Loading user data...</div>}>
        <UserHandler setGoogleUser={setGoogleUser} />
      </Suspense>

      {/* Conditional Rendering Based on Authentication State */}
      {googleUser === undefined ? (
        // While UserHandler is processing, show a loading indicator
        <div className="flex flex-col items-center justify-center min-h-screen p-4">
          <h2 className="text-xl font-bold mb-4">Loading...</h2>
        </div>
      ) : googleUser === null ? (
        // Render Sign-In Option if Not Logged In
        <div
        className="min-h-screen bg-cover bg-center flex items-center justify-center p-4 relative"
        style={{
          backgroundImage: "url('/1847.jpg')",
        }}
      >
        {/* Optional dark overlay for readability */}
        <div className="absolute inset-0 bg-black/30" />
      
        {/* Container/card (placed above the overlay) */}
        <div className="relative bg-white shadow-lg rounded-xl max-w-md w-full p-8 text-center animate-fadeInDown">
          <h2 className="text-2xl md:text-3xl font-extrabold mb-4 text-gray-800">
            Please log in with Google to continue
          </h2>
          <p className="text-gray-600 mb-8">
            We will update you every time there&apos;s a new game!
          </p>
      
          {/* <button
            onClick={handleGoogleSignIn}
            className="bg-blue-500 text-white font-semibold py-2 px-6 rounded-full
                       hover:bg-blue-600 transform hover:scale-105 transition-transform"
          >
            Sign in with Google
          </button> */}
          <button type="button" onClick={handleGoogleSignIn} className=" py-2 px-6 text-white bg-[#4285F4] hover:bg-[#4285F4]/90 focus:ring-4 focus:outline-none focus:ring-[#4285F4]/50 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center dark:focus:ring-[#4285F4]/55 me-2 mb-2">
            <svg className="w-5 h-5 me-2" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 18 19">
              <path fill-rule="evenodd" d="M8.842 18.083a8.8 8.8 0 0 1-8.65-8.948 8.841 8.841 0 0 1 8.8-8.652h.153a8.464 8.464 0 0 1 5.7 2.257l-2.193 2.038A5.27 5.27 0 0 0 9.09 3.4a5.882 5.882 0 0 0-.2 11.76h.124a5.091 5.091 0 0 0 5.248-4.057L14.3 11H9V8h8.34c.066.543.095 1.09.088 1.636-.086 5.053-3.463 8.449-8.4 8.449l-.186-.002Z" clip-rule="evenodd"/>
            </svg>
            <span className="text-xl">Sign in with Google</span>
          </button>
        </div>
      </div>
      ) : (
        // Main Game Interface for Logged-In Users
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
                  className="bg-purple-500 hover:bg-purple-600 text-white text-sm sm:text-base font-medium rounded py-2 px-4"
                  onClick={() => window.open("/leaderboard", "_blank")}
                >
                  Leaderboard
                </button>
                <ControlButton text="Logout" onClick={handleLogOut} />
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
                <button
                  onClick={() => setIsMenuOpen(false)}
                  className="text-gray-700 focus:outline-none mb-4"
                >
                  <XIcon className="h-6 w-6" />
                </button>

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
                    Create a Game!
                  </button>
                  <button
                    className="bg-purple-500 hover:bg-purple-600 text-white text-sm font-medium rounded py-2 px-4 w-full text-left"
                    onClick={() => {
                      window.open("/leaderboard", "_blank");
                      setIsMenuOpen(false);
                    }}
                  >
                    Leaderboard
                  </button>
                  <ControlButton text="Logout" onClick={handleLogOut} />
                </div>
              </div>
            </>
          )}

          {/* Title and Puzzle Info */}
          <h1 className="text-black text-2xl sm:text-3xl md:text-5xl text-center whitespace-nowrap font-semibold my-4 px-2 sm:px-4">
            <span style={{ color: "#bc4a3c" }} className="font-bold">
              Red Brick
            </span>{" "}
            Connections
          </h1>

          <hr className="mb-4 md:mb-4 w-full" />
          <h1 className="text-black mb-4 text-center">Create four groups of four!</h1>
          {/* <h1 className="text-black mb-4 text-center">Today&apos;s puzzle was created by Rushi Patel, PGP2 , using our Create a Game feature!</h1> */}
          {/* Puzzle Grid */}
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

          {/* Countdown */}
          <div className="flex justify-center items-center h-full">
            <div className="flex flex-col items-center my-12">
              <h1 className="text-4xl font-bold text-center text-black">Batch of 2025</h1>
              <h1 className="text-lg mb-6 text-center text-black">graduates in</h1>
              <Countdown targetTime={targetDate} />
            </div>
          </div>
        </div>
      )}

      {/* Modals */}
      <GameWonModal
        isOpen={showGameWonModal}
        onClose={() => setShowGameWonModal(false)}
        guessHistory={guessHistoryRef.current}
        perfection={getPerfection(mistakesRemaining)}
        score = {score}
      />
      <GameLostModal
        isOpen={showGameLostModal}
        onClose={() => setShowGameLostModal(false)}
        guessHistory={guessHistoryRef.current}
        score = {score}
      />
      <HelpModal isOpen={isHelpOpen} onClose={() => setIsHelpOpen(false)} />
      <SignUpModal isOpen={showSignUpModal} onClose={() => setShowSignUpModal(false)} />
    </>
  );
}
