import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const RequestPrize = () => {
  const navigate = useNavigate();
  const [cardId, setCardId] = useState('');
  const [prizeNumber, setPrizeNumber] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleRequestPrize = async () => {
    setError('');
    setSuccess('');

    if (!cardId || !prizeNumber) {
      setError('請輸入卡號和獎品編號');
      return;
    }

    try {
      const response = await fetch('http://localhost:8080/api/terminal/requestPrize', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          cardId: parseInt(cardId),
          prizeNumber: parseInt(prizeNumber)
        })
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText);
      }

      const successMessage = await response.text();
      setSuccess(successMessage);
      setCardId('');
      setPrizeNumber('');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <div className="p-4 border rounded bg-gray-50">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">兌換獎品</h2>
          <button 
            onClick={() => navigate('/')}
            className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
          >
            返回
          </button>
        </div>
        <div className="space-y-2">
          <input
            type="number"
            placeholder="卡號"
            value={cardId}
            onChange={(e) => setCardId(e.target.value)}
            className="w-full p-2 border rounded"
            min="1"
            required
          />
          <input
            type="number"
            placeholder="獎品編號"
            value={prizeNumber}
            onChange={(e) => setPrizeNumber(e.target.value)}
            className="w-full p-2 border rounded"
            min="1"
            required
          />
          <button 
            className="w-full p-2 bg-red-500 text-white rounded hover:bg-red-600 disabled:bg-red-300"
            onClick={handleRequestPrize}
            disabled={!cardId || !prizeNumber}
          >
            兌換獎品
          </button>
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

export default RequestPrize;



