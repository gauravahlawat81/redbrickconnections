import React, { forwardRef } from "react";
import { Word } from "../_types";
import { getWordColor } from "../_utils";

type GuessHistoryProps = {
  guessHistory: Word[][];
};

const GuessHistory = forwardRef<HTMLDivElement, GuessHistoryProps>(({ guessHistory }, ref) => {
  return (
    <div ref={ref} className="grid grid-cols-4 gap-y-1 mb-12">
      {guessHistory.map((guesses, guessIndex) =>
        guesses.map((word, index) => (
          <div
            key={`${guessIndex}-${index}`}
            className={`w-12 h-12 rounded-md ${getWordColor(word.level)}`}
          ></div>
        ))
      )}
    </div>
  );
});

// **Add the displayName property**
GuessHistory.displayName = "GuessHistory";

export default GuessHistory;
