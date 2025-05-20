import React from 'react';
import { GameState } from '../types';
import { MapPin, Target, Award } from 'lucide-react';

interface GameInfoProps {
  gameState: GameState;
}

const GameInfo: React.FC<GameInfoProps> = ({ gameState }) => {
  const { status, currentCity, guessedCities, totalScore, currentRound, totalRounds } = gameState;
  
  const lastGuess = guessedCities.length > 0 ? guessedCities[guessedCities.length - 1] : null;

  if (status === 'idle') {
    return (
      <div className="w-full max-w-md mx-auto p-6 bg-white rounded-lg shadow-md text-center">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">Capital Cities Challenge</h1>
        <p className="text-gray-600 mb-2">
          Test your geography knowledge by finding capital cities on the map!
        </p>
        <p className="text-gray-600">
          Click as close as possible to each city. Your score is based on how close you get.
        </p>
      </div>
    );
  }

  if (status === 'playing' && currentCity) {
    return (
      <div className="w-full max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xl font-bold text-gray-800">Find this city</h2>
            <p className="text-3xl font-bold text-blue-600">{currentCity.name}</p>
          </div>
          <MapPin size={36} className="text-blue-500" />
        </div>
        <p className="text-gray-600">Capital of: <span className="font-medium">{currentCity.capitalOf}</span></p>
        <div className="mt-4 bg-gray-50 p-3 rounded-md">
          <div className="flex justify-between items-center">
            <div className="text-gray-500">Score</div>
            <div className="font-bold text-gray-700">{totalScore}</div>
          </div>
          <div className="flex justify-between items-center mt-1">
            <div className="text-gray-500">Round</div>
            <div className="font-medium text-gray-700">{currentRound} of {totalRounds}</div>
          </div>
        </div>
      </div>
    );
  }

  if (status === 'feedback' && lastGuess) {
    return (
      <div className="w-full max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-800">
            {lastGuess.city.name}
          </h2>
          <Target size={28} className="text-emerald-500" />
        </div>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between bg-blue-50 p-3 rounded-md">
            <div className="text-blue-700">Distance</div>
            <div className="font-bold text-blue-700">{lastGuess.distance} km</div>
          </div>
          
          <div className="flex items-center justify-between bg-emerald-50 p-3 rounded-md">
            <div className="text-emerald-700">Points earned</div>
            <div className="font-bold text-emerald-700">+{lastGuess.points}</div>
          </div>
          
          <div className="flex items-center justify-between bg-orange-50 p-3 rounded-md">
            <div className="text-orange-700">Total score</div>
            <div className="font-bold text-orange-700">{totalScore}</div>
          </div>
        </div>
      </div>
    );
  }

  if (status === 'gameover') {
    return (
      <div className="w-full max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
        <div className="flex items-center justify-center mb-4">
          <Award size={40} className="text-orange-500 mr-3" />
          <h2 className="text-2xl font-bold text-gray-800">Game Over!</h2>
        </div>
        
        <div className="text-center mb-4">
          <div className="text-3xl font-bold text-orange-600">{totalScore} points</div>
          <p className="text-gray-600">Your final score</p>
        </div>
        
        <div className="space-y-3 mt-6">
          <h3 className="font-medium text-gray-700 border-b pb-2">Your Results</h3>
          {guessedCities.map((guess, index) => (
            <div key={index} className="flex justify-between items-center py-2 border-b border-gray-100">
              <div className="font-medium">{guess.city.name}</div>
              <div className="flex items-center">
                <span className="text-gray-600 mr-2">{guess.distance} km</span>
                <span className="font-bold text-emerald-600">{guess.points}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return null;
};

export default GameInfo;