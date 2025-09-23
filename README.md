# Word Connection Game

[![npm version](https://badge.fury.io/js/noitu.svg)](https://badge.fury.io/js/noitu)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

A comprehensive TypeScript library for creating Vietnamese word connection games. Supports word validation, next word finding with history tracking, and game state management.

## ✨ Features

- **Word Validation**: Validate Vietnamese word pairs and their connections
- **Next Word Finding**: Intelligent word suggestion with history tracking to prevent repetition
- **Vietnamese Support**: Full support for Vietnamese characters and accents
- **TypeScript**: Full TypeScript support with type definitions
- **Game State Management**: Built-in game state tracking and validation
- **Dictionary Management**: Load and validate word dictionaries from JSON files

## 🚀 Installation

```bash
npm install noitu
```

## 📖 Usage

### Basic Setup

```typescript
import { createWordChecker, createNextWordFinder, loadDictionary } from 'noitu';

// Load built-in Vietnamese dictionary (default)
const dictionary = await loadDictionary();

// Create instances
const wordChecker = createWordChecker(dictionary);
const nextWordFinder = createNextWordFinder(dictionary);
```

### Using Custom Dictionary (Extension)

You can extend the built-in dictionary with custom word pairs. The built-in dictionary always takes priority - if a word exists in both dictionaries, the built-in version is used. Custom dictionary only provides additional words that are not found in the built-in dictionary:

```typescript
import { createWordChecker, createNextWordFinder, loadDictionary } from 'noitu';

// Load built-in dictionary extended with custom dictionary
const dictionary = await loadDictionary('./path/to/custom-dictionary.json');

// The dictionary now contains:
// - All words from built-in dictionary (wordPairs.json)
// - Additional words from custom dictionary (only if they don't exist in built-in)
// - For overlapping words, built-in dictionary takes priority

const wordChecker = createWordChecker(dictionary);
const nextWordFinder = createNextWordFinder(dictionary);
```

### Using the Built-in Vietnamese Dictionary

The package includes a comprehensive Vietnamese dictionary with 58,000+ word pairs that loads by default. When you provide a custom dictionary path, it extends the built-in dictionary with additional word pairs. The built-in dictionary takes priority for any overlapping entries.

```typescript
import { createWordChecker, createNextWordFinder, loadDictionary } from 'noitu';

// Load the built-in Vietnamese dictionary (no path needed)
const dictionary = await loadDictionary();

const wordChecker = createWordChecker(dictionary);
const nextWordFinder = createNextWordFinder(dictionary);

// Now you can validate Vietnamese words!
const result = wordChecker.validateWord('thế giới');
console.log(result.isValid); // true or false
```

### Word Validation

```typescript
// Validate a word pair
const result = wordChecker.validateWord('thế chân');

if (result.isValid) {
  console.log('Valid word!');
} else {
  console.log('Error:', result.error);
}

// Check connection between words
const word1 = { first: 'thế', second: 'chân' };
const word2 = { first: 'chân', second: 'thật' };

if (wordChecker.canConnect(word1, word2)) {
  console.log('Words can connect!');
}
```

### Finding Next Words

```typescript
// Find next word with history tracking
const currentWord = { first: 'thế', second: 'chân' };
const gameHistory: WordPair[] = [{ first: 'thế', second: 'chân' }]; // Track used words

const result = nextWordFinder.findNextWord(currentWord, gameHistory);

if (result.found && result.word) {
  console.log('Next word:', result.word.first, result.word.second);
  console.log('Alternatives:', result.alternatives);
}
```

### Game State Management

```typescript
import { GameState } from 'noitu';

const gameState: GameState = {
  currentWord: null,
  history: [],
  isGameActive: true
};

// Start new game
const firstWord = nextWordFinder.findNextWord(null, []);
if (firstWord.found && firstWord.word) {
  gameState.currentWord = firstWord.word;
  gameState.history.push(firstWord.word);
}
```

## 📚 Examples

Check out the `examples/` directory for complete usage examples:

- `examples/demo.ts` - Comprehensive demo with Vietnamese dictionary

Run the demo:

```bash
npx ts-node examples/demo.ts
```

### Classes

#### `WordChecker`
- `validateWord(input: string, usedWords?: Set<string>): ValidationResult`
- `canConnect(firstPair: WordPair, secondPair: WordPair): boolean`
- `getPossibleNextWords(endingWord: string): WordPair[]`
- `validateConnection(currentWord: WordPair | null, newWord: WordPair): ValidationResult`

#### `NextWordFinder`
- `findNextWord(currentWord: WordPair | null, history?: WordPair[]): NextWordResult`
- `getAllPossibleMoves(currentWord: WordPair | null, history?: WordPair[]): WordPair[]`
- `canContinue(currentWord: WordPair | null, history?: WordPair[]): boolean`

### Types

```typescript
interface WordPair {
  first: string;
  second: string;
}

interface WordDictionary {
  [firstWord: string]: string[];
}

interface ValidationResult {
  isValid: boolean;
  error?: string;
  reason?: 'invalid_format' | 'word_not_found' | 'word_used' | 'no_connection' | 'invalid_characters';
}
```

### Utility Functions

- `createWordChecker(dictionary: WordDictionary): WordChecker`
- `createNextWordFinder(dictionary: WordDictionary): NextWordFinder`
- `loadDictionary(customDictionaryPath?: string): Promise<WordDictionary>`
- `validateDictionary(dictionary: any): dictionary is WordDictionary`

## 📝 Dictionary Format

The dictionary should be a JSON object where keys are starting words and values are arrays of possible ending words:

```json
{
  "thế": ["chân", "giới", "hệ"],
  "chân": ["thật", "trời", "thành"],
  "trời": ["xanh", "đất", "biến"]
}
```

## 🧪 Testing

```bash
npm test
```

## 🏗️ Building

```bash
npm run build
```

## 📄 License

MIT License - see the [LICENSE](LICENSE) file for details.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📞 Support

If you have any questions or issues, please open an issue on GitHub.

---

**Made with ❤️ for Vietnamese word game enthusiasts**