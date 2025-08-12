import React, { useState, useCallback, useEffect } from 'react';
import { GameBoard } from './components/GameBoard';
import { Scoreboard } from './components/Scoreboard';
import { LevelEndModal } from './components/LevelEndModal';
import { UpgradeStore } from './components/UpgradeStore';
import { StartScreen } from './components/StartScreen';
import { Header } from './components/Header';
import { MuzzleEffect } from './components/MuzzleEffect';
import { ArtemBossFight } from './components/ArtemBossFight';
import { FindStepanGame } from './components/FindStepanGame';
import { FindStepanEndModal } from './components/FindStepanEndModal';
import { type GridSpot, type Item, type GameStatus, type UpgradeId, SavedGameState, GameMode, FindStepanSpot } from './types';
import { LEVEL_CONFIGS, ITEMS, UPGRADES, BASE_DIG_TIME, MUZZLE_DURATION, BOSS_CHANCE, SAVE_GAME_KEY, FIND_STEPAN_GRID_SIZE, FIND_STEPAN_ATTEMPTS, ANASTASIA_MAX_MOOD, MOOD_BOOST_VALUE } from './constants';

const shuffleArray = <T,>(array: T[]): T[] => {
  return [...array].sort(() => Math.random() - 0.5);
};

const triggerVibration = (style: 'light' | 'medium' | 'heavy' | 'rigid' | 'soft' | 'error' | 'success' | 'warning') => {
  try {
    const haptic = window.Telegram?.WebApp?.HapticFeedback;
    if (haptic) {
      if (style === 'error' || style === 'success' || style === 'warning') {
        haptic.notificationOccurred(style);
      } else {
        haptic.impactOccurred(style);
      }
    }
  } catch (e) {
    console.error("Haptic feedback error:", e);
  }
};


const setupGridForLevel = (level: number): { grid: GridSpot[], trashToFind: number, config: typeof LEVEL_CONFIGS[0] } => {
  const config = LEVEL_CONFIGS[level - 1] || LEVEL_CONFIGS[LEVEL_CONFIGS.length - 1];
  const { trash: trashCount, other: otherCount, traps: trapCount, grid: gridSize } = config;
  const totalSpots = gridSize * gridSize;

  const trashItems = shuffleArray(ITEMS.filter(i => i.isTrash)).slice(0, trashCount);
  const otherItems = shuffleArray(ITEMS.filter(i => !i.isTrash && !i.isTrap)).slice(0, otherCount);
  const trapItems = shuffleArray(ITEMS.filter(i => i.isTrap)).slice(0, trapCount);
  const itemsToPlace = [...trashItems, ...otherItems, ...trapItems];
  
  const emptySpotsCount = totalSpots - itemsToPlace.length;
  const emptyItems: (Item | null)[] = Array(emptySpotsCount).fill(null);
  
  const allGridItems = shuffleArray([...itemsToPlace, ...emptyItems]);
  
  const grid = Array.from({ length: totalSpots }, (_, i) => ({
    id: i,
    item: allGridItems[i],
    isDug: false,
  }));
  return { grid, trashToFind: trashCount, config };
};

const generateMathProblem = () => {
    const num1 = Math.floor(Math.random() * 10) + 1;
    const num2 = Math.floor(Math.random() * 10) + 1;
    const question = `${num1} + ${num2} = ?`;
    const answer = num1 + num2;
    return { question, answer };
}

const App: React.FC = () => {
  // Common state
  const [gameMode, setGameMode] = useState<GameMode>('idle');
  const [gameStatus, setGameStatus] = useState<GameStatus>('start_screen');
  const [coins, setCoins] = useState(0);
  const [purchasedUpgrades, setPurchasedUpgrades] = useState<Set<UpgradeId>>(new Set());
  const [equippedClothes, setEquippedClothes] = useState<Set<UpgradeId>>(new Set());
  const [hasSaveData, setHasSaveData] = useState(false);
  const [bonusMessage, setBonusMessage] = useState<string | null>(null);
  const [userName, setUserName] = useState<string | null>(null);
  const [anastasiaMood, setAnastasiaMood] = useState(ANASTASIA_MAX_MOOD);
  const [shake, setShake] = useState<'none' | 'gentle' | 'intense'>('none');

  // Digging game state
  const [grid, setGrid] = useState<GridSpot[]>([]);
  const [stephanPosition, setStephanPosition] = useState<number>(0);
  const [level, setLevel] = useState(1);
  const [trashToFind, setTrashToFind] = useState(0);
  const [foundTrash, setFoundTrash] = useState<Item[]>([]);
  const [lastLevelFoundTrash, setLastLevelFoundTrash] = useState<Item[]>([]);
  const [bossFight, setBossFight] = useState<{ question: string; answer: number; stolenItem: Item | null } | null>(null);
  
  // Find Stepan game state
  const [findStepanGrid, setFindStepanGrid] = useState<FindStepanSpot[]>([]);
  const [attemptsLeft, setAttemptsLeft] = useState(FIND_STEPAN_ATTEMPTS);
  const [isStepanFound, setIsStepanFound] = useState(false);

  useEffect(() => {
    try {
      if (window.Telegram && window.Telegram.WebApp) {
        window.Telegram.WebApp.ready();
        const user = window.Telegram.WebApp.initDataUnsafe?.user;
        if (user && user.first_name) {
          setUserName(user.first_name);
        }
      }
    } catch (e) {
      console.error("Telegram WebApp script error:", e);
    }
  }, []);

  const saveGame = useCallback(() => {
    if (gameMode !== 'digging_game') return;
    const gameState: SavedGameState = {
      level,
      coins,
      purchasedUpgrades: Array.from(purchasedUpgrades),
      equippedClothes: Array.from(equippedClothes),
      anastasiaMood,
    };
    localStorage.setItem(SAVE_GAME_KEY, JSON.stringify(gameState));
    setHasSaveData(true);
  }, [level, coins, purchasedUpgrades, equippedClothes, anastasiaMood, gameMode]);
  
  useEffect(() => {
    saveGame();
  }, [saveGame]);

  useEffect(() => {
    const savedData = localStorage.getItem(SAVE_GAME_KEY);
    if (savedData) {
      setHasSaveData(true);
    }
  }, []);
  
  useEffect(() => {
    if (shake === 'intense') {
        const timer = setTimeout(() => {
            setShake('none');
        }, 400); // duration of the animation
        return () => clearTimeout(timer);
    }
  }, [shake]);


  const startDiggingGame = useCallback((currentLevel: number) => {
    const { grid: newGrid, trashToFind: newTrashToFind, config } = setupGridForLevel(currentLevel);
    const totalSpots = config.grid * config.grid;

    setGrid(newGrid);
    setTrashToFind(newTrashToFind);
    setFoundTrash([]);
    setLastLevelFoundTrash([]);
    setGameMode('digging_game');
    setGameStatus('playing');
    setStephanPosition(Math.floor(totalSpots / 2));
  }, []);

  const handleStartFindStepanGame = () => {
    triggerVibration('soft');
    const gridSize = FIND_STEPAN_GRID_SIZE;
    const totalSpots = gridSize * gridSize;
    const stepanLocation = Math.floor(Math.random() * totalSpots);

    let newGrid = Array.from({length: totalSpots}, (_, i) => {
      const row = Math.floor(i / gridSize);
      const col = i % gridSize;
      const stepanRow = Math.floor(stepanLocation / gridSize);
      const stepanCol = stepanLocation % gridSize;
      const distance = Math.abs(row - stepanRow) + Math.abs(col - stepanCol);
      return { id: i, isSearched: false, distance };
    });

    if (purchasedUpgrades.has('CLOSER_START')) {
        const farSpots = newGrid.filter(s => s.distance > 4).map(s => s.id);
        const spotsToReveal = shuffleArray(farSpots).slice(0, 2);
        spotsToReveal.forEach(id => {
            newGrid[id].isSearched = true;
        });
    }

    const baseAttempts = FIND_STEPAN_ATTEMPTS;
    const bonusAttempts = purchasedUpgrades.has('EXTRA_ATTEMPT') ? 2 : 0;
    setAttemptsLeft(baseAttempts + bonusAttempts);

    setFindStepanGrid(newGrid);
    setIsStepanFound(false);
    setGameMode('find_stepan');
    setGameStatus('find_stepan_playing');
  };

  const handleSearchSpot = (index: number) => {
    if (attemptsLeft <= 0 || findStepanGrid[index].isSearched) return;
    
    triggerVibration('light');
    const newGrid = [...findStepanGrid];
    newGrid[index].isSearched = true;
    setFindStepanGrid(newGrid);
    setAttemptsLeft(prev => prev - 1);

    if (newGrid[index].distance === 0) {
      setIsStepanFound(true);
      setGameStatus('find_stepan_end');
    } else if (attemptsLeft - 1 === 0) {
      setGameStatus('find_stepan_end');
    }
  };

  const handleReturnToMenu = () => {
    triggerVibration('soft');
    setGameMode('idle');
    setGameStatus('start_screen');
  }
  
  const triggerMuzzle = () => {
    setGameStatus('muzzled');
    setTimeout(() => {
        setGameStatus('playing');
    }, MUZZLE_DURATION);
  }

  const triggerArtemBossFight = () => {
    if (foundTrash.length === 0) return;
    triggerVibration('error');
    setShake('intense');
    const stolenItem = foundTrash[foundTrash.length - 1];
    setFoundTrash(prev => prev.slice(0, -1));
    const problem = generateMathProblem();
    setBossFight({ ...problem, stolenItem });
    setGameStatus('boss_fight');
  };
  
  const handleDig = (index: number) => {
    if (gameStatus !== 'playing' || grid[index].isDug) return;
    
    triggerVibration('medium');
    setGameStatus('digging');
    setShake('gentle');
    setStephanPosition(index);

    const digTime = purchasedUpgrades.has('FASTER_DIG') 
        ? BASE_DIG_TIME * (1 - (UPGRADES.FASTER_DIG.value ?? 0)) 
        : BASE_DIG_TIME;

    setTimeout(() => {
      const newGrid = [...grid];
      const spot = newGrid[index];
      spot.isDug = true;
      let newFoundItems = foundTrash;

      if (spot.item) {
        triggerVibration('light');
        if(spot.item.isTrap && spot.item.trapType === 'MUZZLE') {
          triggerMuzzle();
        } else if (spot.item.isTrash) {
          newFoundItems = [...foundTrash, spot.item];
          setFoundTrash(newFoundItems);

          if(purchasedUpgrades.has('LUCKY_CHARM') && Math.random() < 0.2) {
              const bonusCoins = Math.floor(Math.random() * 5) + 1;
              setCoins(c => c + bonusCoins);
              setBonusMessage(`+${bonusCoins} 🪙 Талисман сработал!`);
              setTimeout(() => setBonusMessage(null), 2000);
          }
        }
      }
      
      setGrid(newGrid);
      setShake('none');
      
      if (newFoundItems.length === trashToFind) {
        setLastLevelFoundTrash(newFoundItems);
        setGameStatus('level_end');
      } else {
        if (spot.item?.isTrash && Math.random() < BOSS_CHANCE) {
            triggerArtemBossFight();
        } else {
            setGameStatus('playing');
        }
      }
    }, digTime);
  };
  
  const handleStartNewGame = () => {
    triggerVibration('soft');
    localStorage.removeItem(SAVE_GAME_KEY);
    setHasSaveData(false);
    setLevel(1);
    setCoins(0);
    setPurchasedUpgrades(new Set());
    setEquippedClothes(new Set());
    setAnastasiaMood(ANASTASIA_MAX_MOOD);
    startDiggingGame(1);
  }

  const handleContinueGame = () => {
    triggerVibration('soft');
    const savedDataRaw = localStorage.getItem(SAVE_GAME_KEY);
    if(savedDataRaw) {
        const savedData: SavedGameState = JSON.parse(savedDataRaw);
        setLevel(savedData.level);
        setCoins(savedData.coins);
        setPurchasedUpgrades(new Set(savedData.purchasedUpgrades));
        setEquippedClothes(new Set(savedData.equippedClothes));
        setAnastasiaMood(savedData.anastasiaMood ?? ANASTASIA_MAX_MOOD);
        startDiggingGame(savedData.level);
    }
  }

  const proceedToNextLevel = () => {
    triggerVibration('soft');
    const earnings = lastLevelFoundTrash.reduce((sum, item) => sum + item.coinValue, 0);
    setCoins(prevCoins => prevCoins + earnings);
    const nextLevel = level + 1;
    setLevel(nextLevel);
    startDiggingGame(nextLevel);
  }
  
  const handleGoToStore = () => {
    triggerVibration('soft');
    setGameStatus('store');
  }
  
  const handleBuyUpgrade = (upgradeId: UpgradeId) => {
    const upgrade = UPGRADES[upgradeId];
    if (!upgrade) return;

    triggerVibration('light');

    if (upgrade.id === 'IMPROVE_MOOD') {
      if (coins >= upgrade.cost && anastasiaMood < ANASTASIA_MAX_MOOD) {
        setCoins(c => c - upgrade.cost);
        setAnastasiaMood(m => Math.min(ANASTASIA_MAX_MOOD, m + MOOD_BOOST_VALUE));
      }
      return;
    }
    
    if (coins >= upgrade.cost && !purchasedUpgrades.has(upgradeId)) {
        setCoins(prevCoins => prevCoins - upgrade.cost);
        setPurchasedUpgrades(prev => new Set(prev).add(upgradeId));
        if (upgrade.type === 'CLOTHING') {
            const newEquipped = new Set(equippedClothes).add(upgradeId);
            setEquippedClothes(newEquipped);
        }
    } else if (purchasedUpgrades.has(upgradeId) && upgrade.type === 'CLOTHING') {
        const newEquipped = new Set(equippedClothes);
        if (newEquipped.has(upgradeId)) {
            newEquipped.delete(upgradeId);
        } else {
            newEquipped.add(upgradeId);
        }
        setEquippedClothes(newEquipped);
    }
  }

  const handleBossFightSubmit = (isCorrect: boolean) => {
    if (isCorrect && bossFight?.stolenItem) {
        triggerVibration('success');
        setFoundTrash(prev => [...prev, bossFight.stolenItem!]);
        const reward = 5;
        setCoins(c => c + reward);
        setBonusMessage(`+${reward} 🪙 Артём побеждён!`);
        setTimeout(() => setBonusMessage(null), 2000);
    } else {
        triggerVibration('warning');
    }
    setBossFight(null);
    setGameStatus('playing');
  }
  
  const getShakeClass = () => {
    switch(shake) {
        case 'gentle': return 'animate-screen-shake-gentle';
        case 'intense': return 'animate-screen-shake-intense';
        default: return '';
    }
  }

  const renderContent = () => {
    if (gameStatus === 'start_screen') {
      return <StartScreen 
        onStartNewGame={handleStartNewGame} 
        onContinueGame={handleContinueGame} 
        onStartFindStepanGame={handleStartFindStepanGame}
        hasSaveData={hasSaveData} 
        userName={userName}
      />;
    }
    
    if (gameMode === 'find_stepan') {
      return (
        <>
        <FindStepanGame 
          grid={findStepanGrid}
          onSearch={handleSearchSpot}
          attemptsLeft={attemptsLeft}
          onReturnToMenu={handleReturnToMenu}
          purchasedUpgrades={purchasedUpgrades}
        />
        {gameStatus === 'find_stepan_end' && (
          <FindStepanEndModal 
            isFound={isStepanFound}
            onPlayAgain={handleStartFindStepanGame}
            onReturnToMenu={handleReturnToMenu}
          />
        )}
        </>
      );
    }

    if (gameMode === 'digging_game') {
       const digTime = purchasedUpgrades.has('FASTER_DIG') 
        ? BASE_DIG_TIME * (1 - (UPGRADES.FASTER_DIG.value ?? 0)) 
        : BASE_DIG_TIME;

      return (
        <div className={`w-full h-full flex flex-col items-center ${getShakeClass()}`}>
          <Header/>
          {(gameStatus === 'playing' || gameStatus === 'digging' || gameStatus === 'muzzled') && (
            <div className="w-full flex-grow flex flex-col lg:flex-row gap-4 items-start justify-center mt-0 px-2 pb-4 min-h-0">
              <Scoreboard 
                foundItems={foundTrash} 
                totalTrashCount={trashToFind} 
                level={level}
                coins={coins}
                anastasiaMood={anastasiaMood}
               />
              <div className="flex-grow w-full flex flex-col items-center justify-center">
                 <GameBoard 
                    grid={grid} 
                    onDig={handleDig} 
                    stephanPosition={stephanPosition} 
                    isDigging={gameStatus === 'digging'}
                    isMuzzled={gameStatus === 'muzzled'}
                    equippedClothes={equippedClothes}
                    digTime={digTime}
                  />
              </div>
            </div>
          )}

          {gameStatus === 'level_end' && (
            <LevelEndModal
                level={level}
                foundItems={lastLevelFoundTrash}
                onNextLevel={proceedToNextLevel}
                onGoToStore={handleGoToStore}
            />
          )}
          
          {gameStatus === 'store' && (
            <UpgradeStore
                coins={coins}
                upgrades={Object.values(UPGRADES)}
                purchasedUpgrades={purchasedUpgrades}
                equippedClothes={equippedClothes}
                onBuyUpgrade={handleBuyUpgrade}
                onContinue={proceedToNextLevel}
                anastasiaMood={anastasiaMood}
            />
          )}

          {gameStatus === 'muzzled' && <MuzzleEffect duration={MUZZLE_DURATION} />}
          
          {gameStatus === 'boss_fight' && bossFight && (
            <ArtemBossFight
                problem={bossFight.question}
                correctAnswer={bossFight.answer}
                onSubmit={handleBossFightSubmit}
                stolenItem={bossFight.stolenItem}
            />
          )}
        </div>
      )
    }
    return null;
  }

  return (
    <main className="min-h-screen h-screen text-amber-900 flex flex-col items-center p-2 sm:p-4 selection:bg-lime-300 overflow-hidden">
      {bonusMessage && (
        <div className="fixed top-24 z-50 bg-yellow-400 text-yellow-900 font-bold px-4 py-2 rounded-full animate-bounce">
            {bonusMessage}
        </div>
      )}
      {renderContent()}
    </main>
  );
};

export default App;