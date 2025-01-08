import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from '../../styles/Setting.module.css';

const MessageDialog = ({ message, type, onClose }) => {
  if (!message) return null;

  const isError = type === 'error';

  return (
    <div className={styles.backdrop}>
      <div className={styles.modal}>
        <h3>{isError ? '錯誤提示' : '成功!!!!'}</h3>
        <p>{message}</p>
        <div className={styles['button-container']}>
          <button onClick={onClose} className={styles.button}>確定</button>
        </div>
      </div>
    </div>
  );
};

const TransferBalance = () => {
  const navigate = useNavigate();
  const [sourceCardId, setSourceCardId] = useState('');
  const [targetCardId, setTargetCardId] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(true);

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

  useEffect(() => {
    fetchCards();
  }, [success]); // Refetch cards when a transfer is successful

  const validateTransfer = () => {
    if (!sourceCardId && !targetCardId) {
      setError('請輸入來源卡號和目標卡號');
      return false;
    }

    if (!sourceCardId) {
      setError('請輸入來源卡號');
      return false;
    }

    if (!targetCardId) {
      setError('請輸入目標卡號');
      return false;
    }

    if (sourceCardId === targetCardId) {
      setError('來源卡號和目標卡號不能相同');
      return false;
    }

    return true;
  };

  const handleTransfer = async (type) => {
    setError('');
    setSuccess('');

    if (!validateTransfer()) {
      return;
    }

    try {
      const response = await fetch(`http://localhost:8080/api/terminal/transfer${type}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          sourceCardId: parseInt(sourceCardId),
          targetCardId: parseInt(targetCardId)
        })
      });

      const data = await response.text();

      if (!response.ok) {
        throw new Error(data || `轉換失敗: ${response.status}`);
      }

      setSuccess(`${type === 'Credits' ? '代碼' : '票券'}轉換成功！`);
      setSourceCardId('');
      setTargetCardId('');
      // Cards will be refetched due to success state change in useEffect
    } catch (err) {
      setError(err.message);
    }
  };

  const handleSourceCardChange = (e) => {
    const value = e.target.value;
    setSourceCardId(value);
    if (value && value === targetCardId) {
      setError('來源卡號和目標卡號不能相同');
    } else {
      setError('');
    }
  };

  const handleTargetCardChange = (e) => {
    const value = e.target.value;
    setTargetCardId(value);
    if (value && value === sourceCardId) {
      setError('來源卡號和目標卡號不能相同');
    } else {
      setError('');
    }
  };

  return (
    <div>
      <div>
        <div>
          <h2 className={styles.headerTitle}>轉換代碼或票券</h2>
          <button onClick={() => navigate('/')} className={styles.button}>返回首頁</button>
        </div>
        <div>
          <input
            type="number"
            placeholder="來源卡號"
            value={sourceCardId}
            onChange={handleSourceCardChange}
            min="1"
            required
          />
          <input
            type="number"
            placeholder="目標卡號"
            value={targetCardId}
            onChange={handleTargetCardChange}
            min="1"
            required
          />
          <div>
            <button
              onClick={() => handleTransfer('Credits')}
              className={styles.button}
            >
              轉換代碼
            </button>
            <button
              onClick={() => handleTransfer('Tickets')}
              className={styles.button}
            >
              轉換票券
            </button>
          </div>
        </div>
      </div>

      {loading ? (
        <div>載入中...</div>
      ) : (
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
      )}

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

export default TransferBalance;