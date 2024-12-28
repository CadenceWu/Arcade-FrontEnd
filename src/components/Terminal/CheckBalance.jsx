import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

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
    <div className="p-6 max-w-2xl mx-auto">
      <div className="p-4 border rounded bg-gray-50">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">查看卡片餘額</h2>
          <button 
            onClick={() => navigate('/')}
            className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
          >
            返回首頁
          </button>
        </div>
        <div className="space-y-2">
          <input
            type="number"
            placeholder="卡號"
            value={checkCardId}
            onChange={(e) => setCheckCardId(e.target.value)}
            className="w-full p-2 border rounded"
            min="1"
            required
          />
          <button 
            className="w-full p-2 bg-yellow-500 text-white rounded hover:bg-yellow-600 disabled:bg-yellow-300"
            onClick={handleCheckBalance}
            disabled={!checkCardId}
          >
            查詢餘額
          </button>
          {showBalance && cardBalance && (
            <div className="mt-2 p-2 bg-white rounded border">
              <p>代碼餘額: {cardBalance.creditBalance}</p>
              <p>票券餘額: {cardBalance.ticketBalance}</p>
            </div>
          )}
        </div>
      </div>

      {error && (
        <div className="mt-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}
    </div>
  );
};

export default CheckBalance;