import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const TransferBalance = () => {
  const navigate = useNavigate();
  const [sourceCardId, setSourceCardId] = useState('');
  const [targetCardId, setTargetCardId] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleTransfer = async (type) => {
    setError('');
    setSuccess('');

    if (!sourceCardId || !targetCardId) {
      setError('請輸入來源卡號和目標卡號');
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
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <div className="p-4 border rounded bg-gray-50">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">轉換代碼或票券</h2>
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
            placeholder="來源卡號"
            value={sourceCardId}
            onChange={(e) => setSourceCardId(e.target.value)}
            className="w-full p-2 border rounded"
            min="1"
            required
          />
          <input
            type="number"
            placeholder="目標卡號"
            value={targetCardId}
            onChange={(e) => setTargetCardId(e.target.value)}
            className="w-full p-2 border rounded"
            min="1"
            required
          />
          <div className="flex space-x-2">
            <button 
              className="flex-1 p-2 bg-purple-500 text-white rounded hover:bg-purple-600 disabled:bg-purple-300"
              onClick={() => handleTransfer('Credits')}
              disabled={!sourceCardId || !targetCardId}
            >
              轉換代碼
            </button>
            <button 
              className="flex-1 p-2 bg-purple-500 text-white rounded hover:bg-purple-600 disabled:bg-purple-300"
              onClick={() => handleTransfer('Tickets')}
              disabled={!sourceCardId || !targetCardId}
            >
              轉換票券
            </button>
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

export default TransferBalance;