// app/_utils/scoring.ts

/**
 * Calculate a simple score based on mistakesRemaining and timeTakenSeconds.
 * Adjust the formula to your liking.
 */
export function calculateScore(mistakesRemaining: number,streakNumber:number): number {
    
    const base = 1000 ;
    const streakBonus = Math.min(streakNumber * 100, 500);

    if(mistakesRemaining>0){
        return (base + streakBonus);
    } 
    else{
        return (streakBonus);
    }
  }
  