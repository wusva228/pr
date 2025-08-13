import React from 'react';
import { PrisonCell as PrisonCellComponent } from './PrisonCell';
import { PrisonCell } from '../types';
import { PRISON_GRID_SIZE } from '../constants';

interface PrisonEscapeGameProps {
    grid: PrisonCell[];
    onPrisonAction: (index: number) => void;
    energy: number;
    onReturnToMenu: () => void;
    stepanPosition: number;
}

export const PrisonEscapeGame: React.FC<PrisonEscapeGameProps> = ({ grid, onPrisonAction, energy, onReturnToMenu, stepanPosition }) => {
    const stepanRow = Math.floor(stepanPosition / PRISON_GRID_SIZE);
    const stepanCol = stepanPosition % PRISON_GRID_SIZE;

    const stepanStyle: React.CSSProperties = {
        top: `calc(${stepanRow * (100 / PRISON_GRID_SIZE)}%)`,
        left: `calc(${stepanCol * (100 / PRISON_GRID_SIZE)}%)`,
        width: `calc(100% / ${PRISON_GRID_SIZE})`,
        height: `calc(100% / ${PRISON_GRID_SIZE})`,
        transition: 'top 0.3s ease-in-out, left 0.3s ease-in-out',
      };

    return (
        <div className="w-full h-full flex flex-col items-center justify-center animate-fade-in p-2">
            <div className="bg-slate-400/80 p-4 sm:p-6 rounded-2xl shadow-lg mb-4 text-center panel-3d">
                <h1 className="text-2xl sm:text-3xl font-black text-slate-900">Побег из тюрьмы</h1>
                <p className="text-sm sm:text-base text-slate-800 mt-1 max-w-xs">
                    Каждое действие тратит энергию. 💧 восстанавливает, 🔥 отнимает больше.
                </p>
                <p className="text-lg sm:text-xl text-slate-800 mt-2">
                    Энергия: <span className="font-bold text-red-600 text-2xl">{energy} ⚡</span>
                </p>
            </div>
            <div className="relative w-full aspect-square max-w-lg sm:max-w-xl md:max-w-2xl">
                <div 
                  className="relative w-full h-full bg-slate-800/70 p-1 sm:p-2 rounded-xl shadow-2xl border-4 border-slate-900/50"
                  style={{
                    display: 'grid',
                    gridTemplateColumns: `repeat(${PRISON_GRID_SIZE}, minmax(0, 1fr))`,
                    gridTemplateRows: `repeat(${PRISON_GRID_SIZE}, minmax(0, 1fr))`,
                    gap: '0.25rem',
                  }}
                >
                    {grid.map((cell, index) => {
                        const cellRow = Math.floor(index / PRISON_GRID_SIZE);
                        const cellCol = index % PRISON_GRID_SIZE;
                        const isAdjacent = Math.abs(stepanRow - cellRow) + Math.abs(stepanCol - cellCol) === 1;
                        return (
                            <PrisonCellComponent 
                                key={cell.id} 
                                cell={cell} 
                                onAction={() => onPrisonAction(index)}
                                isAdjacent={isAdjacent}
                            />
                        )
                    })}
                    <div className="absolute pointer-events-none p-1" style={stepanStyle}>
                        <img src="https://i.imgur.com/DpKKww5.png" alt="Стёпа" className="w-full h-full object-contain drop-shadow-lg"/>
                    </div>
                </div>
            </div>
             <button
                onClick={onReturnToMenu}
                className="btn-3d bg-amber-500 text-white font-bold py-3 px-8 rounded-full text-xl mt-6"
                style={{borderColor: '#b45309'}}
            >
                Главное меню
            </button>
        </div>
    );
};