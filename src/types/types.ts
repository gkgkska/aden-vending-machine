export interface DrinkInfo {
    price: number;
    quantity: number;
}

export interface Inventory {
    [key: string]: DrinkInfo;
}

export interface CardPaymentResult {
    success: boolean;
    amount: number;
    message: string;
}

export interface PurchaseResult {
    drink: string;
    change?: number;
    amount?: number;
    remainingQuantity: number;
    message: string;
}

export interface InventoryItem {
    name: string;
    price: number;
    quantity: number;
}

export type PaymentMethod = 'cash' | 'card' | null;
