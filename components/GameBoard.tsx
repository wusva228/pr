import React from 'react';
import { DigSpot } from './DigSpot';
import { Stepan } from './Stepan';
import { type GridSpot, type UpgradeId } from '../types';

interface GameBoardProps {
  grid: GridSpot[];
  onDig: (index: number) => void;
  stephanPosition: number;
  isDigging: boolean;
  isMuzzled: boolean;
  equippedClothes: Set<UpgradeId>;
  digTime: number;
}

export const GameBoard: React.FC<GameBoardProps> = ({ grid, onDig, stephanPosition, isDigging, isMuzzled, equippedClothes, digTime }) => {
  const gridSize = Math.sqrt(grid.length);

  return (
    <div className="relative w-full aspect-square max-w-full sm:max-w-xl md:max-w-2xl">
        {isDigging && <div className="absolute inset-0 z-30" />}
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
            <DigSpot 
                key={spot.id} 
                spot={spot} 
                onDig={() => onDig(index)}
                isMuzzled={isMuzzled}
                isBeingDug={isDigging && stephanPosition === index}
                digTime={digTime}
            />
          ))}
          <Stepan 
            positionIndex={stephanPosition} 
            isDigging={isDigging} 
            gridSize={gridSize}
            equippedClothes={equippedClothes}
          />
        </div>
    </div>
  );
};