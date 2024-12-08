import { ALLOWED_CASH, INITIAL_INVENTORY } from '../constants/constants.js';
import { CardPaymentResult, DrinkInfo, Inventory, InventoryItem, PaymentMethod, PurchaseResult } from '../types/types.js';

export class VendingMachine {
    allowedCash: number[];
    inventory: Inventory;
    insertedMoney: number;
    paymentMethod: PaymentMethod;

    constructor() {
        this.allowedCash = ALLOWED_CASH;
        this.inventory = { ...INITIAL_INVENTORY };
        this.insertedMoney = 0;
        this.paymentMethod = null;
    }

    selectPaymentMethod(method: 'cash' | 'card'): string {
        if (method !== 'cash' && method !== 'card') {
            throw new Error('유효하지 않은 결제 방식입니다. 현금 또는 카드를 선택해주세요.');
        }
        this.paymentMethod = method;
        return `선택된 결제 방식: ${method === 'cash' ? '현금' : '카드'}`;
    }

    insertCash(amount: number): string {
        if (this.paymentMethod !== 'cash') {
            throw new Error('현금 결제가 선택되지 않았습니다.');
        }

        if (this.allowedCash.indexOf(amount) === -1) {
            throw new Error('유효하지 않은 화폐입니다. (사용 가능: 100원, 500원, 1000원, 5000원, 10000원)');
        }

        this.insertedMoney += amount;
        return `현재 투입 금액: ${this.insertedMoney}원`;
    }

    processCardPayment(drinkName: string): CardPaymentResult {
        if (this.paymentMethod !== 'card') {
            throw new Error('카드 결제가 선택되지 않았습니다.');
        }

        const drink = this.inventory[drinkName];
        return {
            success: true,
            amount: drink.price,
            message: '카드 결제가 완료되었습니다.'
        };
    }

    selectDrink(drinkName: string): PurchaseResult {
        if (!this.inventory[drinkName]) {
            throw new Error('존재하지 않는 음료입니다.');
        }

        const drink = this.inventory[drinkName];

        if (drink.quantity <= 0) {
            throw new Error(`${drinkName}이(가) 품절되었습니다.`);
        }

        if (this.paymentMethod === 'cash') {
            return this.processCashPurchase(drinkName, drink);
        } else if (this.paymentMethod === 'card') {
            return this.processCardPurchase(drinkName, drink);
        }

        throw new Error('결제 방식이 선택되지 않았습니다.');
    }

    processCashPurchase(drinkName: string, drink: DrinkInfo): PurchaseResult {
        if (this.insertedMoney < drink.price) {
            throw new Error(`금액이 ${drink.price - this.insertedMoney}원 부족합니다.`);
        }

        const change = this.insertedMoney - drink.price;
        this.insertedMoney = 0;
        drink.quantity--;

        return {
            change,
            drink: drinkName,
            remainingQuantity: drink.quantity,
            message: '현금 결제가 완료되었습니다.'
        };
    }

    processCardPurchase(drinkName: string, drink: DrinkInfo): PurchaseResult {
        const payment = this.processCardPayment(drinkName);
        if (payment.success) {
            drink.quantity--;
            return {
                amount: payment.amount,
                drink: drinkName,
                remainingQuantity: drink.quantity,
                message: payment.message
            };
        }
        throw new Error('카드 결제에 실패했습니다.');
    }

    checkInventory(): InventoryItem[] {
        return Object.keys(this.inventory).map(name => ({
            name,
            price: this.inventory[name].price,
            quantity: this.inventory[name].quantity
        }));
    }

    
    returnChange(): number {
        if (this.paymentMethod !== 'cash') {
            throw new Error('현금 결제 시에만 거스름돈을 반환할 수 있습니다.');
        }
        const change = this.insertedMoney;
        this.insertedMoney = 0;
        return change;
    }

    cancelTransaction(): string {
        const refund = this.insertedMoney;
        this.insertedMoney = 0;
        this.paymentMethod = null;
        return `거래가 취소되었습니다. 반환 금액: ${refund}원`;
    }
}
