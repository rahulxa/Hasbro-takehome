export interface LetterData {
    score: number;
    tiles: number;
}

export interface LetterDataMap {
    [letter: string]: LetterData;
}

export interface ScrabbleResult {
    word: string;
    score: number;
}

export interface EngineInput {
    rack: string;
    boardWord?: string;
}

export type ValidationError =
    | 'RACK_EMPTY'
    | 'RACK_TOO_LONG'
    | 'RACK_INVALID_CHARS'
    | 'BOARD_WORD_INVALID_CHARS'
    | 'TILE_LIMIT_EXCEEDED'
    | 'NO_VALID_WORDS';