// app/_utils/scoring.ts

/**
 * Calculate a simple score based on mistakesRemaining and timeTakenSeconds.
 * Adjust the formula to your liking.
 */
export function calculateScore(mistakesRemaining: number,streakNumber:number): number {
    // Example formula:
    // Start with 1000 points, subtract 5 points per second,
    // then add 50 points per remaining mistake as a bonus.
    const base = 1000 + 250 * mistakesRemaining;
    const streakBonus = Math.min(streakNumber * 10, 50);

    if(!mistakesRemaining){
        return (base + streakBonus);
    } 
    else{
        return (streakBonus);
    }
  }
  