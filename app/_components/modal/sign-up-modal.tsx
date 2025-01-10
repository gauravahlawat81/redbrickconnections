// /app/_components/modal/sign-up-modal.tsx
"use client";

import React, { useState } from "react";
import GameModal from "./game-modal";
import ControlButton from "../button/control-button";

type SignUpModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

export default function SignUpModal({ isOpen, onClose }: SignUpModalProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [statusMessage, setStatusMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatusMessage("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/subscribe", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email }),
      });

      if (!response.ok) {
        throw new Error("Response not OK");
      }

      // If the POST was successful
      const data = await response.json();
      if (data.success) {
        setStatusMessage("Thank you for signing up!");
        setName("");
        setEmail("");
      } else {
        setStatusMessage("Oops! Something went wrong. Please try again.");
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      setStatusMessage("Oops! Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // This function triggers the Google OAuth flow via NextAuth
  const handleGoogleSignUp = () => {
    const width = 500;
  const height = 600;
  const left = (window.screen.width - width) / 2;
  const top = (window.screen.height - height) / 2;

  // Open a small popup in the center of the user’s screen
  const popup = window.open(
    "/api/auth/google", // your OAuth route
    "google-oauth",
    `width=${width},height=${height},top=${top},left=${left},popup=yes,scrollbars=yes,resizable=no`
  );
  };

  return (
    <GameModal isOpen={isOpen} onClose={onClose}>
      <div className="flex flex-col items-center justify-center p-6 w-full max-w-md">
        <h2 className="text-black text-2xl font-bold mb-4">
          Please Sign Up for Updates
        </h2>

        {/* Manual sign-up form */}
        <form onSubmit={handleSubmit} className="w-full flex flex-col space-y-4">
          <div>
            <label className="block text-black mb-1" htmlFor="name">
              Name:
            </label>
            <input
              id="name"
              type="text"
              className="border border-gray-300 rounded w-full p-2"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              placeholder="Enter your name"
            />
          </div>
          <div>
            <label className="block text-black mb-1" htmlFor="email">
              Email:
            </label>
            <input
              id="email"
              type="email"
              className="border border-gray-300 rounded w-full p-2"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="Enter your email"
            />
          </div>
          <div className="flex justify-end">
            <ControlButton
              text={isLoading ? "Submitting..." : "Submit"}
              type="submit"
              onClick={() => {}}
              unclickable={isLoading}
            />
          </div>
        </form>

        {/* “We will update you…” text */}
        <h1 className="mt-4 flex items-center justify-center">
          We will update you every time there&apos;s a new game
        </h1>

        {/* OR divider */}
        <div className="flex items-center my-4 w-full">
          <hr className="flex-grow border-gray-300" />
          <span className="mx-2 text-gray-500">OR</span>
          <hr className="flex-grow border-gray-300" />
        </div>

        {/* Sign up with Google */}
        <ControlButton
          text="Sign up with Google"
          type="button"
          onClick={handleGoogleSignUp}
        />

        {statusMessage && (
          <p className="mt-4 text-center text-sm text-gray-700">
            {statusMessage}
          </p>
        )}
      </div>
    </GameModal>
  );
}
