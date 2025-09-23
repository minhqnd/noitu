/**
 * Types and interfaces for the Vietnamese Word Connection Game
 */

export interface WordPair {
  first: string;
  second: string;
}

export interface WordDictionary {
  [firstWord: string]: string[];
}

export interface GameState {
  currentWord: WordPair | null;
  usedWords: Set<string>;
  history: WordPair[];
  isGameActive: boolean;
}

export interface ValidationResult {
  isValid: boolean;
  error?: string;
  reason?: 'invalid_format' | 'word_not_found' | 'word_used' | 'no_connection' | 'invalid_characters';
}

export interface NextWordResult {
  word: WordPair | null;
  found: boolean;
  alternatives?: WordPair[];
}

export interface GameConfig {
  maxHistorySize?: number;
  allowRepeatedWords?: boolean;
  strictValidation?: boolean;
}

export interface GameStats {
  totalGames: number;
  totalMoves: number;
  averageMovesPerGame: number;
  longestChain: number;
  shortestChain: number;
}