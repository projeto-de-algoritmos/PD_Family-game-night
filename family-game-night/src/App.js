import React, { useState } from 'react';
import './App.css';

function knapsackDP(time, games) {
  const n = games.length;
  const dp = Array.from({ length: n + 1 }, () => Array(time + 1).fill(0));

  for (let i = 1; i <= n; i++) {
    for (let j = 1; j <= time; j++) {
      if (j >= games[i - 1].time) {
        dp[i][j] = Math.max(dp[i - 1][j], dp[i - 1][j - games[i - 1].time] + games[i - 1].weight);
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
    i--;
  }

  return selectedGames.reverse();
}

function GameList({ games }) {
  return (
    <div id="gameList" className="scroll-container">
      <h2>Jogos Adicionados:</h2>
      {games.map((game, index) => (
        <div key={index} className="game-item">
          <span className="game-name">{game.name}</span>
          <span className="game-time">{game.time} min</span>
          <span className="game-weight">{game.weight} prio</span>
        </div>
      ))}
    </div>
  );
}

function App() {
  const [games, setGames] = useState([]);
  const [newGame, setNewGame] = useState('');
  const [newGameTime, setNewGameTime] = useState(60);
  const [newGameWeight, setNewGameWeight] = useState(1);
  const [availableTime, setAvailableTime] = useState(120);
  const [selectedGames, setSelectedGames] = useState([]);

  const addGame = () => {
    if (newGame.trim() !== '') {
      const newGameObj = { name: newGame, time: newGameTime, weight: newGameWeight };
      setGames([...games, newGameObj]);
      setSelectedGames(knapsackDP(availableTime, [...games, newGameObj]));
      setNewGame('');
      setNewGameTime(60);
      setNewGameWeight(1);
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1 className="app-title">Jogos para uma Noite de Jogos em Família</h1>

        <div className="form-container">
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

        <GameList games={games} />

        <div className="form-container">
          <label htmlFor="availableTime">Tempo Disponível (minutos):</label>
          <input
            type="number"
            id="availableTime"
            value={availableTime}
            onChange={(e) => setAvailableTime(parseInt(e.target.value, 10))}
          />
          <button onClick={() => setSelectedGames(knapsackDP(availableTime, games))}>Calcular Jogos</button>
        </div>

        <GameList games={selectedGames} />
      </header>
    </div>
  );
}

export default App;
