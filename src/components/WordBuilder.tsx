import { useState, useCallback } from 'react';
import type { ScrabbleResult, ValidationError } from '../types';
import { findBestWord } from '../utils/scrabbleEngine';
import ResultDisplay from './ResultDisplay';

// dictionary is only fetched once per session
let dictionaryCache: string[] | null = null;

async function loadDictionary(): Promise<string[]> {
    if (dictionaryCache) return dictionaryCache;
    const response = await fetch('/dictionary.txt');
    const text = await response.text();
    dictionaryCache = text.split('\n').map(w => w.trim()).filter(Boolean);
    return dictionaryCache;
}

const WordBuilder = () => {
    const [rack, setRack] = useState('');
    const [boardWord, setBoardWord] = useState('');
    const [result, setResult] = useState<ScrabbleResult | ValidationError | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [dictError, setDictError] = useState(false);

    const handleSubmit = useCallback(async () => {
        if (!rack.trim()) return;

        setIsLoading(true);
        setResult(null);
        setDictError(false);

        try {
            const dictionary = await loadDictionary();
            const output = findBestWord({ rack, boardWord }, dictionary);
            setResult(output);
        } catch (err) {
            // Dictionary failed to load 
            console.error('Failed to load dictionary:', err);
            setDictError(true);
        } finally {
            setIsLoading(false);
        }
    }, [rack, boardWord]);

    const handleRackChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        // Strip non-letters and allow 7 letter max
        const value = e.target.value.replace(/[^a-zA-Z]/g, '').slice(0, 7);
        setRack(value.toUpperCase());
    };

    const handleBoardWordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value.replace(/[^a-zA-Z]/g, '').slice(0, 15);
        setBoardWord(value.toUpperCase());
    };

    const handleClear = () => {
        setRack('');
        setBoardWord('');
        setResult(null);
        setDictError(false);
    };

    return (
        <div className="word-builder">
            <div className="form-group">
                <label htmlFor="rack" className="form-label">
                    Your Rack
                    <span className="form-hint">1–7 letters</span>
                </label>
                <input
                    id="rack"
                    type="text"
                    className="form-input"
                    value={rack}
                    onChange={handleRackChange}
                    placeholder="e.g. AIDOORW"
                    maxLength={7}
                    autoComplete="off"
                />
            </div>

            <div className="form-group">
                <label htmlFor="boardWord" className="form-label">
                    Board Word
                    <span className="form-hint">Optional - word already on the board</span>
                </label>
                <input
                    id="boardWord"
                    type="text"
                    className="form-input"
                    value={boardWord}
                    onChange={handleBoardWordChange}
                    placeholder="e.g. WIZ"
                    maxLength={15}
                    autoComplete="off"
                />
            </div>

            <div className="form-actions">
                <button
                    className="btn-primary"
                    onClick={handleSubmit}
                    disabled={isLoading || !rack.trim()}
                >
                    {isLoading ? 'Finding...' : 'Find Best Word'}
                </button>
                <button
                    className="btn-secondary"
                    onClick={handleClear}
                    disabled={isLoading}
                >
                    Clear
                </button>
            </div>

            {dictError && (
                <div className="result-container result-error">
                    <span className="result-error-icon">✕</span>
                    <p className="result-error-message">
                        Failed to load dictionary. Please refresh and try again.
                    </p>
                </div>
            )}

            <ResultDisplay result={result} isLoading={isLoading} />
        </div>
    );
};

export default WordBuilder;