export interface City {
  name: string;
  country: string;
  capitalOf: string;
  latitude: number;
  longitude: number;
}

export interface GameState {
  status: 'idle' | 'playing' | 'feedback' | 'gameover';
  currentCity: City | null;
  remainingCities: City[];
  guessedCities: {
    city: City;
    distance: number; // in kilometers
    points: number;
    guessLocation: [number, number]; // [latitude, longitude]
  }[];
  totalScore: number;
  currentRound: number;
  totalRounds: number;
  lastClickLocation: [number, number] | null;
}