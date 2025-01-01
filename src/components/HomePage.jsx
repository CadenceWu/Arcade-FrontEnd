import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './HomePage.css';
import arcadeImg from './Arcade.jpg';
import gameCard from './GameCard.svg';
import PlayGame from './PlayGame.svg';

const HomePage = () => {
  const [userRole, setUserRole] = useState('user'); // Default role is 'user'

  const MenuSection = ({ title, children }) => (
    <div className="menu-section">
      <h2 className="menu-title">{title}</h2>
      <div className="menu-buttons">{children}</div>
    </div>
  );

  const PrimaryButton = ({ to, children, className = "" }) => (
    <Link to={to} className={`primary-button ${className}`}>
      {children}
    </Link>
  );

  return (
    <div className="home-page">
      <header className="home-header">
        <h1 className="home-title">歡迎來到遊戲場</h1>
      </header>

      {/* Role Selection Section */}
      <div className="role-selector">
        <label htmlFor="role">選擇您的角色:</label>
        <select
          id="role"
          value={userRole}
          onChange={(e) => setUserRole(e.target.value)}
        >
          <option value="user">一般使用者</option>
          <option value="admin">系統管理員</option>
        </select>
      </div>

      <div className="home-content">
        {/* Admin Section */}
        {userRole === 'admin' && (
          <MenuSection title="系統管理">
            <PrimaryButton to="/games">
              設定遊戲
            </PrimaryButton>
            <PrimaryButton to="/prizes">
              獎品設定
            </PrimaryButton>
            <img src={arcadeImg} className="arcade-image" alt="Arcade" />
          </MenuSection>
        )}

        {/* Game Card Section */}
        <MenuSection title="遊戲卡設定">
          <PrimaryButton to="/cards">
            新增遊戲卡、儲值
          </PrimaryButton>
          <PrimaryButton to="/transfer">
            轉換代碼、票券
          </PrimaryButton>
          <PrimaryButton to="/check-balance">
            查看卡片餘額
          </PrimaryButton>
          <img src={gameCard} className="arcade-image" alt="Game Card" />
        </MenuSection>

        {/* Gameplay Section */}
        <MenuSection title="遊戲操作、獎品兌換">
          <PrimaryButton to="/playGame">
            選擇遊戲
          </PrimaryButton>
          <PrimaryButton to="/request-prize">
            兌換獎品
          </PrimaryButton>
          <img src={PlayGame} className="arcade-image" alt="Play Game" />
        </MenuSection>
      </div>
    </div>
  );
};

export default HomePage;
