
import React, { useState, useCallback, useEffect, useRef } from 'react';
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
import { PrisonEscapeGame } from './components/PrisonEscapeGame';
import { PrisonEscapeEndModal } from './components/PrisonEscapeEndModal';
import { FarmGame } from './components/FarmGame';
import { MusicToggle } from './components/MusicToggle';
import { ArtemTakeover } from './components/ArtemTakeover';
import { type GridSpot, type Item, type GameStatus, type UpgradeId, SavedGameState, GameMode, FindStepanSpot, PrisonCell, FarmPlotState, CucumberPlotState } from './types';
import { LEVEL_CONFIGS, ITEMS, UPGRADES, SEEDS, BASE_DIG_TIME, MUZZLE_DURATION, BOSS_CHANCE, SAVE_GAME_KEY, FIND_STEPAN_GRID_SIZE, FIND_STEPAN_ATTEMPTS, ANASTASIA_MAX_MOOD, MOOD_BOOST_VALUE, MOOD_DECAY_PER_LEVEL, PRISON_GRID_SIZE, PRISON_INITIAL_ENERGY, PRISON_WALL_STRENGTH, BACKGROUND_MUSIC_URL, PRISON_MOVE_COST, PRISON_BREAK_COST, PRISON_TRAP_PENALTY, PRISON_WATER_BONUS, INITIAL_FARM_PLOTS_COUNT, INITIAL_CUCUMBER_PLOTS_COUNT, CLICKS_PER_CUCUMBER, CUCUMBER_REWARD, CUCUMBER_COOLDOWN_MS, ARTEM_CHANCE_IN_PRISON, ARTEM_MOVE_TRIGGER } from './constants';

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
  const [isMusicPlaying, setIsMusicPlaying] = useState(false);
  const [preStoreStatus, setPreStoreStatus] = useState<GameStatus>('start_screen');
  const musicRef = useRef<HTMLAudioElement | null>(null);
  const [appInitialized, setAppInitialized] = useState(false);

  // Digging game state
  const [grid, setGrid] = useState<GridSpot[]>([]);
  const [stephanPosition, setStephanPosition] = useState<number>(0);
  const [level, setLevel] = useState(1);
  const [trashToFind, setTrashToFind] = useState(0);
  const [foundTrash, setFoundTrash] = useState<Item[]>([]);
  const [lastLevelFoundTrash, setLastLevelFoundTrash] = useState<Item[]>([]);
  const [bossFight, setBossFight] = useState<{ question: string; answer: number; stolenItem: Item | null } | null>(null);
  const [recentlyFoundItem, setRecentlyFoundItem] = useState<Item | null>(null);
  
  // Find Stepan game state
  const [findStepanGrid, setFindStepanGrid] = useState<FindStepanSpot[]>([]);
  const [attemptsLeft, setAttemptsLeft] = useState(FIND_STEPAN_ATTEMPTS);
  const [isStepanFound, setIsStepanFound] = useState(false);
  
  // Prison Escape game state
  const [prisonGrid, setPrisonGrid] = useState<PrisonCell[]>([]);
  const [prisonStepanPosition, setPrisonStepanPosition] = useState(-1);
  const [prisonEnergy, setPrisonEnergy] = useState(PRISON_INITIAL_ENERGY);
  const [isEscaped, setIsEscaped] = useState(false);
  const [prisonMoves, setPrisonMoves] = useState(0);
  const [showArtemTakeover, setShowArtemTakeover] = useState(false);


  // Farm game state
  const [farmPlots, setFarmPlots] = useState<FarmPlotState[]>([]);
  const [cucumberPlot, setCucumberPlot] = useState<CucumberPlotState>({ id: 0, lastHarvestTime: null });

  const loadGameData = useCallback(() => {
    const savedDataRaw = localStorage.getItem(SAVE_GAME_KEY);
    if (savedDataRaw) {
        const savedData: SavedGameState = JSON.parse(savedDataRaw);
        setLevel(savedData.level || 1);
        setCoins(savedData.coins || 0);
        setPurchasedUpgrades(new Set(savedData.purchasedUpgrades));
        setEquippedClothes(new Set(savedData.equippedClothes));
        setAnastasiaMood(savedData.anastasiaMood ?? ANASTASIA_MAX_MOOD);
        setFarmPlots(savedData.farmPlots ?? Array.from({length: INITIAL_FARM_PLOTS_COUNT}, (_, i) => ({ id: i, seedId: null, plantTime: null })));
        setCucumberPlot(savedData.cucumberPlot ?? { id: 0, lastHarvestTime: null });
        setHasSaveData(true);
    } else {
        setFarmPlots(Array.from({length: INITIAL_FARM_PLOTS_COUNT}, (_, i) => ({ id: i, seedId: null, plantTime: null })));
        setCucumberPlot({ id: 0, lastHarvestTime: null });
        setHasSaveData(false);
    }
    setAppInitialized(true);
  }, []);

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

    loadGameData();

    musicRef.current = document.getElementById('background-music') as HTMLAudioElement;
    if (musicRef.current) {
        musicRef.current.src = BACKGROUND_MUSIC_URL;
    }
  }, [loadGameData]);

  const saveGame = useCallback(() => {
    if (!appInitialized) return;
    const gameState: SavedGameState = {
      level,
      coins,
      purchasedUpgrades: Array.from(purchasedUpgrades),
      equippedClothes: Array.from(equippedClothes),
      anastasiaMood,
      farmPlots,
      cucumberPlot,
    };
    localStorage.setItem(SAVE_GAME_KEY, JSON.stringify(gameState));
    setHasSaveData(true);
  }, [level, coins, purchasedUpgrades, equippedClothes, anastasiaMood, farmPlots, cucumberPlot, appInitialized]);
  
  useEffect(() => {
    saveGame();
  }, [saveGame]);
  
  useEffect(() => {
    if (gameStatus === 'start_screen') {
      document.body.style.background = 'linear-gradient(135deg, #1e3a8a, #312e81, #4c1d95)';
    } else {
      document.body.style.background = '#fef3c7'; // amber-100
    }
  }, [gameStatus]);

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
  
  const handleStartPrisonEscapeGame = () => {
    triggerVibration('soft');
    const gridSize = PRISON_GRID_SIZE;
    const totalSpots = gridSize * gridSize;
    const exitPosition = Math.floor(Math.random() * (gridSize - 2)) + 1; // Not in corners
    
    let newGrid = Array.from({ length: totalSpots }, (_, i): PrisonCell => {
        const isBoundary = i < gridSize || i >= totalSpots - gridSize || i % gridSize === 0 || i % gridSize === gridSize - 1;
        if (i === exitPosition) {
            return { id: i, type: 'exit', strength: 0 };
        }
        if (isBoundary) {
            return { id: i, type: 'wall', strength: PRISON_WALL_STRENGTH };
        }
        return { id: i, type: 'floor', strength: 0 };
    });

    const startRow = gridSize - 2;
    const startCol = Math.floor(gridSize / 2);
    const startPos = startRow * gridSize + startCol;

    // Place traps and water
    const floorCells = newGrid.map((c, i) => ({...c, index: i})).filter(c => c.type === 'floor' && c.index !== startPos);
    const shuffledFloorCells = shuffleArray(floorCells);
    const trapCount = 3;
    const waterCount = 2;

    shuffledFloorCells.slice(0, trapCount).forEach(cell => {
        newGrid[cell.index].type = 'trap';
    });

    shuffledFloorCells.slice(trapCount, trapCount + waterCount).forEach(cell => {
        newGrid[cell.index].type = 'water';
    });

    setPrisonGrid(newGrid);
    setPrisonEnergy(PRISON_INITIAL_ENERGY);
    setPrisonMoves(0);
    setShowArtemTakeover(false);
    setIsEscaped(false);
    setPrisonStepanPosition(startPos);
    setGameMode('prison_escape');
    setGameStatus('prison_escape_playing');
  };

  const handleStartFarmGame = () => {
    triggerVibration('soft');
    setGameMode('farm');
    setGameStatus('farm_playing');
  }

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
      setGrid(prevGrid => {
        const newGrid = [...prevGrid];
        const spot = newGrid[index];
        spot.isDug = true;

        if (spot.item) {
          triggerVibration('light');
          setRecentlyFoundItem(spot.item);
          setTimeout(() => setRecentlyFoundItem(null), 3000);
          
          if (spot.item.isTrap && spot.item.trapType === 'MUZZLE') {
            setShake('none');
            triggerMuzzle();
            return newGrid;
          } else if (spot.item.isTrash) {
            setFoundTrash(prev => [...prev, spot.item!]);
            
            if (purchasedUpgrades.has('LUCKY_CHARM') && Math.random() < 0.2) {
              const bonusCoins = Math.floor(Math.random() * 5) + 1;
              setCoins(c => c + bonusCoins);
              setBonusMessage(`+${bonusCoins} 🪙 Талисман сработал!`);
              setTimeout(() => setBonusMessage(null), 2000);
            }
          }
        }
        return newGrid;
      });

      setShake('none');
      setGameStatus('playing');
    }, digTime);
  };
  
  useEffect(() => {
    if(gameMode === 'digging_game' && gameStatus === 'playing') {
      if(foundTrash.length === trashToFind && trashToFind > 0) {
        setLastLevelFoundTrash([...foundTrash]);
        setGameStatus('level_end');
      } else if (foundTrash.length > 0 && Math.random() < BOSS_CHANCE) {
          const lastItem = foundTrash[foundTrash.length - 1];
          if(lastItem?.isTrash){
              // triggerArtemBossFight(); // This logic needs rework to avoid being called in useEffect
          }
      }
    }
  }, [foundTrash, gameStatus, trashToFind, gameMode]);

  const handleStartNewGame = () => {
    triggerVibration('soft');
    if (!isMusicPlaying) {
      toggleMusic();
    }
    localStorage.removeItem(SAVE_GAME_KEY);
    setLevel(1);
    setCoins(0);
    setPurchasedUpgrades(new Set());
    setEquippedClothes(new Set());
    setAnastasiaMood(ANASTASIA_MAX_MOOD);
    setFarmPlots(Array.from({length: INITIAL_FARM_PLOTS_COUNT}, (_, i) => ({ id: i, seedId: null, plantTime: null })));
    setCucumberPlot({ id: 0, lastHarvestTime: null });
    setHasSaveData(false);
    startDiggingGame(1);
  }

  const handleContinueGame = () => {
    triggerVibration('soft');
    if (!isMusicPlaying) {
      toggleMusic();
    }
    loadGameData();
    startDiggingGame(level);
  }

  const proceedToNextLevel = () => {
    triggerVibration('soft');
    const earnings = lastLevelFoundTrash.reduce((sum, item) => sum + item.coinValue, 0);
    setCoins(prevCoins => prevCoins + earnings);
    setAnastasiaMood(m => Math.max(0, m - MOOD_DECAY_PER_LEVEL));
    const nextLevel = level + 1;
    setLevel(nextLevel);
    startDiggingGame(nextLevel);
  }
  
  const handleGoToStore = (fromStatus?: GameStatus) => {
    triggerVibration('soft');
    setPreStoreStatus(fromStatus || gameStatus);
    setGameStatus('store');
  }

  const handleCloseStore = () => {
    triggerVibration('soft');
    if (preStoreStatus === 'level_end') {
        proceedToNextLevel();
    } else {
        handleReturnToMenu();
    }
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

  const handlePrisonAction = (index: number) => {
    if (prisonEnergy <= 0 || index === prisonStepanPosition) return;

    const gridSize = PRISON_GRID_SIZE;
    const stephanRow = Math.floor(prisonStepanPosition / gridSize);
    const stephanCol = prisonStepanPosition % gridSize;
    const targetRow = Math.floor(index / gridSize);
    const targetCol = index % gridSize;
    const isAdjacent = Math.abs(stephanRow - targetRow) + Math.abs(stephanCol - targetCol) === 1;

    if (!isAdjacent) return;

    let newEnergy = prisonEnergy;
    let newGrid = [...prisonGrid];
    const targetCell = { ...newGrid[index] };
    let didMove = false;
    let newPrisonMoves = prisonMoves;

    // Logic for different cell types
    if (targetCell.type === 'floor' || targetCell.type === 'trap' || targetCell.type === 'water') {
        newEnergy -= PRISON_MOVE_COST; // ALWAYS subtract move cost first
        if (targetCell.type === 'trap') {
            newEnergy -= PRISON_TRAP_PENALTY;
            triggerVibration('warning');
        } else if (targetCell.type === 'water') {
            newEnergy += PRISON_WATER_BONUS;
            targetCell.type = 'floor'; // consume
            triggerVibration('success');
        } else {
            triggerVibration('soft');
        }
        didMove = true;
    } else if (targetCell.type === 'wall') {
        newEnergy -= PRISON_BREAK_COST;
        targetCell.strength -= 1;
        if (targetCell.strength <= 0) {
            targetCell.type = 'floor';
            triggerVibration('heavy');
        } else {
            triggerVibration('medium');
        }
        didMove = true; // Breaking a wall is also a move
    } else if (targetCell.type === 'exit') {
        newEnergy -= PRISON_BREAK_COST;
        setIsEscaped(true);
        setGameStatus('prison_escape_end');
        triggerVibration('success');
    }
    
    newGrid[index] = targetCell;
    
    if (didMove) {
        setPrisonStepanPosition(index);
        newPrisonMoves++;
        setPrisonMoves(newPrisonMoves);
    }
    
    setPrisonEnergy(newEnergy);

    // Artem Logic
    if (didMove && newPrisonMoves >= ARTEM_MOVE_TRIGGER && Math.random() < ARTEM_CHANCE_IN_PRISON) {
        triggerVibration('heavy');
        setShowArtemTakeover(true);
        setTimeout(() => setShowArtemTakeover(false), 3000);


        const oldExitIndex = newGrid.findIndex(c => c.type === 'exit');
        if (oldExitIndex !== -1) {
            newGrid[oldExitIndex] = { ...newGrid[oldExitIndex], type: 'wall', strength: PRISON_WALL_STRENGTH };
        }

        const possibleExits = [];
        for (let i = 0; i < gridSize * gridSize; i++) {
            const isBoundary = i < gridSize || i >= gridSize * (gridSize - 1) || i % gridSize === 0 || i % gridSize === gridSize - 1;
            const isCorner = i === 0 || i === gridSize - 1 || i === gridSize * (gridSize - 1) || i === (gridSize * gridSize) - 1;
            if (isBoundary && !isCorner && i !== oldExitIndex && newGrid[i].type === 'wall') {
                possibleExits.push(i);
            }
        }
        
        if (possibleExits.length > 0) {
            const newExitIndex = shuffleArray(possibleExits)[0];
            newGrid[newExitIndex] = { ...newGrid[newExitIndex], type: 'exit', strength: 0 };
        }
        
        setPrisonMoves(0);
    }
    
    setPrisonGrid(newGrid);

    if (newEnergy <= 0 && gameStatus !== 'prison_escape_end') {
      setIsEscaped(false);
      setGameStatus('prison_escape_end');
      triggerVibration('error');
    }
  };
  
  const handlePlantSeed = (plotId: number, seedId: string) => {
    const seed = SEEDS.find(s => s.id === seedId);
    if (!seed || coins < seed.cost) return;

    setCoins(c => c - seed.cost);
    const newPlots = farmPlots.map(p => p.id === plotId ? { ...p, seedId, plantTime: Date.now() } : p);
    setFarmPlots(newPlots);
    triggerVibration('light');
  };

  const handleHarvest = (plotId: number) => {
    const plot = farmPlots.find(p => p.id === plotId);
    if (!plot || !plot.seedId) return;

    const seed = SEEDS.find(s => s.id === plot.seedId);
    if (!seed) return;

    setCoins(c => c + seed.revenue);
    const newPlots = farmPlots.map(p => p.id === plotId ? { ...p, seedId: null, plantTime: null } : p);
    setFarmPlots(newPlots);
    triggerVibration('success');
    setBonusMessage(`+${seed.revenue} 🪙 Урожай собран!`);
    setTimeout(() => setBonusMessage(null), 2000);
  };
  
  const handleCucumberPlotClick = () => {
      const now = Date.now();
      if (cucumberPlot.lastHarvestTime && (now - cucumberPlot.lastHarvestTime) < CUCUMBER_COOLDOWN_MS) {
          triggerVibration('warning');
          setBonusMessage('Огурчики ещё отдыхают!');
          setTimeout(() => setBonusMessage(null), 2000);
          return;
      }

      setCoins(c => c + CUCUMBER_REWARD);
      setCucumberPlot({ ...cucumberPlot, lastHarvestTime: now });
      setBonusMessage(`+${CUCUMBER_REWARD} 🪙 Огурчики!`);
      setTimeout(() => setBonusMessage(null), 2000);
      triggerVibration('success');
  };

  const toggleMusic = () => {
    if (musicRef.current) {
        if (isMusicPlaying) {
            musicRef.current.pause();
        } else {
            musicRef.current.play().catch(e => console.error("Music play error:", e));
        }
        setIsMusicPlaying(!isMusicPlaying);
    }
  };
  
  const getShakeClass = () => {
    switch(shake) {
        case 'gentle': return 'animate-screen-shake-gentle';
        case 'intense': return 'animate-screen-shake-intense';
        default: return '';
    }
  }

  const renderContent = () => {
    if (!appInitialized) {
        return <div className="text-white text-2xl font-bold">Загрузка...</div>;
    }

    if (gameStatus === 'start_screen') {
      return <StartScreen 
        onStartNewGame={handleStartNewGame} 
        onContinueGame={handleContinueGame} 
        onStartFindStepanGame={handleStartFindStepanGame}
        onStartPrisonEscapeGame={handleStartPrisonEscapeGame}
        onStartFarmGame={handleStartFarmGame}
        onGoToStore={() => handleGoToStore('start_screen')}
        hasSaveData={hasSaveData} 
        userName={userName}
        coins={coins}
      />;
    }
    
    if (gameMode === 'find_stepan') {
      return (
        <FindStepanGame 
          grid={findStepanGrid}
          onSearch={handleSearchSpot}
          attemptsLeft={attemptsLeft}
          onReturnToMenu={handleReturnToMenu}
          purchasedUpgrades={purchasedUpgrades}
        />
      );
    }
    
    if (gameMode === 'prison_escape') {
        return (
            <PrisonEscapeGame
                grid={prisonGrid}
                onPrisonAction={handlePrisonAction}
                energy={prisonEnergy}
                onReturnToMenu={handleReturnToMenu}
                stepanPosition={prisonStepanPosition}
            />
        )
    }

    if (gameMode === 'farm') {
        return <FarmGame
            plots={farmPlots}
            cucumberPlot={cucumberPlot}
            onCucumberClick={handleCucumberPlotClick}
            coins={coins}
            onPlant={handlePlantSeed}
            onHarvest={handleHarvest}
            onReturnToMenu={handleReturnToMenu}
        />
    }

    if (gameMode === 'digging_game' || gameStatus === 'store') {
       const digTime = purchasedUpgrades.has('FASTER_DIG') 
        ? BASE_DIG_TIME * (1 - (UPGRADES.FASTER_DIG.value ?? 0)) 
        : BASE_DIG_TIME;

      return (
        <div className={`w-full h-full flex flex-col items-center ${getShakeClass()}`}>
          <Header/>
          {(gameStatus === 'playing' || gameStatus === 'digging' || gameStatus === 'muzzled') && (
            <div className="w-full flex-grow flex flex-col lg:flex-row gap-4 items-start justify-center mt-0 px-2 pb-4 min-h-0">
              <Scoreboard 
                foundItemsCount={foundTrash.length} 
                recentlyFoundItem={recentlyFoundItem}
                totalTrashCount={trashToFind} 
                level={level}
                coins={coins}
                anastasiaMood={anastasiaMood}
               />
              <div className="flex-grow w-full flex flex-col items-center justify-center min-h-0">
                 <GameBoard 
                    grid={grid} 
                    onDig={handleDig} 
                    stephanPosition={stephanPosition} 
                    isDigging={gameStatus === 'digging'}
                    isMuzzled={gameStatus === 'muzzled'}
                    equippedClothes={equippedClothes}
                    digTime={digTime}
                    level={level}
                  />
              </div>
            </div>
          )}

          {gameStatus === 'level_end' && (
            <LevelEndModal
                level={level}
                foundItems={lastLevelFoundTrash}
                onNextLevel={proceedToNextLevel}
                onGoToStore={() => handleGoToStore('level_end')}
            />
          )}
          
          {gameStatus === 'store' && (
            <UpgradeStore
                coins={coins}
                upgrades={Object.values(UPGRADES)}
                purchasedUpgrades={purchasedUpgrades}
                equippedClothes={equippedClothes}
                onBuyUpgrade={handleBuyUpgrade}
                onClose={handleCloseStore}
                anastasiaMood={anastasiaMood}
                closeButtonText={preStoreStatus === 'level_end' ? 'Далее' : 'Назад'}
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
    <main className="min-h-screen h-screen text-amber-900 flex flex-col items-center justify-center p-2 sm:p-4 selection:bg-lime-300 overflow-hidden">
      {gameStatus === 'start_screen' && <MusicToggle isPlaying={isMusicPlaying} onToggle={toggleMusic} />}
      
      {bonusMessage && (
        <div className="fixed top-24 z-50 bg-yellow-400 text-yellow-900 font-bold px-4 py-2 rounded-full animate-bounce">
            {bonusMessage}
        </div>
      )}

      {showArtemTakeover && <ArtemTakeover />}

      {gameStatus === 'find_stepan_end' && (
          <FindStepanEndModal 
            isFound={isStepanFound}
            onPlayAgain={handleStartFindStepanGame}
            onReturnToMenu={handleReturnToMenu}
          />
        )}
      {gameStatus === 'prison_escape_end' && (
          <PrisonEscapeEndModal
              isEscaped={isEscaped}
              onPlayAgain={handleStartPrisonEscapeGame}
              onReturnToMenu={handleReturnToMenu}
          />
      )}

      {renderContent()}
    </main>
  );
};

export default App;