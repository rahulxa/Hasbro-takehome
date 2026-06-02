import type { LetterData } from '../types';

interface Props {
    letter: string;
    letterData: LetterData;
    highlighted?: boolean;
}

const LetterTile = ({ letter, letterData }: Props) => {
    return (
        <div className="letter-tile">
            <span className="tile-letter">{letter.toUpperCase()}</span>
            <span className="tile-score">{letterData.score}</span>
        </div>
    );
};

export default LetterTile;