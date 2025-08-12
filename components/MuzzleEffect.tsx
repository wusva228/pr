import React, { useState, useEffect } from 'react';

interface MuzzleEffectProps {
    duration: number;
}

export const MuzzleEffect: React.FC<MuzzleEffectProps> = ({ duration }) => {
    const [timeLeft, setTimeLeft] = useState(duration / 1000);

    useEffect(() => {
        const interval = setInterval(() => {
            setTimeLeft(prev => Math.max(0, prev - 1));
        }, 1000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="fixed inset-0 bg-gray-900/50 backdrop-blur-sm flex flex-col items-center justify-center z-40 text-white animate-fade-in">
            <div className="text-8xl animate-pulse">😷</div>
            <h2 className="text-4xl font-bold mt-4">Намордник!</h2>
            <p className="text-2xl mt-2">Нельзя копать...</p>
            <p className="text-6xl font-black mt-4">{timeLeft}</p>
        </div>
    )
}