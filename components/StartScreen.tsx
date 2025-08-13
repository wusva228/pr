
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


const MenuButton: React.FC<{onClick: () => void, delay: number, children: React.ReactNode, className?: string}> = ({ onClick, delay, children, className }) => (
    <button
        onClick={onClick}
        className={`w-full py-3 rounded-xl text-lg font-bold transition-all duration-300 opacity-0 animate-fade-in-up ${className}`}
        style={{ animationDelay: `${delay}s` }}
    >
        {children}
    </button>
);


export const StartScreen: React.FC<StartScreenProps> = ({ onStartNewGame, onContinueGame, onStartFindStepanGame, onStartPrisonEscapeGame, onStartFarmGame, onGoToStore, hasSaveData, userName, coins }) => {
    return (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center p-4 text-center">
            <style>{`
                @keyframes fade-in-up {
                    0% { transform: translateY(20px); opacity: 0; }
                    100% { transform: translateY(0); opacity: 1; }
                }
                .animate-fade-in-up {
                    animation: fade-in-up 0.6s ease-out forwards;
                }
            `}</style>
            
            <div className="w-full max-w-sm p-6 sm:p-8 text-white glass-panel">
                <div className="flex justify-center items-center mb-4 opacity-0 animate-fade-in-up" style={{animationDelay: '0.1s'}}>
                    <img 
                        src="https://i.imgur.com/muWlUqC.png" 
                        alt="Приключения Степана Лого" 
                        className="w-28 h-28 sm:w-32 sm:h-32 object-contain drop-shadow-2xl"
                    />
                </div>

                <h1 className="text-3xl sm:text-4xl font-black drop-shadow-lg mb-1 opacity-0 animate-fade-in-up" style={{animationDelay: '0.2s'}}>
                    Приключения Степана
                </h1>
                
                {userName && (
                    <p className="text-lg font-bold opacity-80 mb-4 opacity-0 animate-fade-in-up" style={{animationDelay: '0.3s'}}>
                        Привет, {userName}!
                    </p>
                )}

                <div className="bg-black/20 p-2 rounded-lg flex items-center justify-between gap-3 mb-6 opacity-0 animate-fade-in-up" style={{animationDelay: '0.4s'}}>
                  <button onClick={onGoToStore} className="bg-white/10 hover:bg-white/20 px-4 py-1 rounded-md text-sm font-bold transition-colors">Магазин</button>
                  <div className="flex items-center gap-2">
                    <span className="text-xl sm:text-2xl font-bold">{coins}</span>
                    <span className="text-xl sm:text-2xl drop-shadow-sm">🪙</span>
                  </div>
                </div>

                <div className="space-y-3 w-full">
                    {hasSaveData && (
                        <MenuButton onClick={onContinueGame} delay={0.5} className="bg-lime-500 hover:bg-lime-400 text-lime-900">
                            Продолжить
                        </MenuButton>
                    )}
                    <MenuButton onClick={onStartNewGame} delay={0.6} className="bg-white/80 hover:bg-white text-gray-900">
                        {hasSaveData ? 'Новая игра' : 'Играть'}
                    </MenuButton>

                    <div className="grid grid-cols-2 gap-3">
                        <MenuButton onClick={onStartFindStepanGame} delay={0.7} className="bg-sky-500/80 hover:bg-sky-500">
                            Найти Стёпу
                        </MenuButton>
                        <MenuButton onClick={onStartPrisonEscapeGame} delay={0.75} className="bg-slate-600/80 hover:bg-slate-600">
                            Побег
                        </MenuButton>
                    </div>

                    <MenuButton onClick={onStartFarmGame} delay={0.8} className="bg-amber-500/80 hover:bg-amber-500">
                        Ферма
                    </MenuButton>
                </div>
            </div>
            <p className="absolute bottom-4 text-center text-white/50 font-bold text-sm opacity-0 animate-fade-in-up" style={{ animationDelay: '1s' }}>
                Сделано с ❤️ для Анастасии и Степана
            </p>
        </div>
    );
}