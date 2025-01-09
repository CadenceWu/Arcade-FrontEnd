import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from '../../styles/Setting.module.css';

// Custom Dialog Component
const ConfirmDialog = ({ isOpen, onClose, onConfirm, message }) => {
  if (!isOpen) return null;

  return (
    <div className={styles.backdrop}>
      <div className={styles.modal}>
        <h3>確認刪除</h3>
        <p>{message}</p>
        <div className={styles['button-container']}>
          <button onClick={onClose} className={styles['cancel-button']}>取消</button>
          <button onClick={onConfirm} className={styles['confirm-button']}>確認刪除</button>
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
    //find the largest number in the array
    const maxGameNumber = Math.max(...games.map(game => parseInt(game.gameNumber)));
    return maxGameNumber + 1;
  };

  const handleNewGameSubmit = async (e) => {
    e.preventDefault(); //stop the form from reloading the page when submitted.
    try {
      const gameWithNumber = {
        ...newGame,
        gameNumber: getNextGameNumber()
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
    <div className={styles.gameContainer}>
      <h2 className={styles.headerTitle}>遊戲設定</h2>
      <button onClick={() => navigate('/')} className={styles.button}>返回首頁</button>

      {/* New Game Form */}
      <div>
        <h3>新增遊戲</h3>
        <form onSubmit={handleNewGameSubmit}>
          <div>
            <input
              type="text"
              placeholder="遊戲名稱"
              value={newGame.gameName}
              onChange={(e) => setNewGame({ ...newGame, gameName: e.target.value })}
              required
              onInvalid={(e) => e.target.setCustomValidity('請填寫遊戲名稱')}
              onInput={(e) => e.target.setCustomValidity('')} // Reset message when user starts typing
            />
            <input
              type="number"
              placeholder="所需代碼"
              value={newGame.creditNeeded}
              onChange={(e) => setNewGame({ ...newGame, creditNeeded: e.target.value })}
              required
              onInvalid={(e) => e.target.setCustomValidity('請填寫所需代碼')}
              onInput={(e) => e.target.setCustomValidity('')}
            />
            <input
              type="number"
              placeholder="贏得的票券"
              value={newGame.ticketWon}
              onChange={(e) => setNewGame({ ...newGame, ticketWon: e.target.value })}
              required
              onInvalid={(e) => e.target.setCustomValidity('請填寫贏得的票券')}
              onInput={(e) => e.target.setCustomValidity('')}
            />
            <button type="submit" className={styles.button}>確認新增</button>
          </div>
        </form>
      </div>

      {/* Games Table */}
      <div>
        <table className={styles.gameTable}>
          <thead>
            <tr >
              <th className={styles.tableHeader}>遊戲編號</th>
              <th className={styles.tableHeader}>遊戲名稱</th>
              <th className={styles.tableHeader}>所需代碼</th>
              <th className={styles.tableHeader}>贏得的票券</th>
              <th className={styles.tableHeader}></th>
            </tr>
          </thead>
          <tbody>
            {games.map((game) => (
              <tr key={game.gameNumber} className={styles.tableRow}>
                <td className={styles.tableCell}>{game.gameNumber}</td>
                <td className={styles.tableCell}>
                  {/*optional changing. It safely accesses gameNumber even if editingGame is null or undefined*/}
                  {editingGame?.gameNumber === game.gameNumber ? (
                    <input
                      type="text"
                      value={editingGame.gameName}
                      onChange={(e) => setEditingGame({ ...editingGame, gameName: e.target.value })}
                    />
                  ) : game.gameName}
                </td>
                <td className={styles.tableCell}>
                  {editingGame?.gameNumber === game.gameNumber ? (
                    <input
                      type="number"
                      value={editingGame.creditNeeded}
                      onChange={(e) => setEditingGame({ ...editingGame, creditNeeded: e.target.value })}
                    />
                  ) : game.creditNeeded}
                </td>
                <td className={styles.tableCell}>
                  {editingGame?.gameNumber === game.gameNumber ? (
                    <input
                      type="number"
                      value={editingGame.ticketWon}
                      onChange={(e) => setEditingGame({ ...editingGame, ticketWon: e.target.value })}
                    />
                  ) : game.ticketWon}
                </td>
                <td className={styles.tableCell}>
                  {editingGame?.gameNumber === game.gameNumber ? (
                    <div>
                      <button onClick={handleUpdateGame} className={styles.button}>儲存</button>
                      <button onClick={() => setEditingGame(null)} className={styles.button}>取消</button>
                    </div>
                  ) : (
                    <div>
                      <button onClick={() => { setEditingGame(game); }} className={styles.button}>編輯</button>
                      <button onClick={() => setDeleteGameNumber(game.gameNumber)} className={styles.deleteBtn}>刪除</button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Custom Confirmation Dialog.*/}
      {/* {deleteGameNumber !== null} set the value of the isOpen prop*/}
      {/* When clicking 刪除button, deleteGameNumber gets set to the gameNumber(is not null)*/}
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