import React from 'react';
import { FindStepanSpot } from '../types';

interface SearchSpotProps {
    spot: FindStepanSpot;
    onSearch: () => void;
}

const Clue: React.FC<{ distance: number }> = ({ distance }) => {
    if (distance === 0) {
        return <img src="https://i.imgur.com/DpKKww5.png" alt="Стёпа найден!" className="w-full h-full object-contain drop-shadow-lg animate-pop-in" />;
    }
    
    let clueContent = '...';
    if (distance <= 2) { // Горячо
        clueContent = '🐾🐾';
    } else if (distance <= 4) { // Тепло
        clueContent = '🐾';
    } else { // Холодно
       return <div className="w-full h-full bg-green-800/20 rounded-lg"></div>;
    }
    
    return (
        <div className="w-full h-full flex items-center justify-center text-4xl text-amber-700 animate-pop-in">
            {clueContent}
        </div>
    );
};

export const SearchSpot: React.FC<SearchSpotProps> = ({ spot, onSearch }) => {
    const isDisabled = spot.isSearched;

    return (
        <div 
            className={`relative w-full h-full rounded-lg transition-all duration-300 group shadow-inner ${isDisabled ? 'bg-lime-800/60' : 'bg-lime-700/80 cursor-pointer hover:bg-lime-600'}`}
            onClick={isDisabled ? undefined : onSearch}
        >
             <style>{`
                @keyframes pop-in {
                  0% { transform: scale(0); }
                  70% { transform: scale(1.2); }
                  100% { transform: scale(1); }
                }
             `}</style>
            {!spot.isSearched ? (
                <div className="absolute inset-0 flex items-center justify-center text-4xl sm:text-5xl text-green-900/50 group-hover:scale-110 transition-transform">
                    🌳
                </div>
            ) : (
                <Clue distance={spot.distance} />
            )}
        </div>
    );
};