// UserHandler.tsx

"use client";

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";

interface UserHandlerProps {
  setGoogleUser: (user: { name: string; email: string }) => void;
}

export default function UserHandler({ setGoogleUser }: UserHandlerProps) {
  const searchParams = useSearchParams();

  useEffect(() => {
    // (a) Check localStorage
    const storedUser = localStorage.getItem("googleUser");
    console.log("Response from the storedUser:", storedUser);

    if (storedUser) {
      setGoogleUser(JSON.parse(storedUser));
    }

    // (b) Check query params from OAuth callback
    const nameFromUrl = searchParams.get("name");
    const emailFromUrl = searchParams.get("email");

    // If we have name & email in the URL, store them
    if (nameFromUrl && emailFromUrl) {
      const user = { name: nameFromUrl, email: emailFromUrl };
      localStorage.setItem("googleUser", JSON.stringify(user));
      setGoogleUser(user);

      // Clean up the URL to remove query parameters
      window.history.replaceState({}, "", "/");
    }
  }, [searchParams, setGoogleUser]);

  return null; // This component doesn't render anything
}
