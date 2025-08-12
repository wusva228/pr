import React from 'react';
import { SearchSpot } from './SearchSpot';
import { FindStepanSpot, UpgradeId } from '../types';

interface FindStepanGameProps {
    grid: FindStepanSpot[];
    onSearch: (index: number) => void;
    attemptsLeft: number;
    onReturnToMenu: () => void;
    purchasedUpgrades: Set<UpgradeId>;
}

export const FindStepanGame: React.FC<FindStepanGameProps> = ({ grid, onSearch, attemptsLeft, onReturnToMenu }) => {
    const gridSize = Math.sqrt(grid.length);

    return (
        <div className="w-full flex flex-col items-center justify-center animate-fade-in">
            <div className="bg-amber-200/80 p-4 sm:p-6 rounded-2xl shadow-lg mb-6 text-center panel-3d">
                <h1 className="text-2xl sm:text-3xl font-black text-amber-900">Найди Стёпу!</h1>
                <div className="flex items-center justify-center gap-4 mt-2">
                    <img src="https://i.imgur.com/RGeeZlR.png" alt="Анастасия" className="w-12 h-12 rounded-full border-2 border-white"/>
                    <p className="text-lg sm:text-xl text-amber-800">Попыток осталось: <span className="font-bold text-lime-700 text-2xl">{attemptsLeft}</span></p>
                </div>
            </div>
            <div className="relative w-full aspect-square max-w-lg sm:max-w-xl md:max-w-2xl">
                <div 
                  className="relative w-full h-full bg-lime-600/70 p-2 sm:p-3 rounded-3xl shadow-2xl border-4 border-lime-700/50 panel-3d"
                  style={{
                    display: 'grid',
                    gridTemplateColumns: `repeat(${gridSize}, minmax(0, 1fr))`,
                    gridTemplateRows: `repeat(${gridSize}, minmax(0, 1fr))`,
                    gap: '0.5rem',
                  }}
                >
                    {grid.map((spot, index) => (
                        <SearchSpot key={spot.id} spot={spot} onSearch={() => onSearch(index)} />
                    ))}
                </div>
            </div>
             <button
                onClick={onReturnToMenu}
                className="btn-3d bg-amber-500 text-white font-bold py-3 px-8 rounded-full text-xl mt-8"
                style={{borderColor: '#b45309'}}
            >
                Главное меню
            </button>
        </div>
    );
};