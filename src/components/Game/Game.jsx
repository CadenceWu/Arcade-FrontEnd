import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// Custom Dialog Component
const ConfirmDialog = ({ isOpen, onClose, onConfirm, message }) => {
  if (!isOpen) return null;

  return (
    <div className="backdrop">
      <div className="modal">
        <h3>確認刪除</h3>
        <p>{message}</p>
        <div className="button-container">
          <button onClick={onClose} className="cancel-button">取消</button>
          <button onClick={onConfirm} className="confirm-button">確認刪除</button>
        </div>
      </div>
    </div>
  );
};


const Game = () => {
  const navigate = useNavigate();
  const [games, setGames] = useState([]);
  const [error, setError] = useState(null);
  const [editingGame, setEditingGame] = useState(null);
  const [deleteGameNumber, setDeleteGameNumber] = useState(null);
  const [newGame, setNewGame] = useState({
    gameName: '',
    creditNeeded: '',
    ticketWon: ''
  });

  useEffect(() => {
    fetchGames();
  }, []);

  const fetchGames = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/games');
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      setGames(data);
    } catch (err) {
      setError('Failed to fetch games. Please try again later.');
      console.error('Error fetching games:', err);
    }
  };
  const getNextGameNumber = () => {
    if (games.length === 0) return 1;
    const maxGameNumber = Math.max(...games.map(game => parseInt(game.gameNumber)));
    return maxGameNumber + 1;
  };

  const handleNewGameSubmit = async (e) => {
    e.preventDefault();
    try {
      const gameWithNumber = {
        ...newGame,
        gameNumber: getNextGameNumber().toString()
      };

      const response = await fetch('http://localhost:8080/api/games', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(gameWithNumber),
      });

      if (!response.ok) throw new Error('Failed to create game');

      await fetchGames();
      setNewGame({ gameName: '', creditNeeded: '', ticketWon: '' });
    } catch (err) {
      setError('Failed to create game. Please try again.');
      console.error('Error creating game:', err);
    }
  };

  const handleUpdateGame = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`http://localhost:8080/api/games/${editingGame.gameNumber}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(editingGame),
      });

      if (!response.ok) throw new Error('Failed to update game');

      await fetchGames();
      setEditingGame(null);
    } catch (err) {
      setError('Failed to update game. Please try again.');
      console.error('Error updating game:', err);
    }
  };

  const handleDelete = async (gameNumber) => {
    try {
      const response = await fetch(`http://localhost:8080/api/games/${gameNumber}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Failed to delete game');

      await fetchGames();
      setDeleteGameNumber(null);
    } catch (err) {
      setError('Failed to delete game. Please try again.');
      console.error('Error deleting game:', err);
    }
  };

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div>
      <h2>遊戲設定</h2>
      <button onClick={() => navigate('/')}>返回首頁</button>

      {/* New Game Form */}
      <div>
        <h3>新增遊戲</h3>
        <form onSubmit={handleNewGameSubmit}>
          <div>
            {/* <input
              type="number"
              placeholder="遊戲編號"
              value={newGame.gameNumber}
              onChange={(e) => setNewGame({...newGame, gameNumber: e.target.value})}
              className="border p-2 rounded"
              required
            /> */}
            <input
              type="text"
              placeholder="遊戲名稱"
              value={newGame.gameName}
              onChange={(e) => setNewGame({ ...newGame, gameName: e.target.value })}
              required
            />
            <input
              type="number"
              placeholder="所需代碼"
              value={newGame.creditNeeded}
              onChange={(e) => setNewGame({ ...newGame, creditNeeded: e.target.value })}
              required
            />
            <input
              type="number"
              placeholder="贏得的票券"
              value={newGame.ticketWon}
              onChange={(e) => setNewGame({ ...newGame, ticketWon: e.target.value })}
              required
            />
            <button type="submit">確認新增</button>
          </div>
        </form>
      </div>

      {/* Games Table */}
      <div>
        <table>
          <thead>
            <tr >
              <th>遊戲編號</th>
              <th>遊戲名稱</th>
              <th>所需代碼</th>
              <th>贏得的票券</th>
              <th>操作</th>
            </tr>
          </thead>
          <tbody>
            {games.map((game) => (
              <tr key={game.gameNumber}>
                <td>{game.gameNumber}</td>
                <td>
                  {editingGame?.gameNumber === game.gameNumber ? (
                    <input
                      type="text"
                      value={editingGame.gameName}
                      onChange={(e) => setEditingGame({ ...editingGame, gameName: e.target.value })}
                    />
                  ) : game.gameName}
                </td>
                <td>
                  {editingGame?.gameNumber === game.gameNumber ? (
                    <input
                      type="number"
                      value={editingGame.creditNeeded}
                      onChange={(e) => setEditingGame({ ...editingGame, creditNeeded: e.target.value })}
                    />
                  ) : game.creditNeeded}
                </td>
                <td>
                  {editingGame?.gameNumber === game.gameNumber ? (
                    <input
                      type="number"
                      value={editingGame.ticketWon}
                      onChange={(e) => setEditingGame({ ...editingGame, ticketWon: e.target.value })}
                    />
                  ) : game.ticketWon}
                </td>
                <td>
                  {editingGame?.gameNumber === game.gameNumber ? (
                    <div>
                      <button onClick={handleUpdateGame}>儲存</button>
                      <button onClick={() => setEditingGame(null)}>取消</button>
                    </div>
                  ) : (
                    <div>
                      <button onClick={() => {
                        console.log('Editing game:', game); // Debug log here
                        setEditingGame(game);
                      }}>
                        編輯
                      </button>
                      <button onClick={() => setDeleteGameNumber(game.gameNumber)}>刪除</button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Custom Confirmation Dialog */}
      <ConfirmDialog
        isOpen={deleteGameNumber !== null}
        onClose={() => setDeleteGameNumber(null)}
        onConfirm={() => handleDelete(deleteGameNumber)}
        message="您確定要刪除這筆遊戲資料嗎？此操作無法復原。"
      />
    </div>
  );
};

export default Game;