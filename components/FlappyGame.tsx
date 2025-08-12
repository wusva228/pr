import React, { useState, useEffect, useRef, useCallback } from 'react';
import { CORGI_ICON_URL, ANASTASIA_ICON_URL, FLAPPY_GAME_CONFIG } from '../constants';
import { PlayerCharacter } from '../types';
import { hapticImpact, hapticNotification, hapticSelection } from '../services/haptics';

type GameState = 'menu' | 'playing' | 'gameOver';

const { GRAVITY, JUMP_STRENGTH, PIPE_WIDTH, PIPE_GAP, PIPE_SPEED, PIPE_SPAWN_INTERVAL, BIRD_SIZE } = FLAPPY_GAME_CONFIG;

export default function FlappyGame({ onBack }: { onBack: () => void }) {
  const [gameState, setGameState] = useState<GameState>('menu');
  const [character, setCharacter] = useState<PlayerCharacter | null>(null);

  const handleSelectCharacter = (char: PlayerCharacter) => {
    hapticSelection();
    setCharacter(char);
    setGameState('playing');
  };

  const handleRestart = () => {
    hapticSelection();
    setGameState('playing');
  };

  const handleBackToMenu = () => {
      hapticSelection();
      setGameState('menu');
      setCharacter(null);
  };
  
  const handleGameOver = useCallback(() => {
      hapticNotification('error');
      setGameState('gameOver');
  }, []);

  if (gameState === 'menu') {
    return (
      <div className="w-full h-screen flex flex-col items-center justify-center bg-gradient-to-br from-sky-300 to-indigo-400 p-4 text-white">
        <h1 className="text-4xl font-bold mb-8 drop-shadow-lg">Flappy Corgi & Nastya</h1>
        <p className="mb-8 text-lg">Выберите персонажа:</p>
        <div className="flex gap-8">
          <button onClick={() => handleSelectCharacter('corgi')} className="text-center p-4 bg-white/20 rounded-2xl hover:bg-white/30 transition-all transform hover:scale-105">
            <img src={CORGI_ICON_URL} alt="Корги" className="w-24 h-24 object-contain" />
            <p className="font-bold mt-2">Степан</p>
          </button>
          <button onClick={() => handleSelectCharacter('anastasia')} className="text-center p-4 bg-white/20 rounded-2xl hover:bg-white/30 transition-all transform hover:scale-105">
            <img src={ANASTASIA_ICON_URL} alt="Анастасия" className="w-24 h-24 rounded-full bg-white/50 object-cover" />
            <p className="font-bold mt-2">Анастасия</p>
          </button>
        </div>
         <button onClick={onBack} className="absolute top-4 left-4 text-sm font-bold bg-white/20 py-2 px-4 rounded-xl shadow-md transition-transform hover:scale-105">Меню</button>
      </div>
    );
  }
  
  if (gameState === 'gameOver') {
    return <GameOverScreen onRestart={handleRestart} onMenu={handleBackToMenu} />;
  }

  return (
    <GameCanvas 
        character={character!} 
        onGameOver={handleGameOver}
    />
  );
}

const GameOverScreen: React.FC<{ onRestart: () => void, onMenu: () => void }> = ({ onRestart, onMenu }) => {
    // Score is passed via local storage to avoid complex prop drilling through game states
    const score = localStorage.getItem('flappy_score') || 0;
    return (
        <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center z-20">
            <div className="bg-white/80 p-8 rounded-2xl text-center text-stone-800 shadow-2xl">
                <h2 className="text-4xl font-bold">Игра окончена</h2>
                <p className="text-2xl mt-2">Ваш счёт: {score}</p>
                <div className="flex gap-4 mt-8">
                     <button onClick={onRestart} className="bg-green-500 text-white font-bold py-3 px-6 rounded-lg hover:bg-green-600 transition-colors">Заново</button>
                     <button onClick={onMenu} className="bg-gray-500 text-white font-bold py-3 px-6 rounded-lg hover:bg-gray-600 transition-colors">В меню</button>
                </div>
            </div>
        </div>
    );
}


const GameCanvas: React.FC<{ character: PlayerCharacter, onGameOver: () => void }> = ({ character, onGameOver }) => {
    const gameBoxRef = useRef<HTMLDivElement>(null);
    const birdPos = useRef(250);
    const birdVel = useRef(0);
    const pipes = useRef<{ x: number; topHeight: number, passed: boolean }[]>([]);
    const score = useRef(0);
    const gameLoopId = useRef<number | undefined>(undefined);
    const pipeTimerId = useRef<number | undefined>(undefined);
    
    // We use a state just to trigger re-renders
    const [_, setTick] = useState(0);

    const endGame = useCallback(() => {
        if (gameLoopId.current) clearInterval(gameLoopId.current);
        if (pipeTimerId.current) clearInterval(pipeTimerId.current);
        gameLoopId.current = undefined;
        pipeTimerId.current = undefined;
        localStorage.setItem('flappy_score', score.current.toString());
        onGameOver();
    }, [onGameOver]);
    
    const gameLoop = useCallback(() => {
        const gameBox = gameBoxRef.current;
        if (!gameBox) return;
        const gameHeight = gameBox.clientHeight;

        // Bird physics
        birdVel.current += GRAVITY;
        birdPos.current += birdVel.current;

        // Ground and ceiling collision
        if (birdPos.current > gameHeight - BIRD_SIZE || birdPos.current < 0) {
            endGame();
            return;
        }

        // Pipe movement and scoring
        const birdX = 50 + BIRD_SIZE / 2;
        pipes.current.forEach(pipe => {
            pipe.x -= PIPE_SPEED;
            if (!pipe.passed && pipe.x + PIPE_WIDTH < birdX) {
                pipe.passed = true;
                score.current += 1;
            }
        });
        
        // Remove off-screen pipes
        pipes.current = pipes.current.filter(p => p.x > -PIPE_WIDTH);

        // Collision detection with pipes
        const birdLeft = 50;
        const birdRight = birdLeft + BIRD_SIZE;
        const birdTop = birdPos.current;
        const birdBottom = birdTop + BIRD_SIZE;
        for (const pipe of pipes.current) {
            const pipeLeft = pipe.x;
            const pipeRight = pipe.x + PIPE_WIDTH;

            const topPipeBottom = pipe.topHeight;
            const bottomPipeTop = pipe.topHeight + PIPE_GAP;

            if (birdRight > pipeLeft && birdLeft < pipeRight) {
                if (birdTop < topPipeBottom || birdBottom > bottomPipeTop) {
                    endGame();
                    return;
                }
            }
        }
        
        // Trigger re-render
        setTick(t => t + 1);

    }, [endGame]);

    const startGame = useCallback(() => {
        // Reset state
        birdPos.current = 250;
        birdVel.current = 0;
        pipes.current = [];
        score.current = 0;

        gameLoopId.current = window.setInterval(gameLoop, 1000 / 60);
    
        pipeTimerId.current = window.setInterval(() => {
            if (!gameBoxRef.current) return;
            const gameWidth = gameBoxRef.current.clientWidth;
            const gameHeight = gameBoxRef.current.clientHeight;
            const topHeight = Math.random() * (gameHeight - PIPE_GAP - 100) + 50;
            pipes.current.push({ x: gameWidth, topHeight, passed: false });
        }, PIPE_SPAWN_INTERVAL);
    }, [gameLoop]);

    const handleJump = useCallback(() => {
        birdVel.current = JUMP_STRENGTH;
        hapticImpact('light');
    }, []);



    useEffect(() => {
        startGame();
        return () => {
            if (gameLoopId.current) clearInterval(gameLoopId.current);
            if (pipeTimerId.current) clearInterval(pipeTimerId.current);
        };
    }, [startGame]);

    return (
        <div 
            ref={gameBoxRef}
            className="w-full h-screen bg-gradient-to-br from-sky-300 to-indigo-400 overflow-hidden relative cursor-pointer"
            onClick={handleJump}
            role="button"
            tabIndex={0}
            aria-label="Игровое поле"
        >
            <div className="absolute top-4 left-1/2 -translate-x-1/2 text-white text-5xl font-bold drop-shadow-lg z-10">{score.current}</div>

            <img 
                src={character === 'corgi' ? CORGI_ICON_URL : ANASTASIA_ICON_URL} 
                alt="Player"
                className={`absolute ${character === 'anastasia' ? 'rounded-full object-cover' : 'object-contain'} transition-transform duration-100 ease-linear`}
                style={{ top: birdPos.current, left: 50, width: BIRD_SIZE, height: BIRD_SIZE, transform: `rotate(${Math.min(90, Math.max(-30, birdVel.current * 4))}deg)` }}
            />

            {pipes.current.map((pipe, i) => (
                <React.Fragment key={i}>
                    {/* Top Pipe */}
                    <div className="absolute bg-green-500 border-4 border-green-700 rounded-b-lg" style={{ left: pipe.x, top: 0, width: PIPE_WIDTH, height: pipe.topHeight }}/>
                    {/* Bottom Pipe */}
                    <div className="absolute bg-green-500 border-4 border-green-700 rounded-t-lg" style={{ left: pipe.x, top: pipe.topHeight + PIPE_GAP, width: PIPE_WIDTH, bottom: 0 }}/>
                </React.Fragment>
            ))}
        </div>
    );
};