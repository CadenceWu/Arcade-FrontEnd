import React, { useState, useEffect } from 'react';

const ArcadeSimulator = () => {
  const [games, setGames] = useState([]);
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState('');

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
        setError('Failed to fetch data');
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const playGame = async (cardId, game) => {
    try {
      const selectedCard = cards.find(card => card.cardId === parseInt(cardId));
      
      if (!selectedCard) {
        setError('請選擇卡片');
        return;
      }

      if (selectedCard.creditBalance < game.creditNeeded) {
        setError(`卡片 ${cardId} 代碼不足`);
        return;
      }

      // First check if user won
      const isWin = window.confirm(`遊玩 ${game.gameName} 是否獲勝？`);
      
      if (isWin) {
        // If won, deduct credits and add tickets in one transaction
        const playResponse = await fetch(`http://localhost:8080/api/cards/${cardId}/play`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            creditsToDeduct: game.creditNeeded,
            ticketsToAdd: game.ticketWon
          })
        });

        if (!playResponse.ok) {
          throw new Error('遊戲處理失敗');
        }

        setSuccess(`恭喜獲勝！獲得 ${game.ticketWon} 票券！`);
      } else {
        // If lost, only deduct credits
        const decrementResponse = await fetch(`http://localhost:8080/api/cards/${cardId}/decrement`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            amount: game.creditNeeded
          })
        });

        if (!decrementResponse.ok) {
          throw new Error('扣除代碼失敗');
        }

        setSuccess('謝謝遊玩，再接再厲！');
      }

      // Refresh cards data after game completion
      const refreshResponse = await fetch('http://localhost:8080/api/cards');
      const refreshedCards = await refreshResponse.json();
      setCards(refreshedCards);
      setError(null);

    } catch (err) {
      setError(err.message);
      setSuccess('');
    }
  };

  if (loading) return <div className="text-center p-4">Loading games...</div>;
  if (error) return <div className="text-center p-4 text-red-500">{error}</div>;

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4">Date Night Arcade</h1>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-bold mb-4">遊戲列表</h2>
          <div className="space-y-4">
            {games.map(game => (
              <div key={game.gameNumber} className="border p-4 rounded hover:bg-gray-50">
                <h3 className="font-bold mb-2">{game.gameName}</h3>
                <p>遊戲編號: #{game.gameNumber}</p>
                <p>需要代碼: {game.creditNeeded}</p>
                <p>可贏票券: {game.ticketWon}</p>
                <div className="mt-4">
                  <select 
                    className="w-full p-2 border rounded mb-2"
                    onChange={(e) => playGame(e.target.value, game)}
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

        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-bold mb-4">卡片餘額</h2>
          <div className="space-y-4">
            {cards.map(card => (
              <div key={card.cardId} className="border p-4 rounded">
                <h3 className="font-bold mb-2">卡片 #{card.cardId}</h3>
                <p>代碼餘額: {card.creditBalance}</p>
                <p>票券餘額: {card.ticketBalance}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {error && (
        <div className="mt-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}
      
      {success && (
        <div className="mt-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded">
          {success}
        </div>
      )}
    </div>
  );
};

export default ArcadeSimulator;