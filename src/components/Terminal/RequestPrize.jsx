import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

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

const RequestPrize = () => {
  const navigate = useNavigate();
  const [selectedCard, setSelectedCard] = useState('');
  const [selectedPrize, setSelectedPrize] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [prizes, setPrizes] = useState([]);
  const [cards, setCards] = useState([]);

  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    try {
      const [prizesResponse, cardsResponse] = await Promise.all([
        fetch('http://localhost:8080/api/prizes'),
        fetch('http://localhost:8080/api/cards')
      ]);

      if (!prizesResponse.ok || !cardsResponse.ok) {
        throw new Error('Failed to fetch data');
      }

      const prizesData = await prizesResponse.json();
      const cardsData = await cardsResponse.json();

      setPrizes(prizesData);
      setCards(cardsData);
    } catch (err) {
      setError('Failed to fetch data. Please try again later.');
      console.error('Error fetching data:', err);
    }
  };

  const handleRequestPrize = async () => {
    setError('');
    setSuccess('');

    if (!selectedCard || !selectedPrize) {
      setError('請選擇卡片和獎品');
      return;
    }

    const card = cards.find(c => c.cardId === parseInt(selectedCard));
    const prize = prizes.find(p => p.prizeNumber === parseInt(selectedPrize));

    if (!card || !prize) {
      setError('無效的卡片或獎品選擇');
      return;
    }

    if (card.ticketBalance < prize.requiredTickets) {
      setError(`票券不足。需要 ${prize.requiredTickets} 票券，但卡片只有 ${card.ticketBalance} 票券`);
      return;
    }

    try {
      const response = await fetch('http://localhost:8080/api/terminal/requestPrize', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          cardId: parseInt(selectedCard),
          prizeNumber: parseInt(selectedPrize)
        })
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText);
      }

      const successMessage = await response.text();
      setSuccess(`${successMessage} 扣除 ${prize.requiredTickets} 票券`);
      console.log(successMessage);
      setSelectedCard('');
      setSelectedPrize('');

      // Refresh data after successful exchange
      fetchInitialData();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div>
      <div>
        <div>
          <h2>兌換獎品</h2>
          <button onClick={() => navigate('/')}>返回首頁</button>
        </div>
        <div>
          <div>
            <label>選擇卡片</label>
            <select
              value={selectedCard}
              onChange={(e) => setSelectedCard(e.target.value)}
            >
              <option value="" disabled>選擇要使用的卡片</option>
              {cards.map(card => (
                <option key={card.cardId} value={card.cardId}>
                  卡片 #{card.cardId} (票券: {card.ticketBalance})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label>選擇獎品</label>
            <select
              value={selectedPrize}
              onChange={(e) => setSelectedPrize(e.target.value)}
            >
              <option value="" disabled>選擇獎品</option>
              {prizes.map(prize => (
                <option key={prize.prizeNumber} value={prize.prizeNumber}>
                  {prize.prizeName} (需要票券: {prize.requiredTickets})
                </option>
              ))}
            </select>
          </div>

          <button
            onClick={handleRequestPrize}
            disabled={!selectedCard || !selectedPrize}
          >
            兌換獎品
          </button>
        </div>
      </div>

      {/* Prizes Table */}
      <div>
        <table>
          <thead>
            <tr>
              <th>獎品編號</th>
              <th>獎品名稱</th>
              <th>所需兌換票券</th>
              <th>剩餘數量</th>
            </tr>
          </thead>
          <tbody>
            {prizes.map((prize) => (
              <tr key={prize.prizeNumber}>
                <td>{prize.prizeNumber}</td>
                <td>{prize.prizeName}</td>
                <td>{prize.requiredTickets}</td>
                <td>{prize.stockQuantity}</td>
              </tr>
            ))}
          </tbody>
        </table>
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
    </div>
  );
};

export default RequestPrize;