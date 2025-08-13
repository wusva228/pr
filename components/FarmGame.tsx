import React, { useState } from 'react';
import { FarmPlot as FarmPlotComponent } from './FarmPlot';
import { SeedSelector } from './SeedSelector';
import { FarmPlotState, Seed } from '../types';
import { SEEDS } from '../constants';

interface FarmGameProps {
    plots: FarmPlotState[];
    coins: number;
    onPlant: (plotId: number, seedId: string) => void;
    onHarvest: (plotId: number) => void;
    onReturnToMenu: () => void;
}

export const FarmGame: React.FC<FarmGameProps> = ({ plots, coins, onPlant, onHarvest, onReturnToMenu }) => {
    const [isSeedSelectorOpen, setIsSeedSelectorOpen] = useState(false);
    const [selectedPlotId, setSelectedPlotId] = useState<number | null>(null);
    
    const handlePlotClick = (plot: FarmPlotState) => {
        if (plot.seedId) { // If there's a seed, check if it's ready
            const seed = SEEDS.find(s => s.id === plot.seedId);
            if (seed && plot.plantTime && (Date.now() - plot.plantTime) / 1000 >= seed.growthTime) {
                onHarvest(plot.id);
            }
        } else { // If empty, open seed selector
            setSelectedPlotId(plot.id);
            setIsSeedSelectorOpen(true);
        }
    };

    const handleSelectSeed = (seed: Seed) => {
        if (selectedPlotId !== null) {
            onPlant(selectedPlotId, seed.id);
        }
        setIsSeedSelectorOpen(false);
        setSelectedPlotId(null);
    };

    return (
        <div className="w-full h-full flex flex-col items-center justify-center animate-fade-in p-2">
             <div className="bg-lime-300/80 p-4 sm:p-6 rounded-2xl shadow-lg mb-6 text-center panel-3d">
                <h1 className="text-2xl sm:text-3xl font-black text-lime-900">Ферма Степана</h1>
                 <p className="text-sm sm:text-base text-lime-800 mt-1 max-w-xs">
                    Сажай семена, собирай урожай и зарабатывай! Растёт даже когда ты не в игре.
                </p>
                <p className="text-lg sm:text-xl text-lime-800 mt-2">
                    Монеты: <span className="font-bold text-amber-700 text-2xl">{coins} 🪙</span>
                </p>
            </div>
            
            <div className="w-full max-w-lg sm:max-w-xl md:max-w-2xl grid grid-cols-2 sm:grid-cols-4 gap-4">
                {plots.map(plot => (
                    <FarmPlotComponent key={plot.id} plot={plot} onClick={() => handlePlotClick(plot)} />
                ))}
            </div>

            <button
                onClick={onReturnToMenu}
                className="btn-3d bg-amber-500 text-white font-bold py-3 px-8 rounded-full text-xl mt-8"
                style={{borderColor: '#b45309'}}
            >
                Главное меню
            </button>

            {isSeedSelectorOpen && (
                <SeedSelector
                    coins={coins}
                    onSelectSeed={handleSelectSeed}
                    onClose={() => setIsSeedSelectorOpen(false)}
                />
            )}
        </div>
    );
};
