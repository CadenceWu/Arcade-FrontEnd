import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import HomePage from './components/HomePage';
import Game from './components/Game/Game';
import PrizeCategory from './components/Prize/PrizeCategory';
import Card from './components/Card/Card';
import PlayGame from './components/PlayGame';
import TransferBalance from './components/Terminal/TransferBalance';
import CheckBalance from './components/Terminal/CheckBalance';
import RequestPrize from './components/Terminal/RequestPrize';

const App = () => {
  return (
    <BrowserRouter basename="/">
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/games" element={<Game />} />
        <Route path="/cards" element={<Card />} />
        <Route path="/prizes" element={<PrizeCategory />} />
        <Route path="/playgame" element={<PlayGame />} />
        <Route path="/transfer" element={<TransferBalance />} />
        <Route path="/check-balance" element={<CheckBalance />} />
        <Route path="/request-prize" element={<RequestPrize />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;