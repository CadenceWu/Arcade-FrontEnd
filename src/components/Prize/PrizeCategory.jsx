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
      setNewPrize({prizeName: '',requiredTickets: '',stockQuantity: ''});
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

  return (
    <div className={styles.gameContainer}>
      <h2 className={styles.headerTitle}>獎項設定</h2>
      <button onClick={() => navigate('/')} className={styles.button}>返回首頁</button>
      <h3>新增獎項</h3>

      {/* Add New Prize Form */}
      <form onSubmit={handleCreatePrize}>
        <div>
          <input
            type="text"
            value={newPrize.prizeName}
            onChange={(e) => setNewPrize({ ...newPrize, prizeName: e.target.value })}
            placeholder="獎項名稱"
            required
            onInvalid={(e) => e.target.setCustomValidity('請填寫獎項名稱')}
            onInput={(e) => e.target.setCustomValidity('')}
          />
          <input
            type="number"
            placeholder="所需兌換票券"
            value={newPrize.requiredTickets}
            onChange={(e) => setNewPrize({ ...newPrize, requiredTickets: parseInt(e.target.value) })}
            required
            onInvalid={(e) => e.target.setCustomValidity('請填寫所需兌換票券')}
            onInput={(e) => e.target.setCustomValidity('')}
          />
          <input
            type="number"
            placeholder="所剩數量"
            value={newPrize.stockQuantity}
            onChange={(e) => setNewPrize({ ...newPrize, stockQuantity: parseInt(e.target.value) })}
            required
            onInvalid={(e) => e.target.setCustomValidity('請填寫所剩數量')}
            onInput={(e) => e.target.setCustomValidity('')}
          />
          <button type="submit" className={styles.button}>確認新增</button>
        </div>
      </form>

      {/* Prizes Table */}
      <div>
        <table className={styles.gameTable}>
          <thead>
            <tr>
              <th className={styles.tableHeader}>獎品編號</th>
              <th className={styles.tableHeader}>獎品名稱</th>
              <th className={styles.tableHeader}>所需兌換票券</th>
              <th className={styles.tableHeader}>剩餘數量</th>
              <th className={styles.tableHeader}></th>
            </tr>
          </thead>
          <tbody>
            {prizes.map((prize) => (
              <tr key={prize.prizeNumber} className={styles.tableRow}>
                <td className={styles.tableCell}>{prize.prizeNumber}</td>
                <td className={styles.tableCell}>
                  {editingPrize?.prizeNumber === prize.prizeNumber ? (
                    <input
                      type="text"
                      value={editingPrize.prizeName}
                      onChange={(e) => setEditingPrize({ ...editingPrize, prizeName: e.target.value })}
                    />
                  ) : prize.prizeName}
                </td>
                <td className={styles.tableCell}>
                  {editingPrize?.prizeNumber === prize.prizeNumber ? (
                    <input
                      type="number"
                      value={editingPrize.requiredTickets}
                      onChange={(e) => setEditingPrize({ ...editingPrize, requiredTickets: e.target.value })}
                    />
                  ) : prize.requiredTickets}
                </td>
                <td className={styles.tableCell}>
                  {editingPrize?.prizeNumber === prize.prizeNumber ? (
                    <input
                      type="number"
                      value={editingPrize.stockQuantity}
                      onChange={(e) => setEditingPrize({ ...editingPrize, stockQuantity: e.target.value })}
                    />
                  ) : prize.stockQuantity}
                </td>
                <td className={styles.tableCell}>
                  {editingPrize?.prizeNumber === prize.prizeNumber ? (
                    <div>
                      <button onClick={handleUpdatePrize} className={styles.button}>儲存</button>
                      <button onClick={() => setEditingPrize(null)} className={styles.button}>取消</button>
                    </div>
                  ) : (
                    <div>
                      <button onClick={() => setEditingPrize(prize)} className={styles.button}>編輯</button>
                      <button onClick={() => setDeletePrizeNumber(prize.prizeNumber)} className={styles.button}>刪除</button>
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