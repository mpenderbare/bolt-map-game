import React from 'react';
import MapView from './components/MapView';
import GameControls from './components/GameControls';
import GameInfo from './components/GameInfo';
import { useGameState } from './hooks/useGameState';
import { Map } from 'lucide-react';

function App() {
  const { gameState, startGame, makeGuess, nextRound, resetGame } = useGameState();
  const { status, currentCity, lastClickLocation } = gameState;

  // Determine if we should disable map clicks
  const disableMapClicks = status !== 'playing';

  // Determine the actual location for displaying the correct marker
  const actualLocation = status === 'feedback' || status === 'gameover' 
    ? currentCity 
      ? [currentCity.latitude, currentCity.longitude] as [number, number]
      : null
    : null;

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm p-4">
        <div className="container mx-auto flex items-center">
          <Map className="text-blue-500 mr-2" size={24} />
          <h1 className="text-xl font-bold text-gray-800">Capital Cities Challenge</h1>
        </div>
      </header>
      
      {/* Main content */}
      <main className="flex-1 container mx-auto p-4 flex flex-col md:flex-row gap-4 overflow-hidden">
        {/* Map Section - Takes most of the space */}
        <div className="flex-1 min-h-[300px] md:min-h-0 relative">
          <MapView 
            onLocationSelect={makeGuess}
            userGuessLocation={lastClickLocation}
            actualLocation={actualLocation}
            disableClicks={disableMapClicks}
          />
        </div>
        
        {/* Game Info Section */}
        <div className="w-full md:w-96 space-y-4 flex flex-col">
          <GameInfo gameState={gameState} />
          <GameControls 
            gameState={gameState}
            onStartGame={startGame}
            onNextRound={nextRound}
            onResetGame={resetGame}
          />
        </div>
      </main>
      
      {/* Footer */}
      <footer className="bg-white mt-auto p-4 border-t border-gray-200">
        <div className="container mx-auto text-center text-gray-500 text-sm">
          Capital Cities Challenge © 2025
        </div>
      </footer>
    </div>
  );
}

export default App;