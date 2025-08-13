
import React from 'react';

interface StartScreenProps {
    onStartNewGame: () => void;
    onContinueGame: () => void;
    onStartFindStepanGame: () => void;
    onStartPrisonEscapeGame: () => void;
    onStartFarmGame: () => void;
    onGoToStore: () => void;
    hasSaveData: boolean;
    userName: string | null;
    coins: number;
}

const Sparkles: React.FC = () => (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {Array.from({length: 15}).map((_, i) => (
            <div key={i} className="sparkle" style={{
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                width: `${2 + Math.random() * 4}px`,
                height: `${2 + Math.random() * 4}px`,
                animationDelay: `${Math.random() * 1.5}s`,
                animationDuration: `${1 + Math.random()}s`,
            }} />
        ))}
    </div>
);

export const StartScreen: React.FC<StartScreenProps> = ({ onStartNewGame, onContinueGame, onStartFindStepanGame, onStartPrisonEscapeGame, onStartFarmGame, onGoToStore, hasSaveData, userName, coins }) => {
    return (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center p-4 text-center animate-fade-in bg-amber-50">
            <Sparkles />
            <style>{`
                @keyframes float-up {
                    0% { transform: translateY(20px); opacity: 0; }
                    100% { transform: translateY(0); opacity: 1; }
                }
                @keyframes logo-float {
                    0%, 100% { transform: translateY(0px); }
                    50% { transform: translateY(-15px); }
                }
            `}</style>
            
            <div className="relative w-full flex justify-center items-center mb-6">
                <img 
                    src="https://i.imgur.com/muWlUqC.png" 
                    alt="Приключения Степана Лого" 
                    className="w-48 h-48 sm:w-56 sm:h-56 object-contain drop-shadow-2xl animate-[logo-float_5s_ease-in-out_infinite]"
                />
            </div>

            <h1 className="text-4xl sm:text-5xl font-black text-amber-900 drop-shadow-lg mb-2 animate-[float-up_0.5s_ease-out_forwards] opacity-0">
                Приключения <span className="text-lime-700">Степана</span>
            </h1>
            
            {userName && (
                <p className="text-2xl font-bold text-amber-800 mb-4 animate-[float-up_0.5s_ease-out_0.2s_forwards] opacity-0">
                    Привет, <span className="text-lime-700">{userName}</span>!
                </p>
            )}

            <div className="bg-amber-100/80 p-2 rounded-lg shadow-inner flex items-center justify-center gap-3 mb-6 animate-[float-up_0.5s_ease-out_0.3s_forwards] opacity-0">
              <span className="text-2xl sm:text-3xl font-bold text-amber-800">{coins}</span>
              <span className="text-2xl sm:text-3xl drop-shadow-sm">🪙</span>
            </div>


            <div className="grid grid-cols-2 gap-3 w-full max-w-sm px-4">
                {hasSaveData && (
                    <button
                        onClick={onContinueGame}
                        className="btn-3d text-white font-bold py-3 px-4 rounded-full text-lg w-full animate-[float-up_0.5s_ease-out_0.4s_forwards] opacity-0 col-span-2"
                        style={{backgroundColor: '#84cc16', borderColor: '#4d7c0f'}}
                    >
                        Продолжить
                    </button>
                )}
                <button
                    onClick={onStartNewGame}
                    className={`btn-3d text-white font-bold py-3 px-4 rounded-full text-lg w-full animate-[float-up_0.5s_ease-out_0.5s_forwards] opacity-0 ${hasSaveData ? 'col-span-1' : 'col-span-2'}`}
                     style={{backgroundColor: hasSaveData ? '#f59e0b' : '#22c55e', borderColor: hasSaveData ? '#b45309' : '#15803d'}}
                >
                    {hasSaveData ? 'Новая игра' : 'Играть'}
                </button>
                {hasSaveData && (
                    <button
                        onClick={onGoToStore}
                        className="btn-3d text-white font-bold py-3 px-4 rounded-full text-lg w-full animate-[float-up_0.5s_ease-out_0.5s_forwards] opacity-0 col-span-1"
                        style={{backgroundColor: '#6366f1', borderColor: '#4338ca'}}
                    >
                        Магазин
                    </button>
                )}
                 <button
                    onClick={onStartFindStepanGame}
                    className="btn-3d bg-sky-500 text-white font-bold py-3 px-4 rounded-full text-lg w-full animate-[float-up_0.5s_ease-out_0.6s_forwards] opacity-0 col-span-1"
                    style={{borderColor: '#0369a1'}}
                >
                    Найти Стёпу
                </button>
                 <button
                    onClick={onStartPrisonEscapeGame}
                    className="btn-3d bg-slate-600 text-white font-bold py-3 px-4 rounded-full text-lg w-full animate-[float-up_0.5s_ease-out_0.7s_forwards] opacity-0 col-span-1"
                    style={{borderColor: '#334155'}}
                >
                    Побег
                </button>
                 <button
                    onClick={onStartFarmGame}
                    className="btn-3d bg-green-500 text-white font-bold py-3 px-4 rounded-full text-lg w-full animate-[float-up_0.5s_ease-out_0.8s_forwards] opacity-0 col-span-2"
                    style={{borderColor: '#166534'}}
                >
                    Ферма
                </button>
            </div>
            <p className="absolute bottom-10 text-center text-amber-700/80 font-black text-sm animate-[float-up_0.5s_ease-out_1s_forwards] opacity-0">
                Сделано с ❤️ для Анастасии и Степана
            </p>
        </div>
    );
}