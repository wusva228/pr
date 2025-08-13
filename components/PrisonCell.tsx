import React from 'react';
import { PrisonCell as PrisonCellType } from '../types';
import { PRISON_WALL_STRENGTH } from '../constants';

interface PrisonCellProps {
  cell: PrisonCellType;
  onAction: () => void;
  isAdjacent: boolean;
}

const Crack: React.FC<{ strength: number }> = ({ strength }) => {
    if (strength >= PRISON_WALL_STRENGTH) return null;
    const crackOpacity = 1 - (strength / (PRISON_WALL_STRENGTH + 1));
    return (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none" style={{opacity: crackOpacity}}>
            <svg viewBox="0 0 100 100" className="w-full h-full text-black/50 drop-shadow-sm">
                {strength === 2 && <path d="M 40 10 L 60 90" stroke="currentColor" strokeWidth="6" strokeLinecap="round" />}
                {strength === 1 && <path d="M 40 10 L 60 90 M 70 20 L 30 80" stroke="currentColor" strokeWidth="6" strokeLinecap="round" />}
            </svg>
        </div>
    )
}

const WallContent: React.FC<{ strength: number }> = ({ strength }) => (
  <div className="w-full h-full bg-gradient-to-br from-slate-700 to-slate-800 rounded-md shadow-lg relative">
    <div className="absolute top-0 left-0 right-0 h-1/4 bg-gradient-to-b from-slate-500 to-slate-700 rounded-t-md opacity-80" />
    <Crack strength={strength} />
  </div>
);

const FloorContent: React.FC<{ children?: React.ReactNode }> = ({ children }) => (
    <div className="w-full h-full bg-gradient-to-br from-slate-500 to-slate-600 rounded-md shadow-inner flex items-center justify-center">
        {children}
    </div>
);

const ExitContent: React.FC = () => (
    <div className="w-full h-full bg-yellow-400 rounded-md animate-[glow_2s_infinite] flex items-center justify-center">
        <div className="text-4xl text-black/50">🚪</div>
    </div>
);

const TrapContent: React.FC = () => (
    <FloorContent>
        <div className="text-3xl drop-shadow-md">
            🔥
        </div>
    </FloorContent>
);

const WaterContent: React.FC = () => (
    <FloorContent>
        <div className="text-3xl drop-shadow-md">
            💧
        </div>
    </FloorContent>
);


export const PrisonCell: React.FC<PrisonCellProps> = ({ cell, onAction, isAdjacent }) => {
  let content;
  
  switch(cell.type) {
    case 'wall':
        content = <WallContent strength={cell.strength} />;
        break;
    case 'floor':
        content = <FloorContent />;
        break;
    case 'exit':
        content = <ExitContent />;
        break;
    case 'trap':
        content = <TrapContent />;
        break;
    case 'water':
        content = <WaterContent />;
        break;
  }
  
  return (
    <div
      onClick={onAction}
      className={`relative w-full h-full rounded-md transition-all duration-200 ${isAdjacent ? 'cursor-pointer' : ''}`}
    >
        {content}
        {isAdjacent && <div className="absolute inset-0 rounded-md ring-4 ring-yellow-400 ring-inset pointer-events-none" />}
    </div>
  );
};