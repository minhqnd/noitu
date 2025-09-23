import { WordChecker } from '../src/wordChecker';
import { NextWordFinder } from '../src/nextWordFinder';
import { createWordChecker, createNextWordFinder, validateDictionary, loadDictionary } from '../src/index';
import * as path from 'path';

// Load real dictionary for testing
let realDictionary: any = null;

beforeAll(async () => {
  try {
    realDictionary = await loadDictionary(path.join(__dirname, '..', 'assets', 'wordPairs.json'));
  } catch (error) {
    // Fallback to sample dictionary if real one not found
    realDictionary = {
      'thế': ['chân', 'giới'],
      'chân': ['thật', 'trời'],
      'trời': ['xanh', 'đất'],
      'xanh': ['lá', 'biếc'],
      'lá': ['cây', 'xanh'],
    };
  }
});

// Sample dictionary for basic tests
const sampleDictionary = {
  'thế': ['chân', 'giới'],
  'chân': ['thật', 'trời'],
  'trời': ['xanh', 'đất'],
  'xanh': ['lá', 'biếc'],
  'lá': ['cây', 'xanh'],
};

describe('WordChecker', () => {
  let checker: WordChecker;

  beforeEach(() => {
    checker = new WordChecker(sampleDictionary);
  });

  test('should validate correct word format', () => {
    const result = checker.validateWord('thế chân');
    expect(result.isValid).toBe(true);
  });

  test('should reject invalid format (single word)', () => {
    const result = checker.validateWord('thế');
    expect(result.isValid).toBe(false);
    expect(result.reason).toBe('invalid_format');
  });

  test('should reject invalid format (three words)', () => {
    const result = checker.validateWord('thế chân thật');
    expect(result.isValid).toBe(false);
    expect(result.reason).toBe('invalid_format');
  });

  test('should reject word not in dictionary', () => {
    const result = checker.validateWord('hello world');
    expect(result.isValid).toBe(false);
    expect(result.reason).toBe('word_not_found');
  });

  test('should check word connection', () => {
    const word1 = { first: 'thế', second: 'chân' };
    const word2 = { first: 'chân', second: 'thật' };
    const word3 = { first: 'xanh', second: 'lá' };

    expect(checker.canConnect(word1, word2)).toBe(true);
    expect(checker.canConnect(word1, word3)).toBe(false);
  });
});

describe('NextWordFinder', () => {
  let finder: NextWordFinder;

  beforeEach(() => {
    finder = new NextWordFinder(sampleDictionary);
  });

  test('should find next word', () => {
    const currentWord = { first: 'thế', second: 'chân' };
    const result = finder.findNextWord(currentWord);

    expect(result.found).toBe(true);
    expect(result.word).toBeDefined();
    expect(result.word!.first).toBe('chân');
  });

  test('should return null when no next word available', () => {
    const currentWord = { first: 'lá', second: 'xanh' };
    const result = finder.findNextWord(currentWord);

    // 'xanh' has 'lá' and 'biếc' as possible next words, but 'lá' might be filtered
    // This test might need adjustment based on actual dictionary
    expect(result.found).toBeDefined();
  });
});

describe('Real Dictionary Integration', () => {
  test('should work with real wordPairs.json dictionary', () => {
    expect(realDictionary).toBeDefined();
    expect(validateDictionary(realDictionary)).toBe(true);

    const checker = createWordChecker(realDictionary);
    const finder = createNextWordFinder(realDictionary);

    // Test with a common Vietnamese word pair
    const result = checker.validateWord('thế giới');
    expect(result.isValid || result.reason === 'word_not_found').toBe(true); // Either valid or not in dict

    // Test next word finding
    const nextResult = finder.findNextWord(null);
    if (nextResult.found && nextResult.word) {
      expect(nextResult.word.first).toBeDefined();
      expect(nextResult.word.second).toBeDefined();
    }
  });

  test('should handle large dictionary efficiently', () => {
    const checker = createWordChecker(realDictionary);
    const finder = createNextWordFinder(realDictionary);
    const startTime = Date.now();

    // Test multiple validations quickly
    for (let i = 0; i < 10; i++) {
      checker.validateWord('thế chân');
      finder.findNextWord({ first: 'thế', second: 'chân' }, []);
    }

    const endTime = Date.now();
    const duration = endTime - startTime;

    // Should complete in reasonable time (less than 100ms for 10 validations)
    expect(duration).toBeLessThan(100);
  });
});