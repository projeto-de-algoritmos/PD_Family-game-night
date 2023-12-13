import React, { useState, useEffect } from 'react';
import './App.css';

function knapsackDP(time, games) {
  if (isNaN(time) || time <= 0 || games.length === 0) {
    return [];
  }

  const n = games.length;
  const dp = Array.from({ length: n + 1 }, () => Array(time + 1).fill(0));

  for (let i = 1; i <= n; i++) {
    for (let j = 1; j <= time; j++) {
      if (games[i - 1].time <= j) {
        dp[i][j] = Math.max(dp[i - 1][j], games[i - 1].weight + dp[i - 1][j - games[i - 1].time]);
      } else {
        dp[i][j] = dp[i - 1][j];
      }
    }
  }

  let i = n;
  let j = time;
  const selectedGames = [];

  while (i > 0 && j > 0) {
    if (dp[i][j] !== dp[i - 1][j]) {
      selectedGames.push(games[i - 1]);
      j -= games[i - 1].time;
    }
    i -= 1;
  }

  return selectedGames.reverse();
}

function GameList({ games, title, onRemoveGame }) {
  return (
    <div className="game-list">
      <h2>{title}</h2>
      {games.map((game, index) => (
        <div key={index} className="game-item">
          <span className="game-details">
            <span className="game-name" style={{ marginRight: '8px', fontSize: '1em' }}>
              {game.name}
            </span>
            <span className="game-time" style={{ color: 'orange', fontSize: '1em' }}>
              ({game.time} min)
            </span>
            {game.weight && (
              <span className="game-weight" style={{ color: 'orange', fontSize: '1em', marginLeft: '8px' }}>
                Prio: {convertToStars(game.weight)}
              </span>
            )}
            <button onClick={() => onRemoveGame(index)}>Remover</button>
          </span>
        </div>
      ))}
    </div>
  );
}


const convertToStars = (numStars) => {
  const nonNegativeStars = Math.max(0, numStars);
  const clampedStars = Math.min(5, nonNegativeStars);
  return '★'.repeat(clampedStars) + '☆'.repeat(5 - clampedStars);
};

function App() {
  const [games, setGames] = useState([]);
  const [newGame, setNewGame] = useState('');
  const [newGameTime, setNewGameTime] = useState(60);
  const [newGameWeight, setNewGameWeight] = useState(2);
  const [newGameWeight, setNewGameWeight] = useState('★★☆☆☆');



  useEffect(() => {
    const selectedGames = knapsackDP(availableTime, games);
    console.log('Jogos Selecionados:', selectedGames);
  }, [availableTime, games]);


  const addGame = () => {
    if (newGame.trim() !== '') {
      const newGameObj = { name: newGame, time: newGameTime, weight: newGameWeight };
      setGames([...games, newGameObj]);
      setNewGame('');
      setNewGameTime(60);
      setNewGameWeight(2); 

    }
  };

  const removeGame = (indexToRemove) => {
    const updatedGames = games.filter((_, index) => index !== indexToRemove);
    setGames(updatedGames);
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1 className="app-title">Jogos para uma Noite de Jogos em Família</h1>

        <div className="form-container">
          <label htmlFor="availableTime">Tempo Disponível (minutos):</label>
          <input
            type="number"
            id="availableTime"
            value={availableTime}
            onChange={(e) => setAvailableTime(parseInt(e.target.value, 10))}
          />
          
          <input
            type="text"
            placeholder="Novo Jogo"
            value={newGame}
            onChange={(e) => setNewGame(e.target.value)}
          />
          <input
            type="number"
            placeholder="Tempo (minutos)"
            value={newGameTime}
            onChange={(e) => setNewGameTime(parseInt(e.target.value, 10))}
          />
          <input
            type="number"
            placeholder="Prioridade (peso)"
            value={newGameWeight}
            onChange={(e) => setNewGameWeight(parseInt(e.target.value, 10))}
          />
          <button onClick={addGame}>Adicionar</button>
        </div>

        <div className="columns-container">
          <GameList games={games} title="Jogos na Lista" onRemoveGame={removeGame} />
          {availableTime > 0 && (
            <GameList games={knapsackDP(availableTime, games)} title="Jogos Selecionados" onRemoveGame={removeGame} />
          )}
        </div>
      </header>
    </div>
  );
}

export default App;