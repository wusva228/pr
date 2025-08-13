import React from 'react';

export const ArtemTakeover: React.FC = () => {
    return (
        <div className="fixed inset-0 bg-red-900/80 backdrop-blur-sm flex flex-col items-center justify-center z-50 animate-fade-in p-4 text-white text-center">
             <style>{`
                @keyframes artem-intro {
                    0% { transform: scale(0.5) rotate(-15deg); opacity: 0; }
                    100% { transform: scale(1) rotate(0deg); opacity: 1; }
                }
             `}</style>
             <div style={{animation: 'artem-intro 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) forwards'}}>
                <img src="https://i.imgur.com/bGrafax.png" alt="Артём" className="w-40 h-40 mx-auto mb-4 rounded-full border-4 border-red-500 shadow-lg" style={{filter: 'drop-shadow(0 6px 10px rgba(0,0,0,0.4))'}}/>
                <h2 className="text-4xl sm:text-5xl font-black drop-shadow-lg">Артём здесь!</h2>
                <p className="text-xl sm:text-2xl font-semibold mt-2 drop-shadow-md">Ха-ха! Выход теперь в другом месте!</p>
             </div>
        </div>
    );
};
