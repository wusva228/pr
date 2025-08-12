import React from 'react';

interface StartScreenProps {
    onStartNewGame: () => void;
    onContinueGame: () => void;
    onStartFindStepanGame: () => void;
    hasSaveData: boolean;
    userName: string | null;
}

const CharacterIcon: React.FC<{imgSrc: string, alt: string, className?: string}> = ({imgSrc, alt, className}) => (
    <img src={imgSrc} alt={alt} className={`w-24 h-24 sm:w-32 sm:h-32 object-contain drop-shadow-lg ${className}`} />
);

export const StartScreen: React.FC<StartScreenProps> = ({ onStartNewGame, onContinueGame, onStartFindStepanGame, hasSaveData, userName }) => {
    return (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center p-4 text-center animate-fade-in bg-amber-50">
            <style>{`
                @keyframes fade-in { from { opacity: 0; } to { opacity: 1; } }
                @keyframes float-up {
                    0% { transform: translateY(20px); opacity: 0; }
                    100% { transform: translateY(0); opacity: 1; }
                }
                @keyframes hero-float-1 {
                    0%, 100% { transform: translateY(0px) rotate(-5deg); }
                    50% { transform: translateY(-20px) rotate(4deg); }
                }
                 @keyframes hero-float-2 {
                    0%, 100% { transform: translateY(0px) rotate(5deg); }
                    50% { transform: translateY(-18px) rotate(-6deg); }
                }
                 @keyframes hero-float-3 {
                    0%, 100% { transform: translateY(0px) rotate(2deg); }
                    50% { transform: translateY(-16px) rotate(-3deg); }
                }
            `}</style>
            
            <div className="relative w-full flex justify-center items-center -mt-16 mb-8">
                <CharacterIcon imgSrc="https://i.imgur.com/RGeeZlR.png" alt="Анастасия" className="animation-[hero-float-2_6s_ease-in-out_infinite] z-10" />
                <CharacterIcon imgSrc="https://i.imgur.com/DpKKww5.png" alt="Степан" className="animation-[hero-float-1_5s_ease-in-out_infinite] scale-125 -mx-4 z-20" />
                <CharacterIcon imgSrc="https://i.imgur.com/bGrafax.png" alt="Артём" className="animation-[hero-float-3_7s_ease-in-out_infinite] z-0" />
            </div>

            <h1 className="text-4xl sm:text-5xl font-black text-amber-900 drop-shadow-lg mb-4 animate-[float-up_0.5s_ease-out_forwards]">
                Приключения <span className="text-lime-700">Степана</span>
            </h1>
            
            {userName && (
                <p className="text-2xl font-bold text-amber-800 mb-6 animate-[float-up_0.5s_ease-out_0.2s_backwards]">
                    Привет, <span className="text-lime-700">{userName}</span>!
                </p>
            )}

            <div className="flex flex-col gap-4 w-full max-w-xs">
                {hasSaveData && (
                    <button
                        onClick={onContinueGame}
                        className="btn-3d text-white font-bold py-3 px-8 rounded-full text-xl w-full animate-[float-up_0.5s_ease-out_0.4s_backwards]"
                        style={{animationDelay: '200ms', backgroundColor: '#84cc16', borderColor: '#4d7c0f'}}
                    >
                        Продолжить
                    </button>
                )}
                <button
                    onClick={onStartNewGame}
                    className={`btn-3d text-white font-bold py-3 px-8 rounded-full text-xl w-full animate-[float-up_0.5s_ease-out_0.5s_backwards]`}
                    style={{ backgroundColor: hasSaveData ? '#f59e0b' : '#22c55e', borderColor: hasSaveData ? '#b45309' : '#15803d'}}
                >
                    {hasSaveData ? 'Новая игра' : 'Играть'}
                </button>
                 <button
                    onClick={onStartFindStepanGame}
                    className="btn-3d bg-sky-500 text-white font-bold py-3 px-8 rounded-full text-xl w-full animate-[float-up_0.5s_ease-out_0.6s_backwards]"
                    style={{borderColor: '#0369a1'}}
                >
                    Найти Стёпу
                </button>
            </div>
        </div>
    );
}