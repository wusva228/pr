import React, { useState, useEffect } from 'react';
import { FarmPlotState, Seed } from '../types';
import { SEEDS } from '../constants';

interface FarmPlotProps {
  plot: FarmPlotState;
  onClick: () => void;
}

const formatTime = (seconds: number) => {
    if (seconds <= 0) return "00:00";
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
};

export const FarmPlot: React.FC<FarmPlotProps> = ({ plot, onClick }) => {
    const { seedId, plantTime } = plot;
    const [timeLeft, setTimeLeft] = useState(0);
    
    const seed: Seed | undefined = seedId ? SEEDS.find(s => s.id === seedId) : undefined;
    
    useEffect(() => {
        if (seed && plantTime) {
            const updateTimer = () => {
                const elapsed = (Date.now() - plantTime) / 1000;
                setTimeLeft(Math.max(0, seed.growthTime - elapsed));
            };
            
            updateTimer();
            const interval = setInterval(updateTimer, 1000);
            return () => clearInterval(interval);
        }
    }, [seed, plantTime]);
    
    const isReady = seed && plantTime && timeLeft <= 0;
    const elapsed = plantTime && seed ? (Date.now() - plantTime) / 1000 : 0;
    const progress = seed ? Math.min(1, elapsed / seed.growthTime) : 0;

    const renderContent = () => {
        if (isReady) {
            return (
                <div className="flex flex-col items-center justify-center h-full animate-bounce">
                    <div className="text-5xl drop-shadow-lg">{seed?.emoji}</div>
                    <div className="absolute -top-2 -right-2 bg-green-500 text-white text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center shadow-lg">
                        ✓
                    </div>
                </div>
            );
        }
        if (seed) {
            let stageContent;
            if (progress < 0.33) {
                stageContent = <div className="text-3xl opacity-80 transition-all duration-500">🌱</div>;
            } else if (progress < 0.66) {
                stageContent = <div className="text-4xl opacity-90 scale-75 transition-all duration-500">{seed.emoji}</div>;
            } else {
                stageContent = <div className="text-5xl opacity-100 scale-90 transition-all duration-500">{seed.emoji}</div>;
            }
            
            return (
                <div className="flex flex-col items-center justify-center h-full">
                    {stageContent}
                    <div className="absolute bottom-1 bg-black/40 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                        {formatTime(timeLeft)}
                    </div>
                </div>
            );
        }
        return (
            <div className="flex items-center justify-center h-full text-4xl text-green-800/50 group-hover:scale-110 transition-transform">
                +
            </div>
        );
    }
    
    return (
        <div 
            onClick={onClick}
            className="w-full aspect-square bg-gradient-to-br from-yellow-700 to-amber-800 rounded-2xl shadow-lg relative cursor-pointer group border-4 border-amber-900/50"
        >
            <div className="absolute inset-2 bg-gradient-to-b from-amber-600 to-amber-700 rounded-lg shadow-inner">
                {renderContent()}
            </div>
        </div>
    );
};