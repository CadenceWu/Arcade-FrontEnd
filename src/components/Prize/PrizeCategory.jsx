import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const ConfirmDialog = ({ isOpen, onClose, onConfirm, message }) => {
  if (!isOpen) return null;

  return (
    <div className="backdrop">
      <div className="modal">
        <h3>確認刪除</h3>
        <p>{message}</p>
        <div className="button-container">
          <button onClick={onClose} className="cancel-button">取消</button>
          <button onClick={onConfirm} className="confirm-button">確認刪除</button>
        </div>
      </div>
    </div>
  );
};

const PrizePage = () => {
  const navigate = useNavigate();
  const [prizes, setPrizes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingPrize, setEditingPrize] = useState(null);
  const [deletePrizeNumber, setDeletePrizeNumber] = useState(null);
  const [newPrize, setNewPrize] = useState({
    prizeName: '',
    requiredTickets: '',
    stockQuantity: ''
  });

  useEffect(() => {
    fetchPrizes();
  }, []);

  const fetchPrizes = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/prizes');
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      setPrizes(data);
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch prizes. Please try again later.');
      setLoading(false);
      console.error('Error fetching prizes:', err);
    }
  };
  const getNextPrizeNumber = () => {
    if (prizes.length === 0) return 1;
    const maxPrizeNumber = Math.max(...prizes.map(prize => parseInt(prize.prizeNumber)));
    return maxPrizeNumber + 1;
  };

  const handleCreatePrize = async (e) => {
    e.preventDefault();
    try {
      const prizeWithNumber = {
        ...newPrize,
        prizeNumber: getNextPrizeNumber().toString()
      };
      const response = await fetch('http://localhost:8080/api/prizes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(prizeWithNumber),
      });
      if (!response.ok) {
        throw new Error('Failed to create prize');
      }
      fetchPrizes();
      setNewPrize({
        prizeName: '',
        requiredTickets: 0,
        stockQuantity: 0
      });
    } catch (err) {
      setError('Failed to create prize. Please try again.');
      console.error('Error creating prize:', err);
    }
  };

  const handleUpdatePrize = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`http://localhost:8080/api/prizes/${editingPrize.prizeNumber}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(editingPrize),
      });

      if (!response.ok) throw new Error('Failed to update prize');
      
      await fetchPrizes();
      setEditingPrize(null);
    } catch (err) {
      setError('Failed to update game. Please try again.');
      console.error('Error updating game:', err);
    }
  };

  const handleDeletePrize = async (prizeNumber) => {
    try {
      const response = await fetch(`http://localhost:8080/api/prizes/${prizeNumber}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error('Failed to delete prize');
      }
      await fetchPrizes();
      setDeletePrizeNumber(null);
    } catch (err) {
      setError('Failed to delete prize. Please try again.');
      console.error('Error deleting prize:', err);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[200px]">
        <p className="text-gray-500">Loading prizes...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[200px]">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h2>獎項設定</h2>
        <button onClick={() => navigate('/')}>返回首頁</button>
      </div>
      <h3>新增獎項</h3>

      {/* Add New Prize Form */}   
      <form onSubmit={handleCreatePrize}>       
        <div>
          <input
            type="text"
            value={newPrize.prizeName}
            onChange={(e) => setNewPrize({...newPrize, prizeName: e.target.value})}
            placeholder="獎項名稱"
            required
          />
          <input
            type="number"
            placeholder="所需兌換票券"
            value={newPrize.requiredTickets}
            onChange={(e) => setNewPrize({...newPrize, requiredTickets: parseInt(e.target.value)})}
            required
          />      
          <input
            type="number"
            placeholder="所剩數量"
            value={newPrize.stockQuantity}
            onChange={(e) => setNewPrize({...newPrize, stockQuantity: parseInt(e.target.value)})}           
            required
          />
          <button type="submit">確認新增</button>
        </div>     
      </form>

      {/* Prizes Table */}
      <div>
        <table>
          <thead>
            <tr>
              <th>獎品編號</th>
              <th>獎品名稱</th>
              <th>所需兌換票券</th>
              <th>剩餘數量</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {prizes.map((prize) => (
              <tr key={prize.prizeNumber}>
                <td>{prize.prizeNumber}</td>
                <td>
                  {editingPrize?.prizeNumber === prize.prizeNumber ? (
                    <input
                      type="text"
                      value={editingPrize.prizeName}
                      onChange={(e) => setEditingPrize({...editingPrize, prizeName: e.target.value})}
                    />
                  ) : prize.prizeName}
                </td>
                <td>
                  {editingPrize?.prizeNumber === prize.prizeNumber ? (
                    <input
                      type="number"
                      value={editingPrize.requiredTickets}
                      onChange={(e) => setEditingPrize({...editingPrize, requiredTickets: e.target.value})}
                    />
                  ) : prize.requiredTickets}
                </td>
                <td>
                  {editingPrize?.prizeNumber === prize.prizeNumber ? (
                    <input
                      type="number"
                      value={editingPrize.stockQuantity}
                      onChange={(e) => setEditingPrize({...editingPrize, stockQuantity: e.target.value})}
                    />
                  ) : prize.stockQuantity}
                </td>
                <td>
                {editingPrize?.prizeNumber === prize.prizeNumber ? (
                    <div>
                      <button onClick={handleUpdatePrize}>儲存</button>
                      <button onClick={() => setEditingPrize(null)}>取消</button>
                    </div>
                  ) : (
                  <div>
                    <button onClick={() => setEditingPrize(prize)}>編輯</button>
                    <button onClick={() => setDeletePrizeNumber(prize.prizeNumber)}>刪除</button>
                  </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <ConfirmDialog
        isOpen={deletePrizeNumber !== null}
        onClose={() => setDeletePrizeNumber(null)}
        onConfirm={() => handleDeletePrize(deletePrizeNumber)}
        message="您確定要刪除這筆獎項資料嗎？此操作無法復原。"
      />
    </div>
  );
};

export default PrizePage;