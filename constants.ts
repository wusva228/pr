import { Item, Seed, Upgrade, UpgradeId } from './types';

export const SAVE_GAME_KEY = 'priklyucheniya-stepana-save-v3';

export const ITEMS: Item[] = [
  // Мусор
  { id: 't1', name: 'Старый ботинок', emoji: '👞', isTrash: true, coinValue: 2 },
  { id: 't2', name: 'Пластиковая бутылка', emoji: '🍾', isTrash: true, coinValue: 3 },
  { id: 't3', name: 'Огрызок яблока', emoji: '🍎', isTrash: true, coinValue: 1 },
  { id: 't4', name: 'Скомканная бумага', emoji: '📄', isTrash: true, coinValue: 1 },
  { id: 't5', name: 'Жестяная банка', emoji: '🥫', isTrash: true, coinValue: 4 },
  { id: 't6', name: 'Кожура от банана', emoji: '🍌', isTrash: true, coinValue: 1 },
  { id: 't7', name: 'Пакет', emoji: '🛍️', isTrash: true, coinValue: 2 },
  
  // Не мусор
  { id: 'b1', name: 'Вкусная косточка', emoji: '🦴', isTrash: false, coinValue: 0 },
  { id: 'b2', name: 'Червячок', emoji: '🐛', isTrash: false, coinValue: 0 },
  { id: 'b3', name: 'Ключик', emoji: '🔑', isTrash: false, coinValue: 0 },
  { id: 'b4', name: 'Драгоценный камень', emoji: '💎', isTrash: false, coinValue: 0 },

  // Ловушки
  { id: 'trap1', name: 'Намордник', emoji: '😷', isTrash: false, coinValue: 0, isTrap: true, trapType: 'MUZZLE' },
];

export const LEVEL_CONFIGS = [
    { level: 1, trash: 3, other: 1, traps: 0, grid: 4 },
    { level: 2, trash: 4, other: 2, traps: 1, grid: 4 },
    { level: 3, trash: 5, other: 2, traps: 1, grid: 4 },
    { level: 4, trash: 6, other: 3, traps: 2, grid: 5 },
    { level: 5, trash: 8, other: 3, traps: 2, grid: 5 },
];

export const UPGRADES: Record<UpgradeId, Upgrade> = {
    // Tools
    FASTER_DIG: { id: 'FASTER_DIG', name: 'Крепкая лопата', description: 'Копать на 25% быстрее.', cost: 20, value: 0.25, type: 'TOOL', icon: '⛏️' },
    COMPASS: { id: 'COMPASS', name: 'Компас для мусора', description: 'Иногда подсвечивает мусор.', cost: 35, type: 'TOOL', icon: '🧭' },
    LUCKY_CHARM: { id: 'LUCKY_CHARM', name: 'Талисман удачи', description: 'Шанс найти доп. монеты.', cost: 50, type: 'TOOL', icon: '🍀' },
    // Clothing
    STYLISH_COLLAR: { id: 'STYLISH_COLLAR', name: 'Стильный ошейник', description: 'Просто для красоты!', cost: 15, type: 'CLOTHING', icon: '✨' },
    CUTE_HAT: { id: 'CUTE_HAT', name: 'Милая шляпка', description: 'Защищает от солнца.', cost: 25, type: 'CLOTHING', icon: '👒' },
    // Anastasia
    EXTRA_ATTEMPT: { id: 'EXTRA_ATTEMPT', name: 'Особое чутьё', description: '+2 попытки в "Найди Стёпу".', cost: 40, type: 'ANASTASIA', icon: '🧐' },
    CLOSER_START: { id: 'CLOSER_START', name: 'Карта местности', description: 'Убирает 2 "холодных" варианта.', cost: 60, type: 'ANASTASIA', icon: '🗺️' },
    IMPROVE_MOOD: { id: 'IMPROVE_MOOD', name: 'Мороженое', description: 'Поднимает настроение!', cost: 15, type: 'ANASTASIA', icon: 'https://i.imgur.com/894oVy4.jpeg' },
}

export const SEEDS: Seed[] = [
    { id: 'carrot', name: 'Морковь', cost: 5, growthTime: 60, revenue: 10, emoji: '🥕' },
    { id: 'potato', name: 'Картофель', cost: 8, growthTime: 180, revenue: 20, emoji: '🥔' },
    { id: 'tomato', name: 'Помидор', cost: 12, growthTime: 300, revenue: 35, emoji: '🍅' },
];

export const INITIAL_FARM_PLOTS_COUNT = 4;
export const INITIAL_CUCUMBER_PLOTS_COUNT = 1;
export const CLICKS_PER_CUCUMBER = 10;
export const CUCUMBER_REWARD = 15;
export const CUCUMBER_COOLDOWN_MS = 3600 * 1000; // 1 час

export const BASE_DIG_TIME = 1500;
export const MUZZLE_DURATION = 3000; // 3 секунды
export const BOSS_CHANCE = 0.25; // 25% шанс после каждой находки мусора
export const BOSS_TIMER = 20; // 20 секунд на решение

export const ANASTASIA_MAX_MOOD = 100;
export const MOOD_BOOST_VALUE = 25;
export const MOOD_DECAY_PER_LEVEL = 5;

// Константы для режима "Найди Стёпу"
export const FIND_STEPAN_GRID_SIZE = 5;
export const FIND_STEPAN_ATTEMPTS = 8;

// Константы для режима "Побег из тюрьмы"
export const PRISON_GRID_SIZE = 6;
export const PRISON_INITIAL_ENERGY = 25;
export const PRISON_WALL_STRENGTH = 3;
export const PRISON_MOVE_COST = 1;
export const PRISON_BREAK_COST = 2; // Breaking is harder than moving
export const PRISON_TRAP_PENALTY = 5;
export const PRISON_WATER_BONUS = 8;
export const ARTEM_CHANCE_IN_PRISON = 0.2; // 20% шанс
export const ARTEM_MOVE_TRIGGER = 4; // после 4 ходов


// Музыка
export const BACKGROUND_MUSIC_URL = 'https://cdn.pixabay.com/download/audio/2022/05/18/audio_d247a328f4.mp3';