import { Inventory } from '../types/types.js';

export const INITIAL_INVENTORY: Inventory = {
    'cola': { price: 1100, quantity: 5 },
    'water': { price: 600, quantity: 5 },
    'coffee': { price: 700, quantity: 5 }
};

export const ALLOWED_CASH = [100, 500, 1000, 5000, 10000];

export const DRINK_MAP = {
    'coffee': 'coffee',
    '커피': 'coffee',
    'cola': 'cola', 
    '콜라': 'cola',
    'water': 'water',
    '물': 'water'
}