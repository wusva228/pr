import React from 'react';

export interface BaseItem {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
}

export interface Upgrade extends BaseItem {
  cost: number;
  powerBoost: number;
}

export interface Consumable extends BaseItem {
    cost: number;
    refillAmount: number;
}

export interface SpecialItem extends BaseItem {
    cost: number;
}

export interface AnastasiaOutfit extends BaseItem {
    cost: number;
}

export interface TrashItem {
    id: string;
    name: string;
    icon: string;
    value: number;
    unlockLevel: number;
}

export type ShopItem = Upgrade | Consumable | SpecialItem | AnastasiaOutfit;

export type PlayerCharacter = 'corgi' | 'anastasia';

export interface ChatMessage {
    id: number;
    text: string;
    sender: 'user' | 'bot';
}