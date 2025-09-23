import { WordPair, WordDictionary, ValidationResult } from './types';

/**
 * WordChecker class for validating Vietnamese word connections
 */
export class WordChecker {
  private dictionary: WordDictionary;
  private normalizedDictionary: Map<string, string[]>;

  constructor(dictionary: WordDictionary) {
    this.dictionary = dictionary;
    this.normalizedDictionary = new Map();

    // Pre-normalize dictionary for faster lookups
    for (const [key, values] of Object.entries(dictionary)) {
      const normalizedKey = this.normalizeVietnamese(key.toLowerCase());
      this.normalizedDictionary.set(normalizedKey, values.map(v => v.toLowerCase()));
    }
  }

  /**
   * Validate if a word pair is in correct format (2 words)
   */
  private validateFormat(input: string): { isValid: boolean; words?: string[] } {
    const trimmed = input.trim();
    if (!trimmed) {
      return { isValid: false };
    }

    // Split by space and filter out empty strings
    const words = trimmed.split(/\s+/).filter(word => word.length > 0);

    if (words.length !== 2) {
      return { isValid: false };
    }

    // Check if words contain only Vietnamese characters and spaces
    const vietnameseRegex = /^[a-zA-Zàáảãạăằắẳẵặâầấẩẫậđèéẻẽẹêềếểễệìíỉĩịòóỏõọôồốổỗộơờớởỡợùúủũụưừứửữựỳýỷỹỵ\s]+$/;

    if (!vietnameseRegex.test(words[0]) || !vietnameseRegex.test(words[1])) {
      return { isValid: false };
    }

    return { isValid: true, words };
  }

  /**
   * Check if a word pair exists in the dictionary
   */
  private isWordInDictionary(firstWord: string, secondWord: string): boolean {
    const normalizedFirst = this.normalizeVietnamese(firstWord.toLowerCase());
    const normalizedSecond = secondWord.toLowerCase();

    const secondWords = this.normalizedDictionary.get(normalizedFirst);
    return secondWords?.includes(normalizedSecond) || false;
  }

  /**
   * Normalize Vietnamese text (remove accents for comparison)
   */
  private normalizeVietnamese(text: string): string {
    return text
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/đ/g, 'd')
      .replace(/Đ/g, 'D');
  }

  /**
   * Validate a word pair input
   */
  validateWord(input: string, usedWords: Set<string> = new Set()): ValidationResult {
    // Check format first
    const formatCheck = this.validateFormat(input);
    if (!formatCheck.isValid) {
      return {
        isValid: false,
        reason: 'invalid_format',
        error: 'Từ phải gồm đúng 2 chữ cách nhau bởi dấu cách'
      };
    }

    const [firstWord, secondWord] = formatCheck.words!;

    // Check if word exists in dictionary
    if (!this.isWordInDictionary(firstWord, secondWord)) {
      return {
        isValid: false,
        reason: 'word_not_found',
        error: `Từ "${firstWord} ${secondWord}" không có trong từ điển`
      };
    }

    // Check if word has been used
    const wordKey = `${this.normalizeVietnamese(firstWord.toLowerCase())}-${this.normalizeVietnamese(secondWord.toLowerCase())}`;
    if (usedWords.has(wordKey)) {
      return {
        isValid: false,
        reason: 'word_used',
        error: 'Từ này đã được sử dụng trong game'
      };
    }

    return { isValid: true };
  }

  /**
   * Check if two word pairs can connect (second word of first pair matches first word of second pair)
   */
  canConnect(firstPair: WordPair, secondPair: WordPair): boolean {
    const firstEnd = this.normalizeVietnamese(firstPair.second.toLowerCase());
    const secondStart = this.normalizeVietnamese(secondPair.first.toLowerCase());

    return firstEnd === secondStart;
  }

  /**
   * Get all possible next words for a given ending word
   */
  getPossibleNextWords(endingWord: string): WordPair[] {
    const normalizedEnding = this.normalizeVietnamese(endingWord.toLowerCase());
    const possiblePairs: WordPair[] = [];

    // Find all word pairs that start with the ending word
    for (const [firstWord, secondWords] of Object.entries(this.dictionary)) {
      if (this.normalizeVietnamese(firstWord.toLowerCase()) === normalizedEnding) {
        for (const secondWord of secondWords) {
          possiblePairs.push({
            first: firstWord,
            second: secondWord
          });
        }
      }
    }

    return possiblePairs;
  }

  /**
   * Check if a word pair can be connected to the current game state
   */
  validateConnection(currentWord: WordPair | null, newWord: WordPair): ValidationResult {
    if (!currentWord) {
      // First word in game - always valid
      return { isValid: true };
    }

    if (!this.canConnect(currentWord, newWord)) {
      return {
        isValid: false,
        reason: 'no_connection',
        error: `Từ "${newWord.first} ${newWord.second}" không nối được với "${currentWord.second}"`
      };
    }

    return { isValid: true };
  }
}