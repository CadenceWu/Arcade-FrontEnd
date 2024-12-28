import React from 'react';
import { useNavigate } from 'react-router-dom';
import './HomePage.css';
import arcadeImg from './Arcade.jpg'
import gameCard from './Card/GameCard.svg'
import PlayGame from './PlayGame.svg'

const HomePage = () => {
  const navigate = useNavigate();

  const MenuSection = ({ title, children }) => (
    <div className="menu-section">
      <h2 className="menu-title">{title}</h2>
      <div className="menu-buttons">{children}</div>
    </div>
  );

  const PrimaryButton = ({ onClick, children, className = "" }) => (
    <button className={`primary-button ${className}`} onClick={onClick}>
      {children}
    </button>
  );

  return (
    <div className="home-page">
      <header className="home-header">
        <h1 className="home-title">歡迎來到遊戲場</h1>
      </header>

      <div className="home-content">
        <MenuSection title="系統管理">
          <PrimaryButton onClick={() => navigate('/games')}>
            遊戲設定
          </PrimaryButton>
          <PrimaryButton onClick={() => navigate('/prizes')}>
            獎品設定
          </PrimaryButton>
          <img src={arcadeImg} className="arcade-image"></img>
        </MenuSection>

        <MenuSection title="遊戲卡設定">
          <PrimaryButton onClick={() => navigate('/cards')}>
           新增遊戲卡、儲值
          </PrimaryButton>
          <PrimaryButton onClick={() => navigate('/transfer')}>
            轉換代碼、票券
          </PrimaryButton>
          <PrimaryButton onClick={() => navigate('/check-balance')}>
            查看卡片餘額
          </PrimaryButton>
          <img src={gameCard} className="arcade-image"></img>
        </MenuSection>

        <MenuSection title="遊戲操作、獎品兌換">
          <PrimaryButton onClick={() => navigate('/playGame')}>
            選擇遊戲
          </PrimaryButton>
          <PrimaryButton onClick={() => navigate('/request-prize')}>
            兌換獎品
          </PrimaryButton>
          <img src={PlayGame} className="arcade-image"></img>
        </MenuSection>
      </div>
    </div>
  );
};

export default HomePage;
