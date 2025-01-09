import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from '../styles/Setting.module.css';

const MessageDialog = ({ message, type, onClose }) => {
  if (!message) return null;

  const isError = type === 'error';

  return (
    <div className={styles.backdrop} onClick={(e) => e.stopPropagation()}>
      <div className={styles.modal}>
        <h3>{isError ? '錯誤' : ''}</h3>
        <p>{message}</p>
        <div className={styles['button-container']}>
          <button onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onClose();
          }} className={styles['cancel-button']}>確定</button>
        </div>
      </div>
    </div>
  );
};

const ConfirmDialog = ({ isOpen, onClose, onYes, onNo }) => {
  if (!isOpen) return null;

  return (
    <div className={styles.backdrop}>
      <div className={styles.modal}>
        <h3>是否贏得遊戲</h3>
        <div className={styles['button-container']}>
          <button onClick={onNo} className={styles.button}>否</button>
          <button onClick={onYes} className={styles.button}>是</button>
          <button onClick={onClose} className={styles.button}>取消</button>
        </div>
      </div>
    </div>
  );
};

const ArcadePlayGame = () => {
  const navigate = useNavigate();
  const [games, setGames] = useState([]);
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState('');
  const [fetchError, setFetchError] = useState(null);
  const [selectedGame, setSelectedGame] = useState(null);
  const [selectedCardId, setSelectedCardId] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  // Add state to track selected cards for each game
  const [selectedCards, setSelectedCards] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [gamesResponse, cardsResponse] = await Promise.all([
          fetch('http://localhost:8080/api/games'),
          fetch('http://localhost:8080/api/cards')
        ]);

        if (!gamesResponse.ok) throw new Error('Failed to fetch games');
        if (!cardsResponse.ok) throw new Error('Failed to fetch cards');

        const gamesData = await gamesResponse.json();
        const cardsData = await cardsResponse.json();

        setGames(gamesData);
        setCards(cardsData);
        setLoading(false);
      } catch (err) {
        setFetchError('Failed to fetch data');
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const resetSelection = (gameNumber) => {
    setSelectedCards(prev => ({
      ...prev,
      [gameNumber]: ''
    }));
  };

  const handleYes = async () => {
    setIsDialogOpen(false);
    try {
      const playResponse = await fetch(`http://localhost:8080/api/terminal/playGame/${selectedCardId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          creditsToDeduct: selectedGame.creditNeeded,
          ticketsToAdd: selectedGame.ticketWon,
        }),
      });

      if (!playResponse.ok) {
        throw new Error('遊戲處理失敗');
      }

      setSuccess(`恭喜獲勝！獲得 ${selectedGame.ticketWon} 票券！ 扣除 ${selectedGame.creditNeeded} 代碼`);

      // Refresh cards data
      const refreshResponse = await fetch('http://localhost:8080/api/cards');
      const refreshedCards = await refreshResponse.json();
      setCards(refreshedCards);
      resetSelection(selectedGame.gameNumber);
      setError(null);
    } catch (err) {
      setError(err.message);
      setSuccess('');
      resetSelection(selectedGame.gameNumber);
    }
  };

  const handleNo = async () => {
    setIsDialogOpen(false);
    try {
      const decrementResponse = await fetch(`http://localhost:8080/api/cards/${selectedCardId}/decrement`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: selectedGame.creditNeeded,
        }),
      });

      if (!decrementResponse.ok) {
        throw new Error('扣除代碼失敗');
      }

      setSuccess(`謝謝遊玩，再接再厲！扣除 ${selectedGame.creditNeeded} 代碼`);

      // Refresh cards data
      const refreshResponse = await fetch('http://localhost:8080/api/cards');
      const refreshedCards = await refreshResponse.json();
      setCards(refreshedCards);
      resetSelection(selectedGame.gameNumber);
      setError(null);
    } catch (err) {
      setError(err.message);
      setSuccess('');
      resetSelection(selectedGame.gameNumber);
    }
  };

  const handleDialogClose = () => {
    setIsDialogOpen(false);
    resetSelection(selectedGame.gameNumber);
  };

  const playGame = async (e, game) => {
    e.preventDefault();
    const cardId = e.target.value;
    
    if (!cardId) {
      return;
    }

    const selectedCard = cards.find(card => card.cardId === parseInt(cardId));

    if (!selectedCard) {
      setError('請選擇卡片');
      resetSelection(game.gameNumber);
      return;
    }

    if (selectedCard.creditBalance < game.creditNeeded) {
      setError(`卡片 ${cardId} 代碼不足`);
      resetSelection(game.gameNumber);
      return;
    }

    setSelectedGame(game);
    setSelectedCardId(cardId);
    setIsDialogOpen(true);
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div>載入中...</div>
      </div>
    );
  }

  return (
    <div className="arcade-container">
      {fetchError && (
        <div className="fetch-error-banner">
          {fetchError}
        </div>
      )}

      <div>
        <h2 className={styles.headerTitle}>遊戲列表</h2>
      </div>

      <div>
        <div>
          <button onClick={() => navigate('/')} className={styles.button}>返回首頁</button>
          <div>
            {games.map(game => (
              <div key={game.gameNumber} className={styles.chooseGame}>
                <h3>{game.gameName}</h3>
                <p>遊戲編號: #{game.gameNumber}</p>
                <p>需要代碼: {game.creditNeeded}</p>
                <p>可贏票券: {game.ticketWon}</p>
                <div>
                  <select
                    className={styles.select}
                    value={selectedCards[game.gameNumber] || ''}
                    onChange={(e) => {
                      setSelectedCards(prev => ({...prev,[game.gameNumber]: e.target.value}));
                      playGame(e, game);
                    }}
                  >
                    <option value="" className={styles.option}>選擇要使用的卡片</option>
                    {cards.map(card => (
                      <option key={card.cardId} value={card.cardId}>
                        卡片 #{card.cardId} (代碼: {card.creditBalance} / 票券: {card.ticketBalance})
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h2 style={{ textAlign: 'center'}}>卡片餘額</h2>
          <div className={styles.cardsContainer}>
            {cards.map(card => (
              <div key={card.cardId} className={styles.card}>
                <div>
                  <h3>Card #{card.cardId}</h3>
                </div>
                <div>
                  <div>
                    <span>代碼:</span>
                    <span>{card.creditBalance}</span>
                    <span>&nbsp;&nbsp;</span>
                    <span>票券:</span>
                    <span>{card.ticketBalance}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <MessageDialog
        message={error}
        type="error"
        onClose={() => {
          setError('');
          if (selectedGame) {
            resetSelection(selectedGame.gameNumber);
          }
        }}
      />

      <MessageDialog
        message={success}
        type="success"
        onClose={() => {
          setSuccess('');
          if (selectedGame) {
            resetSelection(selectedGame.gameNumber);
          }
        }}
      />
      
      <ConfirmDialog
        isOpen={isDialogOpen}
        onYes={handleYes}
        onNo={handleNo}
        onClose={handleDialogClose}
      />
    </div>
  );
};

export default ArcadePlayGame;