
import React from 'react';
import { Anastasia } from './Anastasia';
import type { Item } from '../types';

interface LevelEndModalProps {
  onNextLevel: () => void;
  onGoToStore: () => void;
  level: number;
  foundItems: Item[];
}

const FoundItemRow: React.FC<{ item: Item }> = ({ item }) => (
    <div className="flex justify-between items-center text-left text-lg p-1">
        <span>{item.emoji} {item.name}</span>
        <span className="font-bold text-amber-700">+{item.coinValue} 🪙</span>
    </div>
);

export const LevelEndModal: React.FC<LevelEndModalProps> = ({ onNextLevel, onGoToStore, level, foundItems }) => {
  const levelEarnings = foundItems.reduce((sum, item) => sum + item.coinValue, 0);

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 animate-fade-in p-4">
      <style>{`
        @keyframes fade-in { from { opacity: 0; } to { opacity: 1; } }
        @keyframes pop-up { 
          from { opacity: 0; transform: scale(0.8) translateY(20px); }
          to { opacity: 1; transform: scale(1) translateY(0); }
        }
      `}</style>
      <div className="bg-gradient-to-br from-lime-200 to-green-200 text-center p-6 sm:p-8 rounded-3xl border-4 border-white/50 animate-pop-up max-w-md w-full mx-4 panel-3d">
        <Anastasia message={`Уровень ${level} пройден! Отличная работа!`} />
        <h2 className="text-3xl sm:text-4xl font-black text-lime-900 mb-2 mt-4 drop-shadow-md">Уровень пройден!</h2>
        <div className="bg-white/50 rounded-lg p-4 my-4 max-h-48 overflow-y-auto shadow-inner">
            <h3 className="font-bold text-xl text-lime-800 mb-2">Собранный мусор:</h3>
            {foundItems.map(item => <FoundItemRow key={item.id} item={item} />)}
        </div>
        <p className="text-xl text-lime-800 mb-6 font-bold">
          Заработано: <span className="text-amber-700">{levelEarnings} 🪙</span>
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
            onClick={onGoToStore}
            className="btn-3d bg-amber-500 text-white font-bold py-3 px-6 rounded-full text-lg"
            style={{borderColor: '#b45309'}}
            >
            Магазин
            </button>
            <button
            onClick={onNextLevel}
            className="btn-3d bg-green-600 text-white font-bold py-3 px-6 rounded-full text-lg order-first sm:order-last"
            style={{borderColor: '#15803d'}}
            >
            Следующий уровень
            </button>
        </div>
      </div>
    </div>
  );
};
