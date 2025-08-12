import React, { useState, useEffect } from 'react';
import { ARTYOM_ICON_URL } from '../constants';
import { hapticImpact } from '../services/haptics';

interface ArtyomBossScreenProps {
  onWin: () => void;
  onLose: () => void;
}

const CLICKS_TO_WIN = 10;
const TIME_TO_DEFEND = 5000; // 5 seconds

export default function ArtyomBossScreen({ onWin, onLose }: ArtyomBossScreenProps) {
  const [clicksLeft, setClicksLeft] = useState(CLICKS_TO_WIN);

  useEffect(() => {
    const timer = setTimeout(() => {
      onLose();
    }, TIME_TO_DEFEND);

    return () => clearTimeout(timer);
  }, [onLose]);
  
  useEffect(() => {
      if (clicksLeft <= 0) {
          onWin();
      }
  }, [clicksLeft, onWin]);

  const handleClick = () => {
    hapticImpact('heavy');
    setClicksLeft(prev => prev - 1);
  };

  return (
    <div className="fixed inset-0 bg-red-900/80 backdrop-blur-sm z-50 flex flex-col items-center justify-center p-4 animate-pulse">
      <h1 className="text-4xl sm:text-6xl font-bold text-white text-center drop-shadow-lg mb-8">
        АТАКА АРТЁМА!
      </h1>
      <button onClick={handleClick} className="transition-transform duration-100 active:scale-95">
        <img src={ARTYOM_ICON_URL} alt="Артём" className="w-48 h-48 sm:w-64 sm:h-64 drop-shadow-2xl" />
      </button>
      <p className="mt-8 text-2xl font-bold text-white">
        Нажми {clicksLeft} раз!
      </p>
    </div>
  );
}