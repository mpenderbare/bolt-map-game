import { useState, useCallback } from 'react';
import { GameState } from '../types';
import { capitalCities } from '../data/capitals';
import { 
  initializeGame, 
  startNextRound, 
  processGuess 
} from '../utils/gameUtils';

export function useGameState() {
  const totalRounds = 5; // Changed to 5 rounds
  
  const [gameState, setGameState] = useState<GameState>(() => 
    initializeGame(capitalCities, totalRounds)
  );

  const startGame = useCallback(() => {
    const newGame = initializeGame(capitalCities, totalRounds);
    setGameState(startNextRound(newGame));
  }, [totalRounds]);

  const makeGuess = useCallback((location: [number, number]) => {
    if (gameState.status !== 'playing') return;
    
    setGameState(prevState => processGuess(prevState, location));
  }, [gameState.status]);

  const nextRound = useCallback(() => {
    setGameState(prevState => startNextRound(prevState));
  }, []);

  const resetGame = useCallback(() => {
    startGame();
  }, [startGame]);

  return {
    gameState,
    startGame,
    makeGuess,
    nextRound,
    resetGame
  };
}