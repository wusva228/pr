import React, { useState, useEffect, useRef, useCallback } from 'react';
import { ShopItem, TrashItem } from '../types';
import { UPGRADES, CONSUMABLES, SPECIAL_ITEMS, ANASTASIA_OUTFITS, INITIAL_COINS, INITIAL_LEVEL, XP_PER_SEARCH, XP_TO_NEXT_LEVEL, INITIAL_SEARCH_POWER, MUZZLE_CLICKS_NEEDED, INITIAL_FOOD, INITIAL_WATER, SEARCH_COST_FOOD, SEARCH_COST_WATER, DECAY_RATE_FOOD, DECAY_RATE_WATER, SUGAR_RUSH_DURATION, SUGAR_RUSH_COOLDOWN, SUGAR_RUSH_POWER_MULTIPLIER, CORGI_ICON_URL, ANASTASIA_ICON_URL, ARTYOM_ICON_URL, TRASH_ITEMS, ARTYOM_EVENT_CHANCE, ARTYOM_STEAL_PERCENT } from '../constants';
import PawIcon from './PawIcon';
import ArtyomBossScreen from './ArtyomBossScreen';
import { hapticImpact, hapticNotification, hapticSelection } from '../services/haptics';

const CoinIcon = () => <span className="text-yellow-400 text-lg drop-shadow-sm">💰</span>;

// Claymorphism styles
const clayPanelClass = "bg-amber-100/70 backdrop-blur-sm rounded-3xl shadow-[7px_7px_20px_#c5b377,-7px_-7px_20px_#ffffff] p-3 sm:p-4 border-2 border-white/50";
const clayButtonClass = "w-full text-xl font-bold rounded-2xl border-b-8 border-t-2 border-x-2 transition-all duration-150 ease-in-out transform active:scale-[0.97] active:border-b-4 disabled:bg-gray-400 disabled:border-gray-500 disabled:cursor-not-allowed disabled:scale-100";

interface GameState {
    coins: number;
    level: number;
    xp: number;
    searchPower: number;
    purchasedItems: string[];
    food: number;
    water: number;
    hasSugarBone: boolean;
    lastSaveTimestamp: number;
}


const StatusBar: React.FC<{ label: string, value: number, maxValue: number, colorClass: string, icon: React.ReactNode }> = ({ label, value, maxValue, colorClass, icon }) => {
  const percentage = Math.max(0, (value / maxValue) * 100);
  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-1 text-sm font-semibold text-stone-600">
        <div className="flex items-center gap-1">
          {icon}
          <span>{label}</span>
        </div>
        <span>{Math.ceil(value)}%</span>
      </div>
      <div className="w-full bg-stone-200/70 rounded-full h-4 shadow-[inset_2px_2px_4px_#b0b0b0,inset_-2px_-2px_4px_#ffffff]">
        <div className={`${colorClass} h-4 rounded-full transition-all duration-300 ease-in-out`} style={{ width: `${percentage}%` }}></div>
      </div>
    </div>
  );
};

const ShopCard: React.FC<{ item: ShopItem; onBuy: (item: ShopItem) => void; canAfford: boolean; isOwned?: boolean }> = ({ item, onBuy, canAfford, isOwned }) => {
  const buttonDisabled = isOwned || !canAfford;
  
  return (
    <div className={`p-3 rounded-2xl flex flex-col items-center text-center transition-all duration-300 ${isOwned ? 'bg-green-200/70 shadow-[inset_3px_3px_7px_#b8e0b8,inset_-3px_-3px_7px_#ffffff]' : 'bg-white/60 shadow-lg'} w-36 flex-shrink-0`}>
      <div className="text-4xl mb-2">{item.icon}</div>
      <h3 className="font-bold text-sm text-stone-800 h-10 flex items-center">{item.name}</h3>
      <p className="text-xs text-stone-600 flex-grow h-12">{item.description}</p>
      {'cost' in item && (
        isOwned ? (
          <div className="mt-2 h-10 flex items-center font-bold text-green-700">Куплено</div>
        ) : (
          <button
            onClick={() => { onBuy(item); hapticImpact('light'); }}
            disabled={buttonDisabled}
            className="mt-2 h-10 w-full bg-gradient-to-br from-orange-400 to-amber-500 text-white font-bold py-1 px-2 rounded-lg shadow-md hover:from-orange-500 hover:to-amber-600 disabled:from-gray-300 disabled:to-gray-400 disabled:cursor-not-allowed transition-all transform hover:scale-105 active:scale-95 disabled:scale-100 flex items-center justify-center gap-1"
          >
            {item.cost} <CoinIcon />
          </button>
        )
      )}
    </div>
  );
};

export default function MainGame({ onBack }: { onBack: () => void }) {
  const [messages, setMessages] = useState<string[]>([]);
  const [coins, setCoins] = useState<number>(INITIAL_COINS);
  const [level, setLevel] = useState<number>(INITIAL_LEVEL);
  const [xp, setXp] = useState<number>(0);
  const [searchPower, setSearchPower] = useState<number>(INITIAL_SEARCH_POWER);
  const [purchasedItems, setPurchasedItems] = useState<string[]>([]);
  const [food, setFood] = useState(INITIAL_FOOD);
  const [water, setWater] = useState(INITIAL_WATER);

  // Events state
  const [isMuzzleActive, setIsMuzzleActive] = useState<boolean>(false);
  const [muzzleClicks, setMuzzleClicks] = useState<number>(0);
  const [showArtyomBossScreen, setShowArtyomBossScreen] = useState<boolean>(false);

  // Sugar Rush state
  const [hasSugarBone, setHasSugarBone] = useState(false);
  const [isSugarRushActive, setIsSugarRushActive] = useState(false);
  const [sugarRushTimer, setSugarRushTimer] = useState(0);
  const [sugarRushCooldown, setSugarRushCooldown] = useState(0);
  
  const [isActionInProgress, setIsActionInProgress] = useState<boolean>(false);
  const logEndRef = useRef<HTMLDivElement>(null);

  const addMessage = useCallback((newMessage: string) => {
    setMessages(prev => [...prev.slice(-10), newMessage]);
  }, []);
  
  // Load game state from localStorage
  useEffect(() => {
    const savedStateJSON = localStorage.getItem('corgiGameState');
    if (savedStateJSON) {
        const savedState: GameState = JSON.parse(savedStateJSON);
        setCoins(savedState.coins);
        setLevel(savedState.level);
        setXp(savedState.xp);
        setSearchPower(savedState.searchPower);
        setPurchasedItems(savedState.purchasedItems);
        setHasSugarBone(savedState.hasSugarBone);

        // Offline progress calculation
        const timeOfflineInSeconds = Math.floor((Date.now() - savedState.lastSaveTimestamp) / 1000);
        const foodConsumed = timeOfflineInSeconds * DECAY_RATE_FOOD;
        const waterConsumed = timeOfflineInSeconds * DECAY_RATE_WATER;
        
        setFood(Math.max(0, savedState.food - foodConsumed));
        setWater(Math.max(0, savedState.water - waterConsumed));
        
        addMessage('С возвращением! Степан вас заждался.');
        if (timeOfflineInSeconds > 60) {
             addMessage(`Пока вас не было, Степан немного проголодался и захотел пить.`);
        }
    } else {
        addMessage('Привет! Я Степан, корги-искатель сокровищ! Помоги мне найти что-нибудь интересное для моей хозяйки Анастасии.');
    }
  }, [addMessage]);

  // Save game state to localStorage whenever it changes
  useEffect(() => {
    const gameState: GameState = {
        coins, level, xp, searchPower, purchasedItems, food, water, hasSugarBone, lastSaveTimestamp: Date.now()
    };
    localStorage.setItem('corgiGameState', JSON.stringify(gameState));
  }, [coins, level, xp, searchPower, purchasedItems, food, water, hasSugarBone]);


  useEffect(() => {
    logEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);
  
  // Game Tick for resource decay and timers
  useEffect(() => {
    const gameTick = setInterval(() => {
        setFood(f => Math.max(0, f - DECAY_RATE_FOOD));
        setWater(w => Math.max(0, w - DECAY_RATE_WATER));
        setSugarRushTimer(t => Math.max(0, t - 1));
        setSugarRushCooldown(c => Math.max(0, c - 1));
    }, 1000);
    return () => clearInterval(gameTick);
  }, []);

  // This effect handles the logic for when the sugar rush ends.
  useEffect(() => {
    if (isSugarRushActive && sugarRushTimer === 0) {
        setIsSugarRushActive(false);
        setSugarRushCooldown(SUGAR_RUSH_COOLDOWN);
        addMessage("Эффект от сахарной косточки прошел. Степан устал.");
    }
  }, [isSugarRushActive, sugarRushTimer, addMessage]);
  
  const handleLevelUp = useCallback(() => {
      const newLevel = level + 1;
      setLevel(newLevel);
      setXp(xp - XP_TO_NEXT_LEVEL);
      setSearchPower(p => p + 0.2); // Level up bonus
      addMessage(`🎉 УРОВЕНЬ ПОВЫШЕН! Степан теперь ${newLevel} уровня! Нюх стал острее!`);
      hapticNotification('success');
  }, [level, xp, addMessage]);

  useEffect(() => {
      if (xp >= XP_TO_NEXT_LEVEL) {
          handleLevelUp();
      }
  }, [xp, handleLevelUp]);
  
  const handleSearch = useCallback(() => {
    hapticSelection();
    if (isSugarRushActive) {} 
    else {
        if(isActionInProgress) return;
        setIsActionInProgress(true);
    }
    if (food <= 0) {
        addMessage('Степан слишком голоден. Нужно купить еды!');
        setIsActionInProgress(false);
        return;
    }
    if (water <= 0) {
        addMessage('Степан хочет пить. Нужно купить воды!');
        setIsActionInProgress(false);
        return;
    }
    setFood(f => f - SEARCH_COST_FOOD);
    setWater(w => w - SEARCH_COST_WATER);
    setXp(x => x + XP_PER_SEARCH);
    addMessage('Степан усердно нюхает землю...');
    
    setTimeout(() => {
      const currentPower = isSugarRushActive ? searchPower * SUGAR_RUSH_POWER_MULTIPLIER : searchPower;
      
      const eventRoll = Math.random();
      if (eventRoll < ARTYOM_EVENT_CHANCE && coins > 10) {
          addMessage('🚨 ВНИМАНИЕ! Появился коварный Артём! Он хочет украсть мусор!');
          hapticNotification('warning');
          setShowArtyomBossScreen(true);
      } else if (eventRoll < 0.2 && purchasedItems.length > 0 && !isMuzzleActive) {
        addMessage('О нет! Враг Намордник появился! Быстро кликай по лапе, чтобы прогнать его!');
        setIsMuzzleActive(true);
        hapticNotification('warning');
      } else if (eventRoll < 0.3) {
          addMessage('Упс! Степан отвлекся на ворону. Ничего не найдено.');
      } else {
        const findableTrash = TRASH_ITEMS.filter(t => t.unlockLevel <= level);
        const foundItem = findableTrash[Math.floor(Math.random() * findableTrash.length)];
        const foundCoins = Math.floor(foundItem.value * currentPower);
        
        setCoins(prev => prev + foundCoins);
        addMessage(`Ура! ${foundItem.icon} Степан нашел "${foundItem.name}"! +${foundCoins} монет!`);
        hapticImpact('light');
      }
      if(!isSugarRushActive) setIsActionInProgress(false);
    }, isSugarRushActive ? 300 : 1500);
  }, [searchPower, purchasedItems.length, isMuzzleActive, addMessage, coins, food, water, isSugarRushActive, isActionInProgress, level]);

  const handleBuy = (item: ShopItem) => {
    if (coins < item.cost) {
      addMessage("Недостаточно монет!");
      hapticNotification('error');
      return;
    }

    if ('refillAmount' in item) {
      setCoins(prev => prev - item.cost);
      if (item.id === 'food') setFood(INITIAL_FOOD);
      if (item.id === 'water') setWater(INITIAL_WATER);
      addMessage(`Степан с удовольствием съел "${item.name}"!`);
      hapticNotification('success');
      return;
    }

    if (purchasedItems.includes(item.id)) {
      addMessage("Этот предмет уже куплен.");
      return;
    }

    setCoins(prev => prev - item.cost);
    setPurchasedItems(prev => [...prev, item.id]);
    
    if ('powerBoost' in item) {
      setSearchPower(prev => prev * item.powerBoost);
      addMessage(`Куплено: "${item.name}". Сила поиска увеличена!`);
    } else if (item.id === 'sugarBone') {
      setHasSugarBone(true);
      addMessage(`Куплено: "${item.name}"! Появилась новая способность!`);
    } else {
      addMessage(`Куплено для Анастасии: "${item.name}"! Она в восторге!`);
    }
    hapticNotification('success');
  };
  
  const activateSugarRush = () => {
    if (!hasSugarBone || sugarRushCooldown > 0) return;
    hapticImpact('heavy');
    setIsSugarRushActive(true);
    setSugarRushTimer(SUGAR_RUSH_DURATION);
    addMessage("САХАРНЫЙ РЫВОК! Степан ищет в 3 раза быстрее! Жми!");
  };

  const handlePawClick = () => {
    if (!isMuzzleActive) return;
    hapticImpact('light');
    const newClickCount = muzzleClicks + 1;
    setMuzzleClicks(newClickCount);
    if (newClickCount >= MUZZLE_CLICKS_NEEDED) {
      addMessage('Получилось! Намордник улетел! Путь свободен.');
      setIsMuzzleActive(false);
      setMuzzleClicks(0);
      hapticNotification('success');
    }
  };

  const handleArtyomWin = () => {
    addMessage('Степан прогнал Артёма и защитил свои сокровища!');
    setShowArtyomBossScreen(false);
    hapticNotification('success');
  };

  const handleArtyomLose = () => {
    const stolenCoins = Math.floor(coins * ARTYOM_STEAL_PERCENT);
    setCoins(c => c - stolenCoins);
    addMessage(`Артём убежал и унёс ${stolenCoins} монет! 😠`);
    setShowArtyomBossScreen(false);
    hapticNotification('error');
  };
  
  const searchButtonDisabled = isActionInProgress || isMuzzleActive || food <= 0 || water <= 0;
  const xpPercentage = (xp / XP_TO_NEXT_LEVEL) * 100;
  
  const [shopTab, setShopTab] = useState<'stepan' | 'anastasia'>('stepan');

  return (
    <div className="min-h-screen text-stone-800 p-2 sm:p-4 flex flex-col bg-gradient-to-br from-amber-300 via-orange-200 to-amber-300">
      {showArtyomBossScreen && <ArtyomBossScreen onWin={handleArtyomWin} onLose={handleArtyomLose} />}
      <div className="w-full max-w-2xl mx-auto flex flex-col flex-grow">
        <header className="flex justify-between items-center p-2 sm:p-4 text-center">
            <button onClick={onBack} className="text-sm font-bold bg-white/70 py-2 px-4 rounded-xl shadow-md transition-transform hover:scale-105">Меню</button>
            <h1 className="text-2xl sm:text-3xl font-bold text-amber-900 drop-shadow-md">Приключения Степана</h1>
            <div className="w-16 text-center font-bold text-amber-900 drop-shadow-md">Lvl {level}</div>
        </header>

        <main className="flex-grow flex flex-col gap-4">
          <div className={clayPanelClass}>
             <div className="flex flex-col md:flex-row items-center gap-4">
                <div className="flex-shrink-0 relative">
                    <img src={CORGI_ICON_URL} alt="Корги" className="h-28 w-28 drop-shadow-lg object-contain" />
                     {isSugarRushActive && <div className="absolute top-0 right-0 text-5xl animate-ping">✨</div>}
                </div>
                <div className="w-full space-y-2">
                  <div className="flex justify-between items-center bg-white/50 rounded-full px-4 py-2 shadow-[inset_2px_2px_4px_#d1d1d1,inset_-2px_-2px_4px_#ffffff]">
                    <span className="font-bold text-lg text-stone-700">Монеты</span>
                    <div className="flex items-center gap-2 font-bold text-xl text-amber-700">
                      {coins} <CoinIcon />
                    </div>
                  </div>
                  <StatusBar label="Сытость" value={food} maxValue={INITIAL_FOOD} colorClass="bg-gradient-to-r from-green-400 to-lime-500" icon={<>🍖</>} />
                  <StatusBar label="Вода" value={water} maxValue={INITIAL_WATER} colorClass="bg-gradient-to-r from-blue-400 to-cyan-500" icon={<>💧</>} />
                </div>
             </div>
             <div className="mt-3">
                 <div className="text-center text-sm font-semibold text-stone-600 mb-1">Опыт: {xp} / {XP_TO_NEXT_LEVEL}</div>
                  <div className="w-full bg-stone-200/70 rounded-full h-4 shadow-[inset_2px_2px_4px_#b0b0b0,inset_-2px_-2px_4px_#ffffff]">
                    <div className="bg-gradient-to-r from-purple-400 to-indigo-500 h-4 rounded-full transition-all duration-300 ease-in-out" style={{ width: `${xpPercentage}%` }}></div>
                </div>
             </div>
          </div>
          
          <div className={`${clayPanelClass} flex-grow flex flex-col h-48 md:h-64`}>
            <div className="flex-grow p-1 overflow-y-auto">
              <div className="space-y-2">
                {messages.map((msg, index) => (
                  <div key={index} className="p-2 bg-amber-100/80 rounded-lg text-sm text-stone-700 animate-fade-in shadow-sm">
                    {msg}
                  </div>
                ))}
                <div ref={logEndRef} />
              </div>
            </div>
          </div>
          
          <div className={clayPanelClass}>
            {isMuzzleActive ? (
              <div className="flex flex-col items-center justify-center animate-pulse">
                <h3 className="text-lg font-bold text-red-600 mb-2 text-center">ПРОГНАТЬ НАМОРДНИК!</h3>
                <PawIcon onClick={handlePawClick} />
                <p className="mt-1 text-stone-600 font-semibold text-sm">Нажато: {muzzleClicks} / {MUZZLE_CLICKS_NEEDED}</p>
              </div>
            ) : (
                <div className="flex flex-col gap-3">
                    <button onClick={handleSearch} disabled={searchButtonDisabled && !isSugarRushActive} className={`${clayButtonClass} bg-green-500 border-green-700 text-white py-4`}>
                      {isActionInProgress ? 'Ищем...' : 'Искать сокровище!'}
                    </button>
                    {hasSugarBone && (
                        <button onClick={activateSugarRush} disabled={isSugarRushActive || sugarRushCooldown > 0} className={`${clayButtonClass} bg-pink-500 border-pink-700 text-white py-3`}>
                            {isSugarRushActive ? `Рывок! ${sugarRushTimer}с` : sugarRushCooldown > 0 ? `Перезарядка: ${sugarRushCooldown}с` : 'Сахарный рывок! ✨'}
                        </button>
                    )}
                </div>
            )}
          </div>
          
          <div className={clayPanelClass}>
            <div className="flex justify-center items-center gap-4 mb-3 border-b-2 border-amber-300 pb-2">
                <button onClick={() => setShopTab('stepan')} className={`font-bold transition-colors ${shopTab === 'stepan' ? 'text-amber-800' : 'text-amber-600/70'}`}>Для Степана</button>
                <button onClick={() => setShopTab('anastasia')} className={`font-bold transition-colors ${shopTab === 'anastasia' ? 'text-amber-800' : 'text-amber-600/70'}`}>Для Анастасии</button>
            </div>
            
            {shopTab === 'stepan' && (
                <div className="flex gap-3 overflow-x-auto pb-3">
                {[...CONSUMABLES, ...SPECIAL_ITEMS, ...UPGRADES].map(item => (
                    <ShopCard 
                        key={item.id} 
                        item={item} 
                        onBuy={handleBuy} 
                        canAfford={coins >= item.cost} 
                        isOwned={'refillAmount' in item ? false : purchasedItems.includes(item.id)}
                    />
                ))}
                </div>
            )}

            {shopTab === 'anastasia' && (
                 <div className="flex gap-3 overflow-x-auto pb-3">
                 {ANASTASIA_OUTFITS.map(item => (
                     <ShopCard key={item.id} item={item} onBuy={handleBuy} canAfford={coins >= item.cost} isOwned={purchasedItems.includes(item.id)}/>
                 ))}
                 </div>
            )}
          </div>
        </main>
      </div>
      <style>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in { animation: fade-in 0.4s ease-out forwards; }
      `}</style>
    </div>
  );
}