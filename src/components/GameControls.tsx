import React from 'react';
import { Play, SkipForward, RefreshCw } from 'lucide-react';
import { GameState } from '../types';

interface GameControlsProps {
  gameState: GameState;
  onStartGame: () => void;
  onNextRound: () => void;
  onResetGame: () => void;
}

const GameControls: React.FC<GameControlsProps> = ({
  gameState,
  onStartGame,
  onNextRound,
  onResetGame,
}) => {
  const { status, currentRound, totalRounds } = gameState;

  return (
    <div className="flex justify-between items-center w-full max-w-md mx-auto p-4 rounded-lg bg-white shadow-md">
      {status === 'idle' ? (
        <button
          onClick={onStartGame}
          className="w-full py-3 px-6 bg-emerald-500 text-white rounded-lg flex items-center justify-center gap-2 hover:bg-emerald-600 transition-colors duration-300 shadow-sm"
        >
          <Play size={18} />
          <span className="font-medium">Start Game</span>
        </button>
      ) : status === 'feedback' ? (
        <button
          onClick={onNextRound}
          className="w-full py-3 px-6 bg-blue-500 text-white rounded-lg flex items-center justify-center gap-2 hover:bg-blue-600 transition-colors duration-300 shadow-sm"
        >
          <SkipForward size={18} />
          <span className="font-medium">
            {currentRound === totalRounds ? 'See Final Score' : 'Next City'}
          </span>
        </button>
      ) : status === 'gameover' ? (
        <button
          onClick={onResetGame}
          className="w-full py-3 px-6 bg-orange-500 text-white rounded-lg flex items-center justify-center gap-2 hover:bg-orange-600 transition-colors duration-300 shadow-sm"
        >
          <RefreshCw size={18} />
          <span className="font-medium">Play Again</span>
        </button>
      ) : (
        <div className="w-full flex justify-between items-center">
          <div className="text-gray-700 font-medium">
            Find the city on the map
          </div>
          <div className="text-gray-700 font-medium">
            Round {currentRound}/{totalRounds}
          </div>
        </div>
      )}
    </div>
  );
};

export default GameControls;