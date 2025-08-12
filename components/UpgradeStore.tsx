import React from 'react';
import { Anastasia } from './Anastasia';
import { ANASTASIA_MAX_MOOD } from '../constants';
import type { Upgrade, UpgradeId } from '../types';

interface UpgradeStoreProps {
  onContinue: () => void;
  onBuyUpgrade: (upgradeId: UpgradeId) => void;
  coins: number;
  upgrades: Upgrade[];
  purchasedUpgrades: Set<UpgradeId>;
  equippedClothes: Set<UpgradeId>;
  anastasiaMood: number;
}

const UpgradeCard: React.FC<{
    upgrade: Upgrade, 
    onBuy: () => void, 
    coins: number, 
    isPurchased?: boolean,
    isEquipped?: boolean,
    isDisabled?: boolean,
}> = ({ upgrade, onBuy, coins, isPurchased, isEquipped, isDisabled }) => {
    const canAfford = coins >= upgrade.cost;
    
    let isButtonDisabled = isDisabled || (!isPurchased && !canAfford);
    let buttonText = `${upgrade.cost} 🪙`;
    let buttonClass = "bg-green-600 !border-green-800";
    
    if (upgrade.id === 'IMPROVE_MOOD') {
        isButtonDisabled = isDisabled || !canAfford;
    } else if (isPurchased) {
        if(upgrade.type === 'CLOTHING') {
            buttonText = isEquipped ? 'Снять' : 'Надеть';
            buttonClass = isEquipped ? "bg-yellow-500 !border-yellow-700" : "bg-sky-500 !border-sky-700";
            isButtonDisabled = false;
        } else {
            buttonText = 'Куплено';
            buttonClass = "bg-gray-400 !border-gray-600";
            isButtonDisabled = true;
        }
    }

    const cardClass = `flex flex-col sm:flex-row items-center justify-between bg-lime-100/70 p-4 rounded-xl shadow-md transition-all duration-300 ${isPurchased && upgrade.type !== 'CLOTHING' && upgrade.id !== 'IMPROVE_MOOD' ? 'opacity-60 grayscale-[50%]' : ''}`;
    const iconClass = upgrade.id === 'IMPROVE_MOOD' ? `w-12 h-12 object-contain` : ``;

    return (
        <div className={cardClass}>
            <div className="flex items-center gap-4 mb-3 sm:mb-0 text-left w-full">
                <div className="text-4xl bg-white/50 rounded-lg p-2 shadow-inner flex items-center justify-center w-16 h-16">
                  {upgrade.icon?.startsWith('http') ? <img src={upgrade.icon} alt={upgrade.name} className={iconClass}/> : upgrade.icon}
                </div>
                <div className="flex-grow">
                    <h3 className="font-bold text-lg text-lime-900">{upgrade.name}</h3>
                    <p className="text-lime-800 text-sm">{upgrade.description}</p>
                </div>
            </div>
            <button
                onClick={onBuy}
                disabled={isButtonDisabled}
                className={`btn-3d text-white font-bold py-2 px-5 rounded-lg transition-all duration-200 w-full sm:w-auto shrink-0 ${buttonClass} disabled:bg-gray-400 disabled:!border-gray-600 disabled:cursor-not-allowed`}
            >
                {buttonText}
            </button>
        </div>
    );
};

export const UpgradeStore: React.FC<UpgradeStoreProps> = ({ onContinue, onBuyUpgrade, coins, upgrades, purchasedUpgrades, equippedClothes, anastasiaMood }) => {
  const toolUpgrades = upgrades.filter(u => u.type === 'TOOL');
  const clothingUpgrades = upgrades.filter(u => u.type === 'CLOTHING');
  const anastasiaUpgrades = upgrades.filter(u => u.type === 'ANASTASIA' && u.id !== 'IMPROVE_MOOD');
  const moodUpgrade = upgrades.find(u => u.id === 'IMPROVE_MOOD')!;
  
  return (
    <div className="fixed inset-0 bg-amber-100/95 backdrop-blur-sm flex flex-col items-center justify-center z-50 animate-fade-in p-2 sm:p-4">
       <div className="w-full max-w-2xl bg-gradient-to-br from-amber-200 to-yellow-200 p-4 sm:p-6 rounded-3xl shadow-2xl border-4 border-amber-300/50 panel-3d">
         <div className="text-center mb-6">
            <Anastasia message="Привет! Посмотри, что у меня есть для вас."/>
            <h2 className="text-3xl sm:text-4xl font-black text-amber-900 mt-4 drop-shadow-md">Магазин</h2>
            <p className="text-xl font-bold text-amber-700 mt-2">У тебя {coins} 🪙</p>
         </div>

         <div className="space-y-6 mb-6 max-h-[55vh] sm:max-h-[60vh] overflow-y-auto pr-2 rounded-lg">
            {/* Anastasia Mood */}
            <div>
                <h3 className="text-2xl font-bold text-lime-800 mb-3 ml-1">Порадовать Анастасию</h3>
                 <UpgradeCard
                    key={moodUpgrade.id}
                    upgrade={moodUpgrade}
                    onBuy={() => onBuyUpgrade(moodUpgrade.id)}
                    coins={coins}
                    isDisabled={anastasiaMood >= ANASTASIA_MAX_MOOD}
                 />
            </div>
            {/* Tools */}
            <div>
                <h3 className="text-2xl font-bold text-lime-800 mb-3 ml-1">Инструменты</h3>
                <div className="space-y-3">
                    {toolUpgrades.map(upgrade => (
                         <UpgradeCard key={upgrade.id} upgrade={upgrade} onBuy={() => onBuyUpgrade(upgrade.id)} coins={coins} isPurchased={purchasedUpgrades.has(upgrade.id)} />
                    ))}
                </div>
            </div>
             {/* Clothes */}
             <div>
                <h3 className="text-2xl font-bold text-lime-800 mb-3 ml-1">Одежда</h3>
                <div className="space-y-3">
                    {clothingUpgrades.map(upgrade => (
                         <UpgradeCard key={upgrade.id} upgrade={upgrade} onBuy={() => onBuyUpgrade(upgrade.id)} coins={coins} isPurchased={purchasedUpgrades.has(upgrade.id)} isEquipped={equippedClothes.has(upgrade.id)} />
                    ))}
                </div>
            </div>
            {/* Anastasia */}
            <div>
                <h3 className="text-2xl font-bold text-lime-800 mb-3 ml-1">Для "Найди Стёпу"</h3>
                <div className="space-y-3">
                    {anastasiaUpgrades.map(upgrade => (
                         <UpgradeCard key={upgrade.id} upgrade={upgrade} onBuy={() => onBuyUpgrade(upgrade.id)} coins={coins} isPurchased={purchasedUpgrades.has(upgrade.id)} />
                    ))}
                </div>
            </div>
         </div>

         <div className="text-center mt-4">
             <button
                onClick={onContinue}
                className="btn-3d text-white font-bold py-3 px-8 rounded-full text-xl !bg-lime-600 !border-lime-800"
             >
                Продолжить
            </button>
         </div>
       </div>
    </div>
  );
};