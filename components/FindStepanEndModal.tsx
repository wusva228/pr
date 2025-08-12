import React from 'react';
import { Anastasia } from './Anastasia';

interface FindStepanEndModalProps {
    isFound: boolean;
    onPlayAgain: () => void;
    onReturnToMenu: () => void;
}

export const FindStepanEndModal: React.FC<FindStepanEndModalProps> = ({ isFound, onPlayAgain, onReturnToMenu }) => {
    const title = isFound ? "Стёпа найден!" : "Не получилось...";
    const message = isFound ? "Ура! Ты нашла своего верного друга!" : "Попробуй поискать ещё раз, он где-то рядом!";

    return (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 animate-fade-in p-4">
            <div className="bg-gradient-to-br from-lime-200 to-green-200 text-center p-6 sm:p-8 rounded-3xl border-4 border-white/50 animate-pop-up max-w-md w-full mx-4 panel-3d">
                 <div className="flex justify-center mb-4">
                    {isFound ? (
                        <img src="https://i.imgur.com/DpKKww5.png" alt="Стёпа" className="w-28 h-28 object-contain drop-shadow-lg"/>
                    ) : (
                        <Anastasia message={message} />
                    )}
                 </div>

                <h2 className="text-3xl sm:text-4xl font-black text-lime-900 mb-2 mt-4 drop-shadow-md">{title}</h2>
                {isFound && <p className="text-lg text-lime-800 mb-6">{message}</p>}
                
                <div className="flex flex-col sm:flex-row gap-4 justify-center mt-6">
                    <button
                        onClick={onReturnToMenu}
                        className="btn-3d bg-amber-500 text-white font-bold py-3 px-6 rounded-full text-lg"
                        style={{borderColor: '#b45309'}}
                    >
                        Главное меню
                    </button>
                    <button
                        onClick={onPlayAgain}
                        className="btn-3d bg-green-600 text-white font-bold py-3 px-6 rounded-full text-lg order-first sm:order-last"
                        style={{borderColor: '#15803d'}}
                    >
                        Играть снова
                    </button>
                </div>
            </div>
        </div>
    );
};