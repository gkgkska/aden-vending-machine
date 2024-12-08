interface CardPaymentResult {
    success: boolean;
    amount: number;
    message: string;
}

interface DrinkInfo {
    price: number;
    quantity: number;
}

interface Inventory {
    [key: string]: DrinkInfo;
}

interface InventoryItem {
    name: string;
    price: number;
    quantity: number;
}

interface PurchaseResult {
    drink: string;
    change?: number;
    amount?: number;
    remainingQuantity: number;
    message: string;
}

type PaymentMethod = 'cash' | 'card' | null;

export {
    CardPaymentResult,
    DrinkInfo,
    Inventory,
    InventoryItem,
    PurchaseResult,
    PaymentMethod
}