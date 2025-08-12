import React, { useState, useEffect, useRef } from 'react';
import type { Item } from '../types';

interface ArtemBossFightProps {
    problem: string;
    correctAnswer: number;
    onSubmit: (isCorrect: boolean) => void;
    stolenItem: Item | null;
}

export const ArtemBossFight: React.FC<ArtemBossFightProps> = ({ problem, correctAnswer, onSubmit, stolenItem }) => {
    const [answer, setAnswer] = useState('');
    const [timer, setTimer] = useState(20);
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        inputRef.current?.focus();
        const interval = setInterval(() => {
            setTimer(prev => {
                if (prev <= 1) {
                    clearInterval(interval);
                    onSubmit(false);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(interval);
    }, [onSubmit]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const isCorrect = parseInt(answer, 10) === correctAnswer;
        onSubmit(isCorrect);
    };

    return (
        <div className="fixed inset-0 bg-red-900/80 backdrop-blur-sm flex items-center justify-center z-50 animate-fade-in p-4">
            <div className="bg-gradient-to-br from-red-300 to-orange-300 p-6 sm:p-8 rounded-3xl shadow-2xl border-4 border-white/50 max-w-md w-full mx-auto text-center panel-3d">
                <img src="https://i.imgur.com/bGrafax.png" alt="Артём" className="w-28 h-28 mx-auto mb-4 rounded-full border-4 border-red-500 shadow-lg" style={{filter: 'drop-shadow(0 4px 6px rgba(0,0,0,0.3))'}}/>
                <h2 className="text-3xl font-black text-red-800 drop-shadow-md">Артём здесь!</h2>
                <p className="text-lg text-red-700 font-semibold mt-2">Он украл твою находку: {stolenItem?.emoji} {stolenItem?.name}!</p>
                <p className="text-lg text-red-700">Реши пример, чтобы вернуть её!</p>

                <div className="my-6">
                    <div className="text-4xl sm:text-5xl font-bold text-white bg-red-600 p-4 rounded-lg shadow-inner">{problem}</div>
                </div>

                <form onSubmit={handleSubmit} className="flex flex-col items-center gap-4">
                    <input
                        ref={inputRef}
                        type="number"
                        value={answer}
                        onChange={(e) => setAnswer(e.target.value)}
                        className="text-center text-2xl sm:text-3xl font-bold p-3 rounded-lg w-full max-w-xs shadow-inner border-2 border-red-400 focus:outline-none focus:ring-4 focus:ring-red-500"
                        placeholder="Ответ"
                    />
                     <div className={`text-3xl sm:text-4xl font-bold ${timer <= 5 ? 'text-red-600 animate-ping' : 'text-white'}`}>
                        {timer}
                    </div>
                    <button
                        type="submit"
                        className="btn-3d !bg-green-600 text-white font-bold py-3 px-8 rounded-full text-xl !border-green-800"
                    >
                        Вернуть!
                    </button>
                </form>
            </div>
        </div>
    );
};