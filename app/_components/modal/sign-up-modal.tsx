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

  return (
    <GameModal isOpen={isOpen} onClose={onClose}>
      <div className="flex flex-col items-center justify-center p-6 w-full max-w-md">
        <h2 className="text-black text-2xl font-bold mb-4">Sign Up for Updates</h2>
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
        {statusMessage && (
          <p className="mt-4 text-center text-sm text-gray-700">
            {statusMessage}
          </p>
        )}
      </div>
    </GameModal>
  );
}
