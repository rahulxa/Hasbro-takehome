import letterDataJson from '../assets/letter_data.json';
import type { ScrabbleResult, ValidationError, LetterDataMap } from '../types';
import { getErrorMessage } from '../utils/scrabbleEngine';
import LetterTile from './LetterTile';

const letterData = letterDataJson as LetterDataMap;

interface Props {
    result: ScrabbleResult | ValidationError | null;
    isLoading?: boolean;
}

const ResultDisplay = ({ result, isLoading = false }: Props) => {
    if (isLoading) {
        return (
            <div className="result-container result-loading">
                <p>Finding best word...</p>
            </div>
        );
    }

    if (result === null) return null;

    // It's a ValidationError if it's a string
    if (typeof result === 'string') {
        return (
            <div className="result-container result-error">
                <span className="result-error-icon">✕</span>
                <p className="result-error-message">{getErrorMessage(result)}</p>
            </div>
        );
    }

    return (
        <div className="result-container result-success">
            <p className="result-label">Best Word</p>
            <div className="result-tiles">
                {result.word.split('').map((letter, index) => (
                    <LetterTile
                        key={index}
                        letter={letter}
                        letterData={letterData[letter.toUpperCase()]}
                        highlighted
                    />
                ))}
            </div>
            <p className="result-score">
                Total Score: <strong>{result.score}</strong>
            </p>
        </div>
    );
};

export default ResultDisplay;