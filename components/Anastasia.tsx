import React from 'react';

interface AnastasiaProps {
    message: string;
}

export const Anastasia: React.FC<AnastasiaProps> = ({ message }) => {
    return (
        <div className="flex flex-col items-center gap-2">
            <img src="https://i.imgur.com/RGeeZlR.png" alt="Анастасия" className="w-24 h-24 rounded-full object-cover border-4 border-white" style={{filter: 'drop-shadow(0 4px 6px rgba(0,0,0,0.2))'}}/>
            <div className="bg-white/80 p-3 rounded-lg rounded-tl-none shadow-md max-w-xs">
                <p className="text-lg text-amber-900 font-semibold">{message}</p>
            </div>
        </div>
    )
}