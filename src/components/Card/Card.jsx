import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from '../../styles/Setting.module.css';

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

const ErrorDialog = ({ message, onClose }) => {
  if (!message) return null;

  return (
    <div className={styles.backdrop}>
      <div className={styles.modal}>
        <h3>錯誤提示</h3>
        <p>{message}</p>
        <div className={styles['button-container']}>
          <button onClick={onClose} className={styles['cancel-button']}>確定</button>
        </div>
      </div>
    </div>
  );
};

const Card = () => {
  const navigate = useNavigate();
  const [cards, setCards] = useState([]);
  const [error, setError] = useState(null);
  const [creditAmounts, setCreditAmounts] = useState({});
  const [deleteCardId, setDeleteCardId] = useState(null);
  const [loading, setLoading] = useState(true); // Added loading state

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
      setError(null); // Clear any existing errors
    } catch (err) {
      console.error('Error fetching cards:', err);
      setError('Failed to fetch cards. Please try again later.');
    } finally {
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
      const response = await fetch(`http://localhost:8080/api/cards/${cardId}/increment`, {
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
      if (!amount || isNaN(amount) || amount <= 0) {
        setError('請輸入有效的代碼數量');
        return;
      }
      
      if (card.creditBalance < amount) {
        setError('代碼不足');
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
      setCreditAmounts(prev => ({ ...prev, [cardId]: '' }));
      setError(null);
    } catch (err) {
      setError('減少代碼失敗，請稍後再試。');
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

  const handleCustomCredits = (cardId, operation) => {
    const amount = creditAmounts[cardId];
    if (amount && !isNaN(amount) && parseInt(amount) > 0) {
      if (operation === 'add') {
        addCredits(cardId, parseInt(amount));
      } else if (operation === 'decrease') {
        decrementCredits(cardId, parseInt(amount));
      }
    }
  };

  return (
    <div>
      <div className={styles.gameContainer}>
        <h1 className={styles.headerTitle}>遊戲卡管理</h1>
        <div>
          <button onClick={() => navigate('/')} className={styles.button}>返回首頁</button>
          <button onClick={addNewCard} className={styles.button}>新增遊戲卡</button>
        </div>
      </div>

      <div>
        {cards.map(card => (
          <div key={card.cardId} className={styles.card}>
            <div>
              <h3>Card #{card.cardId}</h3>
              <button onClick={() => setDeleteCardId(card.cardId)} className={styles.deleteBtn}>刪除</button>
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

            <div>
              <div>
                <button onClick={() => addCredits(card.cardId, 1)} className={styles.button}>+1代碼</button>
                <button onClick={() => decrementCredits(card.cardId, 1)} className={styles.button}>-1代碼</button>
              </div>
              
              <div>
                <input
                  type="number"
                  value={creditAmounts[card.cardId] || ''}
                  onChange={(e) => handleCreditAmountChange(card.cardId, e.target.value)}
                  placeholder="輸入代碼"
                  min="1"
                />
                <button onClick={() => handleCustomCredits(card.cardId, 'add')} className={styles.button}>加入</button>
                <button onClick={() => handleCustomCredits(card.cardId, 'decrease')} className={styles.button}>減少</button>
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
       <ErrorDialog
        message={error}
        onClose={() => setError(null)}
      />

    </div>
  );
};

export default Card;