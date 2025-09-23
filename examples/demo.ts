/**
 * Example usage of noitu package
 * Demonstrates how to use the library with the built-in Vietnamese dictionary
 */

import { createWordChecker, createNextWordFinder, loadDictionary, WordPair } from '../src/index';

async function main() {
  try {
    console.log('🎮 Word Connection Game Demo\n');

    // Load the Vietnamese dictionary
    console.log('📚 Loading dictionary...');
    const dictionary = await loadDictionary();

    console.log(`✅ Loaded dictionary with ${Object.keys(dictionary).length} unique words\n`);

    // Create game instances
    const wordChecker = createWordChecker(dictionary);
    const nextWordFinder = createNextWordFinder(dictionary);

    // Example 1: Validate a word pair
    console.log('🔍 Example 1: Word Validation');
    const testWords = ['thế giới', 'hello world', 'thế', 'thế chân thật'];

    for (const word of testWords) {
      const result = wordChecker.validateWord(word);
      console.log(`"${word}": ${result.isValid ? '✅ Valid' : '❌ Invalid'} ${result.error ? `(${result.error})` : ''}`);
    }

    console.log();

    // Example 2: Find next words
    console.log('🎯 Example 2: Next Word Finding');

    // Start with a random word
    const firstWord = nextWordFinder.findNextWord(null);
    if (firstWord.found && firstWord.word) {
      console.log(`🎲 Starting word: "${firstWord.word.first} ${firstWord.word.second}"`);

      // Find next possible words
      const nextWords = nextWordFinder.getAllPossibleMoves(firstWord.word);
      console.log(`📋 Possible next words: ${nextWords.slice(0, 5).map(w => `"${w.first} ${w.second}"`).join(', ')}`);

      // Find next word with history tracking
      const gameHistory: WordPair[] = [firstWord.word];
      const next = nextWordFinder.findNextWord(firstWord.word, gameHistory);
        if (next.found && next.word) {
          console.log(`🎮 Next word (with history): "${next.word.first} ${next.word.second}"`);
          gameHistory.push(next.word);
        }
    }

    console.log();

    // Example 3: Game simulation
    console.log('🎲 Example 3: Simple Game Simulation');
    let currentWord = firstWord.word;
    const gameHistory: WordPair[] = [];

    if (currentWord) {
      gameHistory.push(currentWord);
      console.log(`Start: ${currentWord.first} ${currentWord.second}`);

      // Simulate 3 moves
      for (let i = 0; i < 3; i++) {
        const next = nextWordFinder.findNextWord(currentWord, gameHistory);
        if (next.found && next.word) {
          currentWord = next.word;
          gameHistory.push(currentWord);
          console.log(`Move ${i + 1}: ${currentWord.first} ${currentWord.second}`);
        } else {
          console.log(`Move ${i + 1}: No more moves available!`);
          break;
        }
      }

      console.log(`\n🏆 Game history: ${gameHistory.map(w => `${w.first} ${w.second}`).join(' → ')}`);
    }

    console.log('\n✨ Demo completed successfully!');

  } catch (error) {
    console.error('❌ Error:', error);
  }
}

// Run the demo
main();