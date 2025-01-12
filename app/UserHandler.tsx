// UserHandler.tsx

"use client";

import { useEffect, useRef } from "react";
import { useSearchParams } from "next/navigation";

interface UserHandlerProps {
  setGoogleUser: (user: { name: string; email: string } | null) => void;
}

export default function UserHandler({ setGoogleUser }: UserHandlerProps) {
  const searchParams = useSearchParams();
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    /**
     * Function to start the game timer after a 5-second delay.
     * Sets 'gameStartTime' in localStorage.
     */
    const startGameTimer = () => {
      timerRef.current = setTimeout(() => {
        localStorage.setItem("gameStartTime", String(Date.now()));
        console.log("Game start time set in localStorage");
      }, 5000);
    };

    /**
     * Function to clear the game start time.
     * Removes 'gameStartTime' from localStorage.
     */
    const clearGameStartTime = () => {
      localStorage.removeItem("gameStartTime");
      console.log("Game start time cleared from localStorage");
    };

    // (a) Check localStorage for storedUser
    const storedUser = localStorage.getItem("googleUser");
    console.log("Response from the storedUser:", storedUser);

    if (storedUser) {
      // User is logged in
      const user = JSON.parse(storedUser);
      setGoogleUser(user);

      // Reset gameStartTime: clear existing and set new after 5 seconds
      clearGameStartTime();
      startGameTimer();
    } else {
      // User is not logged in
      setGoogleUser(null);

      // Remove gameStartTime on logout
      clearGameStartTime();
    }

    // (b) Check query params from OAuth callback
    const nameFromUrl = searchParams.get("name");
    const emailFromUrl = searchParams.get("email");

    // If we have name & email in the URL, store them and reset gameStartTime
    if (nameFromUrl && emailFromUrl) {
      const user = { name: nameFromUrl, email: emailFromUrl };
      localStorage.setItem("googleUser", JSON.stringify(user));
      setGoogleUser(user);

      // Clean up the URL to remove query parameters
      window.history.replaceState({}, "", "/");

      // Reset gameStartTime: clear existing and set new after 5 seconds
      clearGameStartTime();
      startGameTimer();
    }

    // Cleanup function to clear any pending timers when the component unmounts or dependencies change
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [searchParams, setGoogleUser]);

  return null; // This component doesn't render anything
}
