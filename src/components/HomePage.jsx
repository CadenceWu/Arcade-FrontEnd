import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '../styles/HomePage.css';
import arcadeImg from './Arcade.jpg';
import gameCard from './GameCard.svg';
import PlayGame from './PlayGame.svg';
import ArcadeMachine from './ArcadeMachine.svg';

const HomePage = () => {
  const [userRole, setUserRole] = useState('user'); // Default role is 'user'

  //Takes two props
  const MenuSection = ({ title, children, imageSrc }) => (
    <div className="menu-section">
      <div className="title-with-image">
        <h2 className="menu-title">{title}</h2>
        {imageSrc && <img src={imageSrc} className="arcade-image" alt={`${title} Image`} />}
      </div>
      <div className="menu-buttons">{children}</div>
    </div>
  );


  const PrimaryButton = ({ to, children, className = "" }) => (
    <Link to={to} className={`primary-button ${className}`}>{children}</Link>
  );

  return (
    <div className="home-page">
      <header className="home-header">
        <div className="header-content">
          <h1 className="home-title">歡迎來到遊戲場</h1>
          <img src={ArcadeMachine} alt="Arcade Machine" className="header-image" />
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

        {/* Game Card Section */}
        <MenuSection title="遊戲卡設定" imageSrc={gameCard}>
          <PrimaryButton to="/cards">新增遊戲卡、儲值</PrimaryButton>
          <PrimaryButton to="/transfer">轉換代碼、票券</PrimaryButton>
          <PrimaryButton to="/check-balance">查看卡片餘額</PrimaryButton>
        </MenuSection>


        {/* Gameplay Section */}
        <MenuSection title="遊戲操作、獎品兌換" imageSrc={PlayGame}>
          <PrimaryButton to="/playGame">選擇遊戲</PrimaryButton>
          <PrimaryButton to="/request-prize">兌換獎品</PrimaryButton>
        </MenuSection>
      </div>
    </div>
  );
};

export default HomePage;
