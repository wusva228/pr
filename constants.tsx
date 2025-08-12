import React from 'react';
import { Upgrade, Consumable, SpecialItem, TrashItem, AnastasiaOutfit } from './types';

// Icons
const LeashIcon = () => <span className="text-3xl">🦮</span>;
const BedIcon = () => <span className="text-3xl">🛌</span>;
const TreatIcon = () => <span className="text-3xl">🦴</span>;
const SweaterIcon = () => <span className="text-3xl">🧥</span>;
const BootsIcon = () => <span className="text-3xl">🐾</span>;
const FoodIcon = () => <span className="text-3xl">🍖</span>;
const WaterIcon = () => <span className="text-3xl">💧</span>;
const SugarBoneIcon = () => <span className="text-3xl">✨</span>;
const DushaRusiIcon = () => <span className="text-3xl">👕</span>;

// Image URLs
export const CORGI_ICON_URL = 'https://i.imgur.com/by1Eyr0.png';
export const ANASTASIA_ICON_URL = 'https://i.imgur.com/2j3i9GO.png';
export const ARTYOM_ICON_URL = 'https://i.imgur.com/bl7Trgr.png';

export const TRASH_ITEMS: TrashItem[] = [
    { id: 'paper', name: 'Бумажка', icon: '📄', value: 1, unlockLevel: 1 },
    { id: 'bottle', name: 'Пластиковая бутылка', icon: '🍾', value: 3, unlockLevel: 1 },
    { id: 'can', name: 'Жестяная банка', icon: '🥫', value: 5, unlockLevel: 2 },
    { id: 'battery', name: 'Старая батарейка', icon: '🔋', value: 10, unlockLevel: 3 },
    { id: 'tire', name: 'Покрышка', icon: '⚫', value: 25, unlockLevel: 5 },
];


export const UPGRADES: Upgrade[] = [
  {
    id: 'treats1',
    name: 'Вкусняшка',
    description: 'Немного энергии для более усердных поисков.',
    cost: 20,
    powerBoost: 1.1,
    icon: <TreatIcon />,
  },
  {
    id: 'sweater1',
    name: 'Уютный свитер',
    description: 'В тепле и уюте искать мусор веселее!',
    cost: 50,
    powerBoost: 1.3,
    icon: <SweaterIcon />,
  },
  {
    id: 'bed1',
    name: 'Мягкая лежанка',
    description: 'Хороший сон = больше сил на поиски.',
    cost: 100,
    powerBoost: 1.5,
    icon: <BedIcon />,
  },
  {
    id: 'leash1',
    name: 'Новый поводок',
    description: 'Больше свободы для маневров в поисках.',
    cost: 200,
    powerBoost: 2,
    icon: <LeashIcon />,
  },
  {
      id: 'boots1',
      name: 'Защитные ботиночки',
      description: 'Лапки в безопасности, можно исследовать любые уголки.',
      cost: 350,
      powerBoost: 2.5,
      icon: <BootsIcon />,
  }
];

export const CONSUMABLES: Consumable[] = [
    {
        id: 'food',
        name: 'Миска корма',
        description: 'Восстанавливает сытость Степана.',
        cost: 15,
        refillAmount: 100,
        icon: <FoodIcon />,
    },
    {
        id: 'water',
        name: 'Миска воды',
        description: 'Восстанавливает жажду Степана.',
        cost: 10,
        refillAmount: 100,
        icon: <WaterIcon />,
    }
];

export const SPECIAL_ITEMS: SpecialItem[] = [
    {
        id: 'sugarBone',
        name: 'Сахарная косточка',
        description: 'Открывает способность "Сахарный рывок"!',
        cost: 250,
        icon: <SugarBoneIcon />,
    }
];

export const ANASTASIA_OUTFITS: AnastasiaOutfit[] = [
    {
        id: 'dusha_rusi',
        name: 'Футболка "Душа Руси"',
        description: 'Самая стильная вещь в гардеробе. +100 к уважению.',
        cost: 500,
        icon: <DushaRusiIcon />,
    }
];


// Game Parameters
export const INITIAL_COINS = 0;
export const INITIAL_LEVEL = 1;
export const XP_PER_SEARCH = 10;
export const XP_TO_NEXT_LEVEL = 100;
export const INITIAL_SEARCH_POWER = 1.0;
export const INITIAL_FOOD = 100;
export const INITIAL_WATER = 100;
export const SEARCH_COST_FOOD = 3;
export const SEARCH_COST_WATER = 5;
export const DECAY_RATE_FOOD = 0.2; // per second
export const DECAY_RATE_WATER = 0.3; // per second

// Minigame & Events
export const MUZZLE_CLICKS_NEEDED = 10;
export const SUGAR_RUSH_DURATION = 20; // seconds
export const SUGAR_RUSH_COOLDOWN = 120; // seconds
export const SUGAR_RUSH_POWER_MULTIPLIER = 3;
export const ARTYOM_EVENT_CHANCE = 0.1; // 10% chance
export const ARTYOM_STEAL_PERCENT = 0.2; // Steals 20% of coins
export const ARTYOM_DEFEND_TIME = 3000; // 3 seconds to react

// Flappy Game Config
export const FLAPPY_GAME_CONFIG = {
    GRAVITY: 0.5,
    JUMP_STRENGTH: -9,
    PIPE_WIDTH: 70,
    PIPE_GAP: 180,
    PIPE_SPEED: 4,
    PIPE_SPAWN_INTERVAL: 1500, // ms
    BIRD_SIZE: 50,
};