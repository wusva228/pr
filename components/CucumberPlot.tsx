import React, { useState, useEffect } from 'react';
import { CucumberPlotState } from '../types';
import { CUCUMBER_COOLDOWN_MS } from '../constants';

interface CucumberPlotProps {
  plot: CucumberPlotState;
  onClick: () => void;
}

const formatTime = (ms: number) => {
    if (ms <= 0) return "00:00:00";
    const totalSeconds = Math.floor(ms / 1000);
    const h = Math.floor(totalSeconds / 3600);
    const m = Math.floor((totalSeconds % 3600) / 60);
    const s = totalSeconds % 60;
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
};

export const CucumberPlot: React.FC<CucumberPlotProps> = ({ plot, onClick }) => {
  const { lastHarvestTime } = plot;
  const [timeLeft, setTimeLeft] = useState(0);

  useEffect(() => {
    if (lastHarvestTime) {
      const updateTimer = () => {
        const timeSinceHarvest = Date.now() - lastHarvestTime;
        const remaining = CUCUMBER_COOLDOWN_MS - timeSinceHarvest;
        setTimeLeft(Math.max(0, remaining));
      };
      
      updateTimer();
      const intervalId = setInterval(updateTimer, 1000);
      return () => clearInterval(intervalId);
    }
  }, [lastHarvestTime]);
  
  const isOnCooldown = timeLeft > 0;
  
  return (
    <div
      onClick={onClick}
      className={`w-full aspect-square rounded-2xl shadow-lg relative cursor-pointer group border-4 transition-all duration-300 ${isOnCooldown ? 'bg-gradient-to-br from-slate-600 to-gray-700 border-gray-800/50' : 'bg-gradient-to-br from-green-700 to-lime-800 border-lime-900/50'}`}
    >
      <div className={`absolute inset-2 rounded-lg shadow-inner flex flex-col items-center justify-center p-2 text-center text-white ${isOnCooldown ? 'bg-gradient-to-b from-gray-500 to-slate-600' : 'bg-gradient-to-b from-lime-600 to-green-700'}`}>
        {isOnCooldown ? (
            <>
                <div className="text-4xl sm:text-5xl mb-2 opacity-50">🥒</div>
                <p className="font-bold text-sm sm:text-base">Отдых</p>
                <div className="bg-black/30 px-2 py-1 rounded-md text-xs sm:text-sm font-mono mt-1">
                    {formatTime(timeLeft)}
                </div>
            </>
        ) : (
            <>
                <div className="text-4xl sm:text-5xl mb-2 transition-transform group-hover:scale-110 animate-bounce">🥒</div>
                <p className="font-bold text-sm sm:text-base">Собрать!</p>
            </>
        )}
      </div>
    </div>
  );
};