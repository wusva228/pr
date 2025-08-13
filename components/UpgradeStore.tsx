import React, { useState } from 'react';
import { Anastasia } from './Anastasia';
import { ANASTASIA_MAX_MOOD, SEEDS } from '../constants';
import type { Upgrade, UpgradeId, Seed } from '../types';

interface UpgradeStoreProps {
  onClose: () => void;
  onBuyUpgrade: (upgradeId: UpgradeId) => void;
  coins: number;
  upgrades: Upgrade[];
  purchasedUpgrades: Set<UpgradeId>;
  equippedClothes: Set<UpgradeId>;
  anastasiaMood: number;
  closeButtonText: string;
}

const UpgradeCard: React.FC<{
    upgrade: Upgrade, 
    onBuy: () => void, 
    coins: number, 
    isPurchased?: boolean,
    isEquipped?: boolean,
    anastasiaMood: number;
}> = ({ upgrade, onBuy, coins, isPurchased, isEquipped, anastasiaMood }) => {
    const canAfford = coins >= upgrade.cost;
    
    let isButtonDisabled = false;
    let buttonText = `${upgrade.cost} 🪙`;
    let buttonClass = "bg-green-600 !border-green-800";
    
    if (upgrade.id === 'IMPROVE_MOOD') {
        if(anastasiaMood >= ANASTASIA_MAX_MOOD) {
            buttonText = 'Настроение макс.';
            isButtonDisabled = true;
        } else {
            isButtonDisabled = !canAfford;
        }
    } else if (isPurchased) {
        if(upgrade.type === 'CLOTHING') {
            buttonText = isEquipped ? 'Снять' : 'Надеть';
            buttonClass = isEquipped ? "bg-yellow-500 !border-yellow-700" : "bg-sky-500 !border-sky-700";
        } else {
            buttonText = 'Куплено';
            isButtonDisabled = true;
        }
    } else {
        isButtonDisabled = !canAfford;
    }

    if (isButtonDisabled && !(upgrade.type === 'CLOTHING' && isPurchased)) {
         buttonClass = "bg-gray-400 !border-gray-600";
    }

    const cardClass = `flex flex-col sm:flex-row items-center justify-between bg-lime-100/70 p-4 rounded-xl shadow-md transition-all duration-300 ${isPurchased && upgrade.type !== 'CLOTHING' && upgrade.id !== 'IMPROVE_MOOD' ? 'opacity-60 grayscale-[50%]' : ''}`;
    const iconClass = upgrade.id === 'IMPROVE_MOOD' ? `w-12 h-12 object-contain` : ``;

    return (
        <div className={cardClass}>
            <div className="flex items-center gap-4 mb-3 sm:mb-0 text-left w-full">
                <div className="text-4xl bg-white/50 rounded-lg p-2 shadow-inner flex items-center justify-center w-16 h-16">
                  {upgrade.icon?.startsWith('http') ? <img src={upgrade.icon} alt={upgrade.name} className={iconClass}/> : <span>{upgrade.icon}</span>}
                </div>
                <div className="flex-grow">
                    <h3 className="font-bold text-lg text-lime-900">{upgrade.name}</h3>
                    <p className="text-lime-800 text-sm">{upgrade.description}</p>
                </div>
            </div>
            <button
                onClick={onBuy}
                disabled={isButtonDisabled}
                className={`btn-3d text-white font-bold py-2 px-5 rounded-lg transition-all duration-200 w-full sm:w-auto shrink-0 ${buttonClass} disabled:cursor-not-allowed`}
            >
                {buttonText}
            </button>
        </div>
    );
};

const SeedCard: React.FC<{ seed: Seed }> = ({ seed }) => {
    return (
        <div className="flex items-center justify-between bg-lime-100/70 p-4 rounded-xl shadow-md">
            <div className="flex items-center gap-4 text-left">
                <div className="text-4xl bg-white/50 rounded-lg p-2 shadow-inner">{seed.emoji}</div>
                <div>
                    <h3 className="font-bold text-lg text-lime-900">{seed.name}</h3>
                    <p className="text-lime-800 text-sm">
                        Растёт: {seed.growthTime / 60} мин. Доход: {seed.revenue} 🪙
                    </p>
                </div>
            </div>
            <div className="text-right">
                <p className="font-bold text-lg text-amber-800">{seed.cost} 🪙</p>
                <p className="text-sm text-amber-700">за посадку</p>
            </div>
        </div>
    )
}

export const UpgradeStore: React.FC<UpgradeStoreProps> = ({ onClose, onBuyUpgrade, coins, upgrades, purchasedUpgrades, equippedClothes, anastasiaMood, closeButtonText }) => {
  const [activeTab, setActiveTab] = useState<'upgrades' | 'seeds'>('upgrades');

  const toolUpgrades = upgrades.filter(u => u.type === 'TOOL');
  const clothingUpgrades = upgrades.filter(u => u.type === 'CLOTHING');
  const anastasiaUpgrades = upgrades.filter(u => u.type === 'ANASTASIA' && u.id !== 'IMPROVE_MOOD');
  const moodUpgrade = upgrades.find(u => u.id === 'IMPROVE_MOOD')!;
  
  const TabButton: React.FC<{tabId: 'upgrades' | 'seeds', children: React.ReactNode}> = ({tabId, children}) => {
    const isActive = activeTab === tabId;
    return (
        <button onClick={() => setActiveTab(tabId)} className={`px-4 py-2 font-bold rounded-t-lg transition-colors ${isActive ? 'bg-amber-200 text-amber-900' : 'bg-amber-300/50 text-amber-700 hover:bg-amber-300/80'}`}>
            {children}
        </button>
    )
  }

  return (
    <div className="fixed inset-0 bg-amber-100/95 backdrop-blur-sm flex flex-col items-center justify-center z-50 animate-fade-in p-2 sm:p-4">
       <div className="w-full max-w-2xl bg-gradient-to-br from-amber-200 to-yellow-200 p-4 sm:p-6 rounded-3xl shadow-2xl border-4 border-amber-300/50 panel-3d">
         <div className="text-center mb-4">
            <Anastasia message="Привет! Посмотри, что у меня есть для вас."/>
            <h2 className="text-3xl sm:text-4xl font-black text-amber-900 mt-4 drop-shadow-md">Магазин</h2>
            <p className="text-xl font-bold text-amber-700 mt-2">У тебя {coins} 🪙</p>
         </div>

         <div className="border-b-4 border-amber-300/80 mb-2">
            <TabButton tabId="upgrades">Улучшения</TabButton>
            <TabButton tabId="seeds">Семена</TabButton>
         </div>

         <div className="space-y-6 mb-6 max-h-[45vh] sm:max-h-[50vh] overflow-y-auto pr-2 rounded-lg">
            {activeTab === 'upgrades' && (
                <div className="space-y-6">
                    <div>
                        <h3 className="text-xl font-bold text-lime-800 mb-3 ml-1">Порадовать Анастасию</h3>
                        <UpgradeCard key={moodUpgrade.id} upgrade={moodUpgrade} onBuy={() => onBuyUpgrade(moodUpgrade.id)} coins={coins} anastasiaMood={anastasiaMood} />
                    </div>
                    <div>
                        <h3 className="text-xl font-bold text-lime-800 mb-3 ml-1">Инструменты</h3>
                        <div className="space-y-3">
                            {toolUpgrades.map(upgrade => ( <UpgradeCard key={upgrade.id} upgrade={upgrade} onBuy={() => onBuyUpgrade(upgrade.id)} coins={coins} isPurchased={purchasedUpgrades.has(upgrade.id)} anastasiaMood={anastasiaMood} /> ))}
                        </div>
                    </div>
                    <div>
                        <h3 className="text-xl font-bold text-lime-800 mb-3 ml-1">Одежда</h3>
                        <div className="space-y-3">
                            {clothingUpgrades.map(upgrade => ( <UpgradeCard key={upgrade.id} upgrade={upgrade} onBuy={() => onBuyUpgrade(upgrade.id)} coins={coins} isPurchased={purchasedUpgrades.has(upgrade.id)} isEquipped={equippedClothes.has(upgrade.id)} anastasiaMood={anastasiaMood} /> ))}
                        </div>
                    </div>
                    <div>
                        <h3 className="text-xl font-bold text-lime-800 mb-3 ml-1">Для "Найди Стёпу"</h3>
                        <div className="space-y-3">
                            {anastasiaUpgrades.map(upgrade => ( <UpgradeCard key={upgrade.id} upgrade={upgrade} onBuy={() => onBuyUpgrade(upgrade.id)} coins={coins} isPurchased={purchasedUpgrades.has(upgrade.id)} anastasiaMood={anastasiaMood} /> ))}
                        </div>
                    </div>
                </div>
            )}
            {activeTab === 'seeds' && (
                <div className="space-y-3">
                    {SEEDS.map(seed => (
                        <SeedCard key={seed.id} seed={seed} />
                    ))}
                </div>
            )}
         </div>

         <div className="text-center mt-4">
             <button
                onClick={onClose}
                className="btn-3d text-white font-bold py-3 px-8 rounded-full text-xl !bg-lime-600 !border-lime-800"
             >
                {closeButtonText}
            </button>
         </div>
       </div>
    </div>
  );
};