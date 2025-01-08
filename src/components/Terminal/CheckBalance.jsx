import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from '../../styles/Setting.module.css';

const CheckBalance = () => {
  const navigate = useNavigate();
  const [checkCardId, setCheckCardId] = useState('');
  const [showBalance, setShowBalance] = useState(false);
  const [cardBalance, setCardBalance] = useState(null);
  const [error, setError] = useState('');

  const handleCheckBalance = async () => {
    setError('');

    if (!checkCardId) {
      setError('請輸入卡號');
      return;
    }

    try {
      const response = await fetch(`http://localhost:8080/api/cards/${checkCardId}`);
      if (!response.ok) {
        throw new Error('找不到該卡片');
      }
      
      const card = await response.json();
      setCardBalance(card);
      setShowBalance(true);
    } catch (err) {
      setError(err.message);
      setCardBalance(null);
      setShowBalance(false);
    }
  };

  return (
    <div>
      <div>
        <div>
          <h2 className={styles.headerTitle}>查看卡片餘額</h2>
          <button onClick={() => navigate('/')} className={styles.button}>返回首頁</button>
        </div>
        <div>
          <input
            type="number"
            placeholder="卡號"
            value={checkCardId}
            onChange={(e) => setCheckCardId(e.target.value)}
            min="1"
            required
          />
          <button onClick={handleCheckBalance} disabled={!checkCardId} className={styles.button}>查詢餘額</button>
          {showBalance && cardBalance && (
            <div style={{ textAlign: 'center' }}>
              <p>代碼餘額: {cardBalance.creditBalance}</p>
              <p>票券餘額: {cardBalance.ticketBalance}</p>
            </div>
          )}
        </div>
      </div>

      {error && (
        <div style={{ textAlign: 'center' }}>
          {error}
        </div>
      )}
    </div>
  );
};

export default CheckBalance;