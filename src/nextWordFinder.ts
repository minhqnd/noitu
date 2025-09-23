import { WordPair, WordDictionary, NextWordResult } from './types';
import { WordChecker } from './wordChecker';

/**
 * NextWordFinder class for finding the next word in the chain
 */
export class NextWordFinder {
  private dictionary: WordDictionary;
  private wordChecker: WordChecker;

  constructor(dictionary: WordDictionary) {
    this.dictionary = dictionary;
    this.wordChecker = new WordChecker(dictionary);
  }

  /**
   * Find the next word based on current word and game history
   */
  findNextWord(
    currentWord: WordPair | null,
    history: WordPair[] = []
  ): NextWordResult {
    if (!currentWord) {
      // First word - pick a random word from dictionary
      return this.findFirstWord();
    }

    const possibleWords = this.wordChecker.getPossibleNextWords(currentWord.second);

    if (possibleWords.length === 0) {
      return {
        word: null,
        found: false
      };
    }

    // Filter out words that are already in history
    const availableWords = possibleWords.filter(word => {
      return !history.some(historyWord =>
        this.normalizeVietnamese(historyWord.first.toLowerCase()) === this.normalizeVietnamese(word.first.toLowerCase()) &&
        this.normalizeVietnamese(historyWord.second.toLowerCase()) === this.normalizeVietnamese(word.second.toLowerCase())
      );
    });

    if (availableWords.length === 0) {
      return {
        word: null,
        found: false,
        alternatives: possibleWords
      };
    }

    // Select random word from available options
    const selectedWord = availableWords[Math.floor(Math.random() * availableWords.length)];

    return {
      word: selectedWord,
      found: true,
      alternatives: availableWords.slice(0, 5) // Return up to 5 alternatives
    };
  }

  /**
   * Find a random first word to start the game
   */
  private findFirstWord(): NextWordResult {
    const allWords = Object.keys(this.dictionary);
    if (allWords.length === 0) {
      return { word: null, found: false };
    }

    const randomFirstWord = allWords[Math.floor(Math.random() * allWords.length)];
    const secondWords = this.dictionary[randomFirstWord];

    if (!secondWords || secondWords.length === 0) {
      return { word: null, found: false };
    }

    const randomSecondWord = secondWords[Math.floor(Math.random() * secondWords.length)];

    return {
      word: {
        first: randomFirstWord,
        second: randomSecondWord
      },
      found: true
    };
  }

  /**
   * Get all possible moves for the current position
   */
  getAllPossibleMoves(currentWord: WordPair | null, history: WordPair[] = []): WordPair[] {
    if (!currentWord) {
      // Return a few random starting words
      const allWords = Object.keys(this.dictionary);
      const randomWords: WordPair[] = [];

      for (let i = 0; i < Math.min(10, allWords.length); i++) {
        const randomIndex = Math.floor(Math.random() * allWords.length);
        const firstWord = allWords[randomIndex];
        const secondWords = this.dictionary[firstWord];

        if (secondWords && secondWords.length > 0) {
          const secondWord = secondWords[Math.floor(Math.random() * secondWords.length)];
          randomWords.push({
            first: firstWord,
            second: secondWord
          });
        }
      }

      return randomWords;
    }

    const possibleWords = this.wordChecker.getPossibleNextWords(currentWord.second);

    // Filter out words that are already in history
    return possibleWords.filter(word => {
      return !history.some(historyWord =>
        this.normalizeVietnamese(historyWord.first.toLowerCase()) === this.normalizeVietnamese(word.first.toLowerCase()) &&
        this.normalizeVietnamese(historyWord.second.toLowerCase()) === this.normalizeVietnamese(word.second.toLowerCase())
      );
    });
  }

  /**
   * Check if the game can continue from current position
   */
  canContinue(currentWord: WordPair | null, history: WordPair[] = []): boolean {
    const possibleMoves = this.getAllPossibleMoves(currentWord, history);
    return possibleMoves.length > 0;
  }

  /**
   * Normalize Vietnamese text for comparison
   */
  private normalizeVietnamese(text: string): string {
    return text
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/đ/g, 'd')
      .replace(/Đ/g, 'D');
  }
}