# Scrabble Word Builder

A web application that finds the highest scoring valid Scrabble word from a given set of letters, with an optional word already placed on the board.

## Tech Stack

- React + TypeScript
- Vite 
- Plain CSS

## Getting Started

Prerequisites: Node.js v18 or higher

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

Open `http://localhost:****` in your browser.


## How to Use

The Rack - Enter 1 to 7 letters on your rack.

Board Word (optional) - Enter a word already on the board that you want to build upon. The app will combine your rack letters with this word to find the best possible play.

Find Best Word - Returns the highest scoring valid word. If multiple words tie on score, the one that comes first alphabetically is returned.

## Examples

Rack: AIDOORW, Board Word: WIZ → WIZARD (19 pts)
Rack: AIDOORW, Board Word: none → DRAW (8 pts)
Rack: AIDOORZ, Board Word: QUIZ → Invalid, Z tile limit exceeded
Rack: AIDOORWZ, Board Word: none → Invalid, rack exceeds 7 letters

## Project Structure

src/assets/letter_data.json - Scrabble letter scores and tile counts
src/components/WordBuilder.tsx - Main form, rack input, board word, submit
src/components/ResultDisplay.tsx - Renders result tiles or error message
src/components/LetterTile.tsx - Individual tile component
src/utils/scrabbleEngine.ts - Core logic, validation, scoring, word search
src/types/index.ts - TypeScript types
public/dictionary.txt - TWL06 Scrabble word list, total 172820 words

## Assumptions & Design Decisions

**Dictionary**
Used the TWL06 (Tournament Word List) - the official North American Scrabble competition dictionary with 172,820 valid words. This felt like the right call given the Scrabble context, and it ensures every word the app returns is a legit Scrabble play.


**Letter Scoring & Tile Counts**
THe file letter_data.json uses the official Scrabble tile values and distribution (e.g. Z=10 points, 1 tile; A=1 point, 9 tiles). These are the values I have found Hasbro uses in the physical game so it felt using anything else would be inaccurate.


**Board Word Letter Consumption**
When building on a board word, the scrabble engine used board word letters first before using the words from the rack. I have kept it the same as how Scrabble actually works, the board word is already placed, so those letters are available to extend from.


**Tile Limit Validation**
The combined letter count across rack and board word is checked against the total tiles available in the game. For example, there is only one Z tile in Scrabble, so if Z appears in both the rack and the board word, the input is rejected as invalid. This is checked before any word search runs.


**Ignored spec**
Blank tiles, bonus squares (double/triple letter/word), and board layout or word positioning are not implemented, as specified in the requirements.


**Dictionary Caching**
The dictionary is fetched once and cached in memory for the particular session. From there any search reuse the cached list rather than re-fetching the file.


**Alphabetical Tiebreaking**
When multiple words share the highest score, the one that comes first alphabetically is returned.