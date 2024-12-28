import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const ConfirmDialog = ({ isOpen, onClose, onConfirm, message }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg">
        <h3 className="text-lg font-bold mb-4">確認</h3>
        <p className="mb-4">{message}</p>
        <div className="flex justify-end gap-4">
          <button onClick={onClose} className="px-4 py-2 bg-gray-200 rounded">取消</button>
          <button onClick={onConfirm} className="px-4 py-2 bg-red-500 text-white rounded">確認</button>
        </div>
      </div>
    </div>
  );
};

const Card = () => {
  const navigate = useNavigate();
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [creditAmounts, setCreditAmounts] = useState({});
  const [deleteCardId, setDeleteCardId] = useState(null);
  const [feedbackMessage, setFeedbackMessage] = useState(null);

  useEffect(() => {
    fetchCards();
  }, []);

  const fetchCards = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/cards');
      if (!response.ok) {
        throw new Error('Failed to fetch cards');
      }
      const data = await response.json();
      setCards(data);
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch cards. Please try again later.');
      setLoading(false);
    }
  };
  const getNextCardNumber = () => {
    if (cards.length === 0) return 1;
    const maxCardNumber = Math.max(...cards.map(card => parseInt(card.cardId)));
    return maxCardNumber + 1;
  };

  const addNewCard = async () => {
    try {
      const cardWithNumber = {
        cardId: getNextCardNumber(),
        creditBalance: 0,
        ticketBalance: 0
      };

      const response = await fetch('http://localhost:8080/api/cards', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(cardWithNumber)
      });
      
      if (!response.ok) {
        throw new Error('Failed to create card');
      }
      
      const newCard = await response.json();
      setCards([...cards, newCard]);
      setError(null);
    } catch (err) {
      setError('Failed to create new card. Please try again.');
    }
  };

  const addCredits = async (cardId, amount) => {
    try {
      const response = await fetch(`http://localhost:8080/api/cards/${cardId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ amount: amount })
      });

      if (!response.ok) {
        throw new Error('Failed to add credits');
      }

      const updatedCard = await response.json();
      setCards(cards.map(card => 
        card.cardId === cardId ? updatedCard : card
      ));
      setCreditAmounts(prev => ({ ...prev, [cardId]: '' }));
      setError(null);
    } catch (err) {
      setError('Failed to add credits. Please try again.');
    }
  };

  const decrementCredits = async (cardId, amount) => {
    try {
      const card = cards.find(c => c.cardId === cardId);
      if (card.creditBalance < amount) {
        setError('積分不足');
        return;
      }

      const response = await fetch(`http://localhost:8080/api/cards/${cardId}/decrement`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ amount: amount })
      });

      if (!response.ok) {
        throw new Error('Failed to decrement credits');
      }

      const updatedCard = await response.json();
      setCards(cards.map(card => 
        card.cardId === cardId ? updatedCard : card
      ));
      setError(null);
    } catch (err) {
      setError('Failed to decrement credits. Please try again.');
    }
  };

  const deleteCard = async (cardId) => {
    try {
      const response = await fetch(`http://localhost:8080/api/cards/${cardId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete card');
      }

      setCards(cards.filter(card => card.cardId !== cardId));
      setDeleteCardId(null);
      setError(null);
    } catch (err) {
      setError('Failed to delete card. Please try again.');
    }
  };

  const handleCreditAmountChange = (cardId, value) => {
    setCreditAmounts(prev => ({
      ...prev,
      [cardId]: value
    }));
  };

  const handleCustomCredits = (cardId) => {
    const amount = creditAmounts[cardId];
    if (amount && !isNaN(amount) && parseInt(amount) > 0) {
      addCredits(cardId, parseInt(amount));
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-xl text-gray-600">Loading cards...</p>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">遊戲卡管理</h1>
        <div className="space-x-4">
          <button onClick={() => navigate('/')}>返回首頁</button>
          <button onClick={addNewCard}>新增遊戲卡</button>
        </div>
      </div>

      {error && (
        <div>
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {cards.map(card => (
          <div key={card.cardId} className="card border rounded-lg p-6 bg-white shadow">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold">Card #{card.cardId}</h3>
              <button 
                onClick={() => setDeleteCardId(card.cardId)}
                className="text-red-500 hover:text-red-700"
              >
                刪除
              </button>
            </div>
            
            <div className="space-y-2 mb-4">
              <div className="flex justify-between">
                <span>積分:</span>
                <span>{card.creditBalance}</span>
              </div>
              <div className="flex justify-between">
                <span>票券:</span>
                <span>{card.ticketBalance}</span>
              </div>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-2">
                <button onClick={() => addCredits(card.cardId, 5)}>加入 5 積分</button>
                <button onClick={() => addCredits(card.cardId, 10)}>加入 10 積分</button>
                <button onClick={() => decrementCredits(card.cardId, 5)}>減少 5 積分</button>
                <button onClick={() => decrementCredits(card.cardId, 10)}>減少 10 積分</button>
              </div>
              
              <div className="flex space-x-2">
                <input
                  type="number"
                  value={creditAmounts[card.cardId] || ''}
                  onChange={(e) => handleCreditAmountChange(card.cardId, e.target.value)}
                  placeholder="輸入積分"
                  min="1"
                  className="flex-1"
                />
                <button onClick={() => handleCustomCredits(card.cardId)}>加入</button>
              </div>
              
            </div>
          </div>
        ))}
      </div>

      <ConfirmDialog
        isOpen={deleteCardId !== null}
        onClose={() => setDeleteCardId(null)}
        onConfirm={() => deleteCard(deleteCardId)}
        message="確定要刪除此遊戲卡嗎？此操作無法復原。"
      />
    </div>
  );
};

export default Card;