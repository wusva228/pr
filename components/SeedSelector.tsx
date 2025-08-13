import React from 'react';
import { SEEDS } from '../constants';
import { Seed } from '../types';

interface SeedSelectorProps {
    coins: number;
    onSelectSeed: (seed: Seed) => void;
    onClose: () => void;
}

const SeedOption: React.FC<{ seed: Seed, canAfford: boolean, onSelect: () => void }> = ({ seed, canAfford, onSelect }) => {
    return (
        <button
            onClick={onSelect}
            disabled={!canAfford}
            className={`w-full flex items-center justify-between p-3 rounded-lg transition-colors ${canAfford ? 'bg-lime-200 hover:bg-lime-300' : 'bg-gray-200 opacity-60'}`}
        >
            <div className="flex items-center gap-4">
                <span className="text-4xl">{seed.emoji}</span>
                <div>
                    <p className="font-bold text-lg text-left text-lime-900">{seed.name}</p>
                    <p className="text-sm text-left text-lime-800">Доход: {seed.revenue} 🪙</p>
                </div>
            </div>
            <p className={`font-bold text-lg ${canAfford ? 'text-amber-800' : 'text-gray-500'}`}>{seed.cost} 🪙</p>
        </button>
    );
};


export const SeedSelector: React.FC<SeedSelectorProps> = ({ coins, onSelectSeed, onClose }) => {
    return (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 animate-fade-in p-4" onClick={onClose}>
            <div 
                className="bg-gradient-to-br from-amber-200 to-yellow-200 p-6 rounded-3xl shadow-2xl border-4 border-white/50 max-w-sm w-full panel-3d"
                onClick={e => e.stopPropagation()}
            >
                <h2 className="text-2xl font-black text-center text-amber-900 mb-4">Выбери семена</h2>
                <div className="space-y-3">
                    {SEEDS.map(seed => (
                        <SeedOption
                            key={seed.id}
                            seed={seed}
                            canAfford={coins >= seed.cost}
                            onSelect={() => onSelectSeed(seed)}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
};
