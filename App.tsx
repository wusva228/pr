import React, { useState, useEffect } from 'react';
import MainGame from './components/MainGame';
import FlappyGame from './components/FlappyGame';
import ChatWithStepan from './components/ChatWithStepan';
import { PlayerCharacter } from './types';
import { CORGI_ICON_URL, ANASTASIA_ICON_URL } from './constants';
import { hapticSelection } from './services/haptics';

// Extend the Window interface to include the Telegram WebApp object
declare global {
  interface Window {
    Telegram?: {
      WebApp: any;
    };
  }
}

// Claymorphism button style
const clayButtonClass = "w-full text-xl font-bold rounded-2xl border-b-8 border-t-2 border-x-2 transition-all duration-150 ease-in-out transform active:scale-[0.97] active:border-b-4";

const WelcomeScreen: React.FC<{
  userName: string;
  isLoading: boolean;
  onStartMain: () => void;
  onStartFlappy: () => void;
  onStartChat: () => void;
}> = ({ userName, isLoading, onStartMain, onStartFlappy, onStartChat }) => {
  return (
    <div className="w-screen h-screen flex flex-col items-center justify-center bg-gradient-to-br from-amber-300 via-orange-200 to-amber-300 p-4 text-amber-900">
      <div className="text-center w-full max-w-sm">
        <h1 className="text-4xl sm:text-5xl font-bold drop-shadow-[0_4px_4px_rgba(0,0,0,0.25)]">Приключения</h1>
        <div className="my-4 flex justify-center items-center gap-4">
            <img src={CORGI_ICON_URL} alt="Корги Степан" className="h-24 w-24 drop-shadow-lg object-contain"/>
            <span className="text-5xl font-bold text-white text-stroke">&</span>
            <img src={ANASTASIA_ICON_URL} alt="Анастасия" className="h-24 w-24 rounded-full bg-white/50 p-1 shadow-lg object-cover"/>
        </div>

        {isLoading ? (
          <div className="h-32 flex flex-col items-center justify-center">
            <div className="text-6xl animate-bounce">🐾</div>
            <p className="mt-4 text-lg font-semibold">Загрузка...</p>
          </div>
        ) : (
          <div className="h-32 flex flex-col items-center justify-center">
             <p className="text-2xl font-semibold drop-shadow">Привет, {userName}!</p>
          </div>
        )}
        
        <div className="space-y-4 mt-8">
            <button
                onClick={onStartMain}
                disabled={isLoading}
                className={`${clayButtonClass} bg-green-500 border-green-700 text-white py-4`}
            >
                Основная игра
            </button>
             <button
                onClick={onStartFlappy}
                disabled={isLoading}
                className={`${clayButtonClass} bg-sky-500 border-sky-700 text-white py-4`}
            >
                Мини-игра "Flappy Corgi"
            </button>
            <button
                onClick={onStartChat}
                disabled={isLoading}
                className={`${clayButtonClass} bg-purple-500 border-purple-700 text-white py-4`}
            >
                Поговорить со Степаном
            </button>
        </div>
      </div>
       <footer className="absolute bottom-4 text-center text-xs text-amber-800/70">
          <p>Сделано с ❤️ для Степана и Настёны.</p>
          <p className="mt-1">игра создана wusva</p>
        </footer>
        <style>{`.text-stroke { -webkit-text-stroke: 2px #a16207; }`}</style>
    </div>
  );
};


export default function App() {
  const [view, setView] = useState<'welcome' | 'main' | 'flappy' | 'chat'>('welcome');
  const [userName, setUserName] = useState('Друг');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    try {
      const tg = window.Telegram?.WebApp;
      if (tg) {
        tg.ready();
        const user = tg.initDataUnsafe?.user;
        if (user?.first_name) {
          setUserName(user.first_name);
        }
        tg.expand();
      }
    } catch (error) {
        console.error("Telegram WebApp script not found or failed to init:", error);
    } finally {
        // Simulate loading time for better UX
        const timer = setTimeout(() => setIsLoading(false), 1500);
        return () => clearTimeout(timer);
    }
  }, []);

  const changeView = (newView: 'welcome' | 'main' | 'flappy' | 'chat') => {
      hapticSelection();
      setView(newView);
  }

  const handleBackToMenu = () => changeView('welcome');

  switch (view) {
    case 'main':
      return <MainGame onBack={handleBackToMenu} />;
    case 'flappy':
      return <FlappyGame onBack={handleBackToMenu} />;
    case 'chat':
        return <ChatWithStepan onBack={handleBackToMenu} />;
    case 'welcome':
    default:
      return <WelcomeScreen 
        userName={userName} 
        isLoading={isLoading}
        onStartMain={() => changeView('main')}
        onStartFlappy={() => changeView('flappy')}
        onStartChat={() => changeView('chat')}
        />;
  }
}