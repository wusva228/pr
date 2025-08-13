import React, { useState } from 'react';
import { FarmPlot as FarmPlotComponent } from './FarmPlot';
import { CucumberPlot as CucumberPlotComponent } from './CucumberPlot';
import { SeedSelector } from './SeedSelector';
import { FarmPlotState, Seed, CucumberPlotState } from '../types';
import { SEEDS } from '../constants';

interface FarmGameProps {
    plots: FarmPlotState[];
    cucumberPlot: CucumberPlotState;
    onCucumberClick: () => void;
    coins: number;
    onPlant: (plotId: number, seedId: string) => void;
    onHarvest: (plotId: number) => void;
    onReturnToMenu: () => void;
}

export const FarmGame: React.FC<FarmGameProps> = ({ plots, cucumberPlot, onCucumberClick, coins, onPlant, onHarvest, onReturnToMenu }) => {
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
        <div className="w-full h-full flex flex-col items-center justify-start animate-fade-in p-2 overflow-y-auto">
             <div className="bg-lime-300 p-4 sm:p-6 rounded-2xl shadow-lg mb-6 text-center panel-3d w-full max-w-lg">
                <h1 className="text-2xl sm:text-3xl font-black text-lime-900">Ферма Степана</h1>
                 <p className="text-sm sm:text-base text-lime-800 mt-1 max-w-xs mx-auto">
                    Сажай семена, собирай урожай и зарабатывай!
                </p>
                <p className="text-lg sm:text-xl text-lime-800 mt-2">
                    Монеты: <span className="font-bold text-amber-700 text-2xl">{coins} 🪙</span>
                </p>
            </div>
            
            <div className="w-full max-w-lg sm:max-w-xl md:max-w-2xl space-y-8">
                <div>
                    <h2 className="text-xl font-bold text-center text-lime-800 mb-2">Особая грядка</h2>
                     <p className="text-sm text-center text-lime-700 mb-3">Собирай огурчики раз в час!</p>
                    <div className="flex justify-center">
                        <div className="w-1/2 sm:w-1/3">
                           <CucumberPlotComponent plot={cucumberPlot} onClick={onCucumberClick} />
                        </div>
                    </div>
                </div>
                
                <div>
                    <h2 className="text-xl font-bold text-center text-lime-800 mb-2">Грядки с семенами</h2>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                        {plots.map(plot => (
                            <FarmPlotComponent key={plot.id} plot={plot} onClick={() => handlePlotClick(plot)} />
                        ))}
                    </div>
                </div>

            </div>

            <button
                onClick={onReturnToMenu}
                className="btn-3d bg-amber-500 text-white font-bold py-3 px-8 rounded-full text-xl my-8"
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