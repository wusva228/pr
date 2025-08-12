import React from 'react';
import { type GridSpot } from '../types';

interface DigSpotProps {
  spot: GridSpot;
  onDig: () => void;
  isMuzzled: boolean;
  isBeingDug: boolean;
  digTime: number;
}

const DirtMound: React.FC = () => (
  <div className="absolute inset-0 flex items-center justify-center">
    <div className="w-2/3 h-1/2 bg-gradient-to-b from-amber-700 to-amber-800 rounded-[50%_50%_40%_40%_/_60%_60%_40%_40%] shadow-lg transform group-hover:scale-105 transition-transform"></div>
  </div>
);

const DugHole: React.FC<{ item: GridSpot['item'] }> = ({ item }) => (
  <div className="absolute inset-0 flex items-center justify-center animate-reveal">
    <div className="w-full h-full bg-gradient-to-t from-amber-900 to-black/50 rounded-lg shadow-[inset_0_6px_10px_rgba(0,0,0,0.5)]"></div>
    {item && (
      <div className="absolute text-3xl sm:text-4xl transform scale-0 animate-pop-in drop-shadow-lg" style={{animationDelay: '200ms'}}>
        {item.emoji}
      </div>
    )}
  </div>
);

const Particles: React.FC = () => (
    <>
        {Array.from({ length: 12 }).map((_, i) => (
            <div
                key={i}
                className="particle"
                style={{
                    '--transform-end': `translate(${Math.cos(i * 30) * (60 + Math.random() * 30)}px, ${Math.sin(i * 30) * (60 + Math.random() * 30)}px) scale(0)`,
                    animationDuration: `${0.4 + Math.random() * 0.4}s`
                } as React.CSSProperties}
            ></div>
        ))}
    </>
);

export const DigSpot: React.FC<DigSpotProps> = ({ spot, onDig, isMuzzled, isBeingDug, digTime }) => {
  const isDisabled = spot.isDug || isMuzzled || isBeingDug;
  const baseClasses = "relative w-full h-full rounded-lg transition-all duration-300 group shadow-inner";
  
  return (
    <div 
      className={`${baseClasses} ${spot.isDug ? 'bg-lime-800/60' : 'bg-lime-700/80'} ${isDisabled ? 'cursor-not-allowed' : 'cursor-pointer hover:bg-lime-600'} ${isMuzzled ? 'filter grayscale' : ''}`}
      onClick={isDisabled ? undefined : onDig}
    >
      <style>{`
        @keyframes reveal {
          from { opacity: 0; transform: scale(0.5); }
          to { opacity: 1; transform: scale(1); }
        }
        @keyframes pop-in {
          0% { transform: scale(0) rotate(-30deg); }
          70% { transform: scale(1.2) rotate(10deg); }
          100% { transform: scale(1) rotate(0deg); }
        }
      `}</style>

      {isBeingDug && !spot.isDug && (
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 flex flex-col items-center justify-center w-full">
            <div className="w-2/3 h-1.5 bg-white/30 rounded-full overflow-hidden">
                <div 
                    className="h-full bg-gradient-to-r from-green-300 to-green-500 rounded-full animate-progress"
                    style={{'--dig-duration': `${digTime}ms`} as React.CSSProperties}
                ></div>
            </div>
            <div className="absolute inset-0 flex items-center justify-center">
                <Particles />
            </div>
        </div>
      )}

      {!spot.isDug ? <DirtMound /> : <DugHole item={spot.item} />}
    </div>
  );
};