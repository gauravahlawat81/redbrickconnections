"use client";

import { useState, useEffect } from "react";

interface CountdownProps {
  targetTime: Date;
}

export default function Countdown({ targetTime }: CountdownProps) {
  const [timeLeft, setTimeLeft] = useState(() => calculateTimeLeft(targetTime));

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft(targetTime)); // Update time left
    }, 1000);

    return () => clearInterval(timer); // Cleanup the timer
  }, [targetTime]);

  const { total, days, hours, minutes, seconds } = timeLeft;
  const isExpired = total <= 0;

  if (isExpired) {
    return (
      <div className="text-center text-black text-3xl font-semibold">
        Time’s Up!
      </div>
    );
  }

  return (
    <div className="flex justify-center gap-8 sm:gap-12 text-black">
      <CountdownUnit label="DAYS" value={days} />
      <CountdownUnit label="HOURS" value={hours} />
      <CountdownUnit label="MINUTES" value={minutes} />
      <CountdownUnit label="SECONDS" value={seconds} />
    </div>
  );
}

function CountdownUnit({ label, value }: { label: string; value: number }) {
  return (
    <div className="flex flex-col items-center">
      <div className="text-4xl sm:text-6xl font-bold">{value}</div>
      <span className="text-sm sm:text-base lg:text-lg uppercase mt-2 font-bold">
        {label}
      </span>
    </div>
  );
}

function calculateTimeLeft(targetTime: Date) {
  const now = new Date().getTime();
  const distance = targetTime.getTime() - now;

  return {
    total: distance,
    days: Math.floor(distance / (1000 * 60 * 60 * 24)),
    hours: Math.floor((distance / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((distance / (1000 * 60)) % 60),
    seconds: Math.floor((distance / 1000) % 60),
  };
}
