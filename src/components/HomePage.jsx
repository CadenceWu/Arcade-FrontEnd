import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '../styles/HomePage.css';
import arcadeImg from './Image/Arcade.jpg';
import gameCard from './Image/GameCard.svg';
import playGame from './Image/PlayGame.svg';
import arcadeMachine from './Image/ArcadeMachine.svg';
import { useEffect } from 'react';
import { gsap } from 'gsap';

const HomePage = () => {
  const [userRole, setUserRole] = useState('user'); 

  //Animation
  useEffect(() => {
    gsap.to('.header-image', {
      rotation: 360,
      scale: 1.2,
      repeat: -1,
      yoyo: true,
      duration: 3,
    });
  }, []);

  
  const MenuSection = ({ title, children, imageSrc }) => (
    <div className="menu-section">
      <div className="title-with-image">
        <h2 className="menu-title">{title}</h2>
        {imageSrc && <img src={imageSrc} className="arcade-image" alt={`${title} Image`} />}     
      </div>
      <div className="menu-buttons">{children}</div>
    </div>
  );

  // 1. 阻止默認的頁面刷新行為, 2. 更新瀏覽器的 URL 為 "/check-balance", 3. 通知 React Router 有路由變化(在 App.js 中設置)
  const PrimaryButton = ({ to, children, className = "" }) => (
    <Link to={to} className={`primary-button ${className}`}>{children}</Link>
  );

  return (
    <div className="home-page">
      <header className="home-header">
        <div className="header-content">
          <h1 className="home-title">歡迎來到遊戲場</h1>
          <img src={arcadeMachine} alt="Arcade Machine" className="header-image" />
        </div>
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
          <MenuSection title="系統管理" imageSrc={arcadeImg}>
            <PrimaryButton to="/games">遊戲設定</PrimaryButton>
            <PrimaryButton to="/prizes">獎品設定</PrimaryButton>
          </MenuSection>
        )}

        {/* Card Section */}
        <MenuSection title="遊戲卡設定" imageSrc={gameCard}>
          <PrimaryButton to="/cards">新增遊戲卡、儲值</PrimaryButton>
          <PrimaryButton to="/transfer">轉換代碼、票券</PrimaryButton>
          <PrimaryButton to="/check-balance">查看卡片餘額</PrimaryButton>
        </MenuSection>


        {/* Gameplay Section */}
        <MenuSection title="遊戲操作、獎品兌換" imageSrc={playGame}>
          <PrimaryButton to="/playGame">選擇遊戲</PrimaryButton>
          <PrimaryButton to="/request-prize">兌換獎品</PrimaryButton>
        </MenuSection>
      </div>
    </div>
  );
};

export default HomePage;
