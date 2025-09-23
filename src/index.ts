/**
 * Vietnamese Word Connection Game Library
 *
 * A comprehensive library for creating word connection games in Vietnamese.
 * Supports word validation, next word finding, and game state management.
 */

import { WordChecker } from './wordChecker';
import { NextWordFinder } from './nextWordFinder';
import { WordDictionary } from './types';

export { WordChecker } from './wordChecker';
export { NextWordFinder } from './nextWordFinder';
export * from './types';

// Re-export types for convenience
export type {
  WordPair,
  WordDictionary,
  GameState,
  ValidationResult,
  NextWordResult,
  GameConfig,
  GameStats
} from './types';

/**
 * Create a new WordChecker instance
 * @param dictionary - The word dictionary to use for validation
 * @returns A new WordChecker instance
 */
export function createWordChecker(dictionary: WordDictionary) {
  return new WordChecker(dictionary);
}

/**
 * Create a new NextWordFinder instance
 * @param dictionary - The word dictionary to use for finding next words
 * @returns A new NextWordFinder instance
 */
export function createNextWordFinder(dictionary: WordDictionary) {
  return new NextWordFinder(dictionary);
}

/**
 * Utility function to load dictionary from JSON file
 * @param customDictionaryPath - Optional path to a custom JSON dictionary file to extend the built-in dictionary
 * @returns Promise resolving to the loaded dictionary (built-in + custom merged, built-in takes priority)
 */
export async function loadDictionary(customDictionaryPath?: string): Promise<WordDictionary> {
  try {
    const fs = require('fs/promises');
    const path = require('path');

    // Always load the built-in Vietnamese dictionary first
    const builtInPath = path.join(__dirname, '..', 'assets', 'wordPairs.json');
    const builtInData = await fs.readFile(builtInPath, 'utf-8');
    const builtInDictionary: WordDictionary = JSON.parse(builtInData);

    // If custom dictionary path provided, load and merge it
    if (customDictionaryPath) {
      try {
        const customData = await fs.readFile(customDictionaryPath, 'utf-8');
        const customDictionary: WordDictionary = JSON.parse(customData);

        // Merge dictionaries: built-in takes priority, custom extends it
        const mergedDictionary: WordDictionary = { ...builtInDictionary };

        // Add custom entries for keys that don't exist in built-in, or merge arrays
        for (const [key, values] of Object.entries(customDictionary)) {
          if (!mergedDictionary[key]) {
            // Key doesn't exist in built-in, add from custom
            mergedDictionary[key] = [...values];
          } else {
            // Key exists in both, merge arrays without duplicates
            const existingValues = new Set(mergedDictionary[key]);
            for (const value of values) {
              if (!existingValues.has(value)) {
                mergedDictionary[key].push(value);
              }
            }
          }
        }

        return mergedDictionary;
      } catch (customError) {
        console.warn(`Warning: Failed to load custom dictionary from ${customDictionaryPath}: ${customError}`);
        console.warn('Using built-in dictionary only.');
        // Fall back to built-in dictionary only
      }
    }

    return builtInDictionary;
  } catch (error) {
    throw new Error(`Failed to load dictionary: ${error}`);
  }
}

/**
 * Utility function to validate dictionary format
 * @param dictionary - The dictionary to validate
 * @returns True if dictionary is valid, false otherwise
 */
export function validateDictionary(dictionary: any): dictionary is WordDictionary {
  if (!dictionary || typeof dictionary !== 'object') {
    return false;
  }

  for (const [key, value] of Object.entries(dictionary)) {
    if (typeof key !== 'string' || !Array.isArray(value)) {
      return false;
    }

    for (const item of value) {
      if (typeof item !== 'string') {
        return false;
      }
    }
  }

  return true;
}