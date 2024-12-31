import React, { useState, useEffect } from 'react';

const MessageDialog = ({ message, type, onClose }) => {
  if (!message) return null;

  const isError = type === 'error';

  return (
    <div className="backdrop" onClick={(e) => e.stopPropagation()}>
      <div className={`modal ${type}-modal`}>
        <h3>{isError ? '錯誤' : ''}</h3>
        <p>{message}</p>
        <div className="button-container">
          <button onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onClose();
          }} className={`ok-button ${type}-button`}>確定</button>
        </div>
      </div>
    </div>
  );
};

const ConfirmDialog = ({ isOpen, onClose, onYes, onNo }) => {
  if (!isOpen) return null;

  return (
    <div className="backdrop">
      <div className="modal">
        <h3>是否贏得遊戲</h3>
        <div className="button-container">
          <button onClick={onNo}>否</button>
          <button onClick={onYes}>是</button>
          <button onClick={onClose}>取消</button>
        </div>
      </div>
    </div>
  );
};

const ArcadePlayGame = () => {
  const [games, setGames] = useState([]);
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState('');
  const [fetchError, setFetchError] = useState(null);
  const [selectedGame, setSelectedGame] = useState(null);
  const [selectedCardId, setSelectedCardId] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

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

  const handleYes = async (e, cardId, game) => {
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
      setError(null);
    } catch (err) {
      setError(err.message);
      setSuccess('');
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
      setError(null);
    } catch (err) {
      setError(err.message);
      setSuccess('');
    }
  };


  const playGame = async (e, cardId, game) => {
    e.preventDefault();
    const selectedCard = cards.find(card => card.cardId === parseInt(cardId));

    if (!selectedCard) {
      setError('請選擇卡片');
      return;
    }

    if (selectedCard.creditBalance < game.creditNeeded) {
      setError(`卡片 ${cardId} 代碼不足`);
      return;
    }

    setSelectedGame(game);
    setSelectedCardId(cardId);
    setIsDialogOpen(true);
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div>Loading games...</div>
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
        <h1>遊戲列表</h1>
      </div>

      <div>
        <div>
          <div>
            {games.map(game => (
              <div key={game.gameNumber} className="card">
                <h3>{game.gameName}</h3>
                <p>遊戲編號: #{game.gameNumber}</p>
                <p>需要代碼: {game.creditNeeded}</p>
                <p>可贏票券: {game.ticketWon}</p>
                <div>
                  <select
                    onChange={(e) => playGame(e, e.target.value, game)}
                    defaultValue=""
                  >
                    <option value="" disabled>選擇要使用的卡片</option>
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
          <h2>卡片餘額</h2>
          <div>
            {cards.map(card => (
              <div key={card.cardId} className="card">
                <h3>卡片 #{card.cardId}</h3>
                <p>代碼餘額: {card.creditBalance}</p>
                <p>票券餘額: {card.ticketBalance}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <MessageDialog
        message={error}
        type="error"
        onClose={() => setError('')}
      />

      <MessageDialog
        message={success}
        type="success"
        onClose={() => setSuccess('')}
      />
      <ConfirmDialog
        isOpen={isDialogOpen}
        onYes={handleYes}
        onNo={handleNo}
        onClose={() => setIsDialogOpen(false)}
      />
    </div>
  );
};

export default ArcadePlayGame;