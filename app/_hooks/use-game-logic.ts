import { useEffect, useMemo, useRef, useState } from "react";
import { categories, gameID } from "../_examples";
import { Category, SubmitResult, Word } from "../_types";
import { delay, shuffleArray } from "../_utils";
import { calculateScore} from "../scoring"
import { log } from "console";

export default function useGameLogic() {
  const [gameWords, setGameWords] = useState<Word[]>([]);
  const selectedWords = useMemo(
    () => gameWords.filter((item) => item.selected),
    [gameWords]
  );
  const [clearedCategories, setClearedCategories] = useState<Category[]>([]);
  const [isWon, setIsWon] = useState(false);
  const [isLost, setIsLost] = useState(false);
  const [mistakesRemaining, setMistakesRemaning] = useState(4);
  const [score, setScore] = useState(0);
  const guessHistoryRef = useRef<Word[][]>([]);

  useEffect(() => {
    const words: Word[] = categories
      .map((category) =>
        category.items.map((word) => ({ word: word, level: category.level }))
      )
      .flat();
    setGameWords(shuffleArray(words));
  }, []);

  const selectWord = (word: Word): void => {
    const newGameWords = gameWords.map((item) => {
      // Only allow word to be selected if there are less than 4 selected words
      if (word.word === item.word) {
        return {
          ...item,
          selected: selectedWords.length < 4 ? !item.selected : false,
        };
      } else {
        return item;
      }
    });

    setGameWords(newGameWords);
  };

  const shuffleWords = () => {
    setGameWords([...shuffleArray(gameWords)]);
  };

  const deselectAllWords = () => {
    setGameWords(
      gameWords.map((item) => {
        return { ...item, selected: false };
      })
    );
  };

  const getSubmitResult = (): SubmitResult => {
    const sameGuess = guessHistoryRef.current.some((guess) =>
      guess.every((word) => selectedWords.includes(word))
    );

    if (sameGuess) {
      console.log("Same!");
      return { result: "same" };
    }

    guessHistoryRef.current.push(selectedWords);

    const likenessCounts = categories.map((category) => {
      return selectedWords.filter((item) => category.items.includes(item.word))
        .length;
    });

    const maxLikeness = Math.max(...likenessCounts);
    const maxIndex = likenessCounts.indexOf(maxLikeness);

    if (maxLikeness === 4) {
      return getCorrectResult(categories[maxIndex]);
    } else {
      return getIncorrectResult(maxLikeness);
    }
  };

  const getCorrectResult = (category: Category): SubmitResult => {
    setClearedCategories([...clearedCategories, category]);
    setGameWords(
      gameWords.filter((item) => !category.items.includes(item.word))
    );

    if (clearedCategories.length === 3) {
      return { result: "win" };
    } else {
      return { result: "correct" };
    }
  };

  const getIncorrectResult = (maxLikeness: number): SubmitResult => {
    setMistakesRemaning(mistakesRemaining - 1);

    if (mistakesRemaining === 1) {
      return { result: "loss" };
    } else if (maxLikeness === 3) {
      return { result: "one-away" };
    } else {
      return { result: "incorrect" };
    }
  };

  const handleLoss = async () => {
    const remainingCategories = categories.filter(
      (category) => !clearedCategories.includes(category)
    );

    deselectAllWords();

    for (const category of remainingCategories) {
      await delay(1000);
      setClearedCategories((prevClearedCategories) => [
        ...prevClearedCategories,
        category,
      ]);
      setGameWords((prevGameWords) =>
        prevGameWords.filter((item) => !category.items.includes(item.word))
      );
    }

    await delay(1000);
    setIsLost(true);
    const storedStreak = localStorage.getItem("userStreak");
    const streakNumber = storedStreak ? parseInt(storedStreak, 10) : 0;
    const tentativeScore = calculateScore(mistakesRemaining,streakNumber);
    setScore(tentativeScore)

    try {
      // 2) Fetch user’s email from localStorage
      const storedUser = localStorage.getItem("googleUser");
      if (!storedUser) {
        console.warn("No user in localStorage; cannot update DB.");
        return;
      }
      const { email } = JSON.parse(storedUser);
  
      // 3) Call our API route to update the user’s total score, if needed
      const response = await fetch("/api/updateLostGame", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          gameID,
        }),
      });
  
      if (!response.ok) {
        throw new Error("Score update failed.");
      }
  
      const data = await response.json();
      console.log("Score updated successfully:", data);
    } catch (err) {
      console.error("Error updating score:", err);
    }
    
    
  };

  const handleWin = async () => {
    console.log("Mistakes remaining is "+ mistakesRemaining);
    const storedStreak = localStorage.getItem("userStreak");
    const streakNumber = storedStreak ? parseInt(storedStreak, 10) : 0;
    const tentativeScore = calculateScore(mistakesRemaining,streakNumber);
    setScore(tentativeScore)
    setIsWon(true);

    try {
      // 2) Fetch user’s email from localStorage
      const storedUser = localStorage.getItem("googleUser");
      if (!storedUser) {
        console.warn("No user in localStorage; cannot update DB.");
        return;
      }
      const { email } = JSON.parse(storedUser);
  
      // 3) Call our API route to update the user’s total score, if needed
      const response = await fetch("/api/updateScore", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          gameID,
          newScore: tentativeScore, // the score from this game
        }),
      });
  
      if (!response.ok) {
        throw new Error("Score update failed.");
      }
  
      const data = await response.json();
      console.log("Score updated successfully:", data);
    } catch (err) {
      console.error("Error updating score:", err);
    }
    // await(1000);
  };

  return {
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
    handleLoss,
    handleWin,
  };
}
