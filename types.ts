export interface Item {
  id: string;
  name: string;
  emoji: string;
  isTrash: boolean;
  coinValue: number;
  isTrap?: boolean;
  trapType?: 'MUZZLE';
}

export interface GridSpot {
  id: number;
  item: Item | null;
  isDug: boolean;
}

export type GameMode = 'idle' | 'digging_game' | 'find_stepan' | 'prison_escape' | 'farm';

export type GameStatus = 
  'start_screen' 
  | 'playing' 
  | 'digging' 
  | 'level_end' 
  | 'store' 
  | 'muzzled' 
  | 'boss_fight'
  | 'find_stepan_playing'
  | 'find_stepan_end'
  | 'prison_escape_playing'
  | 'prison_escape_end'
  | 'farm_playing';


export type UpgradeId = 
  'FASTER_DIG' | 'COMPASS' | 'LUCKY_CHARM' | 
  'STYLISH_COLLAR' | 'CUTE_HAT' |
  'EXTRA_ATTEMPT' | 'CLOSER_START' |
  'IMPROVE_MOOD';
  
export type UpgradeType = 'TOOL' | 'CLOTHING' | 'ANASTASIA' | 'SEED';

export interface Upgrade {
    id: UpgradeId;
    name: string;
    description: string;
    cost: number;
    value?: number;
    type: UpgradeType;
    icon?: string;
}

export interface Seed {
    id: string;
    name: string;
    cost: number;
    growthTime: number; // in seconds
    revenue: number;
    emoji: string;
}

export interface FarmPlotState {
  id: number;
  seedId: string | null;
  plantTime: number | null;
}

export interface CucumberPlotState {
  id: number;
  lastHarvestTime: number | null;
}

export interface SavedGameState {
  level: number;
  coins: number;
  purchasedUpgrades: UpgradeId[];
  equippedClothes: UpgradeId[];
  anastasiaMood: number;
  farmPlots?: FarmPlotState[];
  cucumberPlot?: CucumberPlotState;
}

export interface FindStepanSpot {
  id: number;
  isSearched: boolean;
  distance: number; // 0 for Stepan's location
}

export interface PrisonCell {
  id: number;
  type: 'wall' | 'floor' | 'exit' | 'trap' | 'water';
  strength: number;
}

declare global {
  interface Window {
    Telegram: any;
  }
}