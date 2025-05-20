import { City, GameState } from '../types';

// Calculate the distance between two points in kilometers using the Haversine formula
export function calculateDistance(
  lat1: number, 
  lon1: number, 
  lat2: number, 
  lon2: number
): number {
  const R = 6371; // Radius of the earth in km
  const dLat = deg2rad(lat2 - lat1);
  const dLon = deg2rad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;
  return Math.round(distance); // Return in kilometers rounded to the nearest integer
}

function deg2rad(deg: number): number {
  return deg * (Math.PI / 180);
}

// Calculate score based on distance: closer = higher score
export function calculateScore(distance: number): number {
  // Maximum score of 1000 for direct hit, decreasing as distance increases
  // At 10,000km or more, score is 0
  const maxScore = 1000;
  const maxDistance = 10000; // km
  
  if (distance <= 10) return maxScore; // Bonus for very close guesses
  
  const score = Math.max(0, Math.round(maxScore * (1 - distance / maxDistance)));
  return score;
}

// Shuffle and select a subset of cities for the game
export function initializeGameCities(cities: City[], totalRounds: number): City[] {
  // Shuffle the cities array
  const shuffled = [...cities].sort(() => 0.5 - Math.random());
  // Return only the number needed for the game
  return shuffled.slice(0, totalRounds);
}

// Initialize a new game
export function initializeGame(cities: City[], totalRounds: number = 10): GameState {
  const gameCities = initializeGameCities(cities, totalRounds);
  
  return {
    status: 'idle',
    currentCity: null,
    remainingCities: gameCities,
    guessedCities: [],
    totalScore: 0,
    currentRound: 0,
    totalRounds,
    lastClickLocation: null,
  };
}

// Start a new round
export function startNextRound(state: GameState): GameState {
  if (state.remainingCities.length === 0) {
    return {
      ...state,
      status: 'gameover',
      currentCity: null
    };
  }

  const nextCity = state.remainingCities[0];
  const remainingCities = state.remainingCities.slice(1);

  return {
    ...state,
    status: 'playing',
    currentCity: nextCity,
    remainingCities,
    currentRound: state.currentRound + 1,
    lastClickLocation: null,
  };
}

// Process a guess
export function processGuess(
  state: GameState, 
  clickLocation: [number, number]
): GameState {
  if (!state.currentCity || state.status !== 'playing') {
    return state;
  }

  const distance = calculateDistance(
    clickLocation[0], 
    clickLocation[1], 
    state.currentCity.latitude, 
    state.currentCity.longitude
  );
  
  const points = calculateScore(distance);
  
  const guessedCity = {
    city: state.currentCity,
    distance,
    points,
    guessLocation: clickLocation,
  };
  
  return {
    ...state,
    status: 'feedback',
    guessedCities: [...state.guessedCities, guessedCity],
    totalScore: state.totalScore + points,
    lastClickLocation: clickLocation,
  };
}