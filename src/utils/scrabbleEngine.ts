import letterDataJson from '../assets/letter_data.json';
import type { LetterDataMap, EngineInput, ScrabbleResult, ValidationError } from '../types';

const letterData: LetterDataMap = letterDataJson as LetterDataMap;

const ONLY_LETTERS = /^[A-Z]+$/;

const ERROR_MESSAGES: Record<ValidationError, string> = {
    RACK_EMPTY: 'Please enter at least one letter in your rack.',
    RACK_TOO_LONG: 'Your rack can only contain 1 to 7 letters.',
    RACK_INVALID_CHARS: 'Rack must contain letters only (A–Z).',
    BOARD_WORD_INVALID_CHARS: 'Board word must contain letters only (A–Z).',
    TILE_LIMIT_EXCEEDED:
        'Invalid input - a letter appears more times than available tiles allow.',
    NO_VALID_WORDS: 'No valid words found for the given rack and board word.',
};

export function getErrorMessage(error: ValidationError): string {
    return ERROR_MESSAGES[error];
}

export function validateInput(rack: string, boardWord?: string): ValidationError | null {
    const cleanRack = rack.trim().toUpperCase();
    const cleanBoard = boardWord?.trim().toUpperCase() ?? '';

    if (cleanRack.length === 0) return 'RACK_EMPTY';
    if (cleanRack.length > 7) return 'RACK_TOO_LONG';
    if (!ONLY_LETTERS.test(cleanRack)) return 'RACK_INVALID_CHARS';
    if (cleanBoard && !ONLY_LETTERS.test(cleanBoard)) return 'BOARD_WORD_INVALID_CHARS';

    // Combined letter count across rack + board word must not exceed
    // the number of physical tiles available in the game per letter
    const letterCount: Record<string, number> = {};
    for (const char of cleanRack + cleanBoard) {
        letterCount[char] = (letterCount[char] ?? 0) + 1;
    }

    for (const [letter, count] of Object.entries(letterCount)) {
        if (count > letterData[letter].tiles) return 'TILE_LIMIT_EXCEEDED';
    }

    return null;
}

export function scoreWord(word: string): number {
    return word
        .toUpperCase()
        .split('')
        .reduce((total, letter) => total + (letterData[letter]?.score ?? 0), 0);
}

// Checks if a candidate word can be formed using letters from the rack and board word
// Board word letters are used first and then rack letters fill the rest
function canFormWord(candidate: string, rack: string, boardWord: string): boolean {
    const rackLetters = rack.split('');
    const boardLetters = boardWord.split('');

    for (const letter of candidate) {
        const boardIdx = boardLetters.indexOf(letter);
        if (boardIdx !== -1) {
            boardLetters.splice(boardIdx, 1);
            continue;
        }

        const rackIdx = rackLetters.indexOf(letter);
        if (rackIdx !== -1) {
            rackLetters.splice(rackIdx, 1);
            continue;
        }

        return false;
    }

    return true;
}

export function findBestWord(
    input: EngineInput,
    dictionary: string[]
): ScrabbleResult | ValidationError {
    const rack = input.rack.trim().toUpperCase();
    const boardWord = input.boardWord?.trim().toUpperCase() ?? '';

    const error = validateInput(rack, boardWord);
    if (error) return error;

    let bestWord: string | null = null;
    let bestScore = -1;

    for (const word of dictionary) {
        const candidate = word.trim().toUpperCase();

        if (candidate.length < 2 || candidate.length > 15) continue;
        if (!ONLY_LETTERS.test(candidate)) continue;
        if (!canFormWord(candidate, rack, boardWord)) continue;

        const wordScore = scoreWord(candidate);

        // Higher score wins / alphabetical order breaks ties
        if (wordScore > bestScore || (wordScore === bestScore && bestWord && candidate < bestWord)) {
            bestScore = wordScore;
            bestWord = candidate;
        }
    }

    if (!bestWord) return 'NO_VALID_WORDS';

    return { word: bestWord, score: bestScore };
}