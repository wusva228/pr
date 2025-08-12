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

export type GameMode = 'idle' | 'digging_game' | 'find_stepan';

export type GameStatus = 
  'start_screen' 
  | 'playing' 
  | 'digging' 
  | 'level_end' 
  | 'store' 
  | 'muzzled' 
  | 'boss_fight'
  | 'find_stepan_playing'
  | 'find_stepan_end';


export type UpgradeId = 
  'FASTER_DIG' | 'COMPASS' | 'LUCKY_CHARM' | 
  'STYLISH_COLLAR' | 'CUTE_HAT' |
  'EXTRA_ATTEMPT' | 'CLOSER_START' |
  'IMPROVE_MOOD';
  
export type UpgradeType = 'TOOL' | 'CLOTHING' | 'ANASTASIA';

export interface Upgrade {
    id: UpgradeId;
    name: string;
    description: string;
    cost: number;
    value?: number;
    type: UpgradeType;
    icon?: string;
}

export interface SavedGameState {
  level: number;
  coins: number;
  purchasedUpgrades: UpgradeId[];
  equippedClothes: UpgradeId[];
  anastasiaMood: number;
}

export interface FindStepanSpot {
  id: number;
  isSearched: boolean;
  distance: number; // 0 for Stepan's location
}

declare global {
  interface Window {
    Telegram: any;
  }
}