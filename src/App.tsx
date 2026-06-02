import WordBuilder from './components/WordBuilder';
import './App.css';

const App = () => {
  return (
    <div className="app">
      <header className="app-header">
        <div className="header-content">
          <h1 className="app-title">
            <span className="title-scrabble">Scrabble</span>
            <span className="title-word">Word Builder</span>
          </h1>
          <p className="app-subtitle">
            Find the highest scoring word from your rack
          </p>
        </div>
      </header>

      <main className="app-main">
        <div className="app-card">
          <WordBuilder />
        </div>
      </main>

      <footer className="app-footer">
        <p>Hasbro Take Home Coding Challenge</p>
      </footer>
    </div>
  );
};

export default App;