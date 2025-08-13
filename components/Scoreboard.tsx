import React from 'react';
import { ANASTASIA_MAX_MOOD } from '../constants';
import { type Item } from '../types';

interface ScoreboardProps {
  foundItems: Item[];
  totalTrashCount: number;
  level: number;
  coins: number;
  anastasiaMood: number;
}

const FoundItem: React.FC<{ item: Item }> = ({ item }) => (
  <div className="flex items-center gap-3 bg-lime-200/50 p-2 rounded-lg shadow-sm animate-slide-in">
    <span className="text-2xl sm:text-3xl drop-shadow">{item.emoji}</span>
    <span className="text-amber-800 font-semibold text-sm sm:text-base">{item.name}</span>
  </div>
);

export const Scoreboard: React.FC<ScoreboardProps> = ({ foundItems, totalTrashCount, level, coins, anastasiaMood }) => {
  const moodPercentage = (anastasiaMood / ANASTASIA_MAX_MOOD) * 100;
  
  return (
    <div className="w-full lg:w-80 flex-shrink-0 bg-amber-200/60 p-4 sm:p-5 rounded-2xl border-2 border-amber-300/50 panel-3d">
      <style>{`
        @keyframes slide-in {
          from { opacity: 0; transform: translateX(-20px); }
          to { opacity: 1; transform: translateX(0); }
        }
      `}</style>
      <div className="flex justify-between items-center border-b-4 border-amber-300 pb-2 mb-4">
        <h2 className="text-xl sm:text-2xl font-black text-amber-900">Находки</h2>
        <span className="text-base sm:text-xl font-bold bg-lime-700 text-white px-3 py-1 rounded-lg shadow-md">Уровень {level}</span>
      </div>
      <p className="text-base sm:text-lg font-bold mb-3 text-lime-800">
        Собрано мусора: {foundItems.length} / {totalTrashCount}
      </p>
      <div className="space-y-2 sm:space-y-3 max-h-40 sm:max-h-56 lg:max-h-[30vh] overflow-y-auto pr-2 mb-4">
        {foundItems.length > 0 ? (
          foundItems.map(item => <FoundItem key={`${item.id}-${Math.random()}`} item={item} />)
        ) : (
          <div className="text-center text-amber-700 pt-8">
            <p>Здесь пока пусто.</p>
            <p>Начинай копать!</p>
          </div>
        )}
      </div>

      <div className="border-t-4 border-amber-300 pt-3 space-y-3">
          {/* Mood */}
          <div className="flex items-center gap-3">
            <img src="https://i.imgur.com/RGeeZlR.png" alt="Анастасия" className="w-10 h-10 rounded-full border-2 border-white shadow-md"/>
            <div className="w-full bg-red-200 rounded-full h-5 shadow-inner overflow-hidden border-2 border-white/50">
              <div 
                className="bg-gradient-to-r from-pink-400 to-red-500 h-full rounded-full transition-all duration-500"
                style={{width: `${moodPercentage}%`}}
              ></div>
            </div>
             <span className="text-xl">{moodPercentage > 50 ? '😊' : '😢'}</span>
          </div>

          {/* Coins */}
          <div className="bg-amber-100/80 p-2 rounded-lg shadow-inner flex items-center justify-center gap-3">
              <span className="text-2xl sm:text-3xl font-bold text-amber-800">{coins}</span>
              <span className="text-2xl sm:text-3xl drop-shadow-sm">🪙</span>
          </div>
      </div>
    </div>
  );
};