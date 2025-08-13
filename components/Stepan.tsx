import React from 'react';
import { UpgradeId } from '../types';

interface StepanProps {
  positionIndex: number;
  isDigging: boolean;
  gridSize: number;
  equippedClothes: Set<UpgradeId>;
  level: number;
}

export const Stepan: React.FC<StepanProps> = ({ positionIndex, isDigging, gridSize, equippedClothes, level }) => {
  const row = Math.floor(positionIndex / gridSize);
  const col = positionIndex % gridSize;
  const growthFactor = 1 + (level - 1) * 0.02;

  const style: React.CSSProperties = {
    top: `calc(${row * (100 / gridSize)}% + 0.25rem)`,
    left: `calc(${col * (100 / gridSize)}% + 0.25rem)`,
    width: `calc(${(100 / gridSize)}% - 0.5rem)`,
    height: `calc(${(100 / gridSize)}% - 0.5rem)`,
    transition: 'top 0.5s ease-in-out, left 0.5s ease-in-out, transform 0.5s ease-in-out',
    transform: `scale(${growthFactor})`
  };

  return (
    <div className="absolute pointer-events-none z-10" style={style}>
      <style>{`
        @keyframes dig-animation-intense {
          0% { transform: translateY(0) rotate(0deg) scale(1); }
          25% { transform: translateY(-10px) rotate(-8deg) scale(1.1); }
          50% { transform: translateY(2px) rotate(0deg) scale(0.95); }
          75% { transform: translateY(-10px) rotate(8deg) scale(1.1); }
          100% { transform: translateY(0) rotate(0deg) scale(1); }
        }
      `}</style>
      <div 
        className={`w-full h-full flex items-center justify-center transition-transform duration-300 relative ${isDigging ? 'animate-[dig-animation-intense_0.25s_infinite]' : ''}`}
      >
        <img src="https://i.imgur.com/DpKKww5.png" alt="Стёпа" className="w-full h-full object-contain drop-shadow-lg" />
        {equippedClothes.has('CUTE_HAT') && (
            <div className="absolute top-[-5%] left-[45%] w-3/5 text-5xl sm:text-6xl" style={{transform: "rotate(-15deg) scaleX(-1)"}}>
                <span style={{filter: 'drop-shadow(2px 2px 2px rgba(0,0,0,0.3))'}}>👒</span>
            </div>
        )}
        {equippedClothes.has('STYLISH_COLLAR') && (
            <div className="absolute bottom-[28%] left-[22%] w-3/5 h-[12%] rounded-full border-4 border-red-500 bg-red-400 opacity-80" style={{transform: "rotate(-10deg) skewX(-10deg)"}}></div>
        )}
      </div>
    </div>
  );
};