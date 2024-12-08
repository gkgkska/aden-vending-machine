var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
import { ALLOWED_CASH, INITIAL_INVENTORY } from '../constants/constants.js';
var VendingMachine = /** @class */ (function () {
    function VendingMachine() {
        this.allowedCash = ALLOWED_CASH;
        this.inventory = __assign({}, INITIAL_INVENTORY);
        this.insertedMoney = 0;
        this.paymentMethod = null;
    }
    VendingMachine.prototype.selectPaymentMethod = function (method) {
        if (method !== 'cash' && method !== 'card') {
            throw new Error('유효하지 않은 결제 방식입니다. 현금 또는 카드를 선택해주세요.');
        }
        this.paymentMethod = method;
        return "\uC120\uD0DD\uB41C \uACB0\uC81C \uBC29\uC2DD: ".concat(method === 'cash' ? '현금' : '카드');
    };
    VendingMachine.prototype.insertCash = function (amount) {
        if (this.paymentMethod !== 'cash') {
            throw new Error('현금 결제가 선택되지 않았습니다.');
        }
        if (this.allowedCash.indexOf(amount) === -1) {
            throw new Error('유효하지 않은 화폐입니다. (사용 가능: 100원, 500원, 1000원, 5000원, 10000원)');
        }
        this.insertedMoney += amount;
        return "\uD604\uC7AC \uD22C\uC785 \uAE08\uC561: ".concat(this.insertedMoney, "\uC6D0");
    };
    VendingMachine.prototype.processCardPayment = function (drinkName) {
        if (this.paymentMethod !== 'card') {
            throw new Error('카드 결제가 선택되지 않았습니다.');
        }
        var drink = this.inventory[drinkName];
        return {
            success: true,
            amount: drink.price,
            message: '카드 결제가 완료되었습니다.'
        };
    };
    VendingMachine.prototype.selectDrink = function (drinkName) {
        if (!this.inventory[drinkName]) {
            throw new Error('존재하지 않는 음료입니다.');
        }
        var drink = this.inventory[drinkName];
        if (drink.quantity <= 0) {
            throw new Error("".concat(drinkName, "\uC774(\uAC00) \uD488\uC808\uB418\uC5C8\uC2B5\uB2C8\uB2E4."));
        }
        if (this.paymentMethod === 'cash') {
            return this.processCashPurchase(drinkName, drink);
        }
        else if (this.paymentMethod === 'card') {
            return this.processCardPurchase(drinkName, drink);
        }
        throw new Error('결제 방식이 선택되지 않았습니다.');
    };
    VendingMachine.prototype.processCashPurchase = function (drinkName, drink) {
        if (this.insertedMoney < drink.price) {
            throw new Error("\uAE08\uC561\uC774 ".concat(drink.price - this.insertedMoney, "\uC6D0 \uBD80\uC871\uD569\uB2C8\uB2E4."));
        }
        var change = this.insertedMoney - drink.price;
        this.insertedMoney = 0;
        drink.quantity--;
        return {
            change: change,
            drink: drinkName,
            remainingQuantity: drink.quantity,
            message: '현금 결제가 완료되었습니다.'
        };
    };
    VendingMachine.prototype.processCardPurchase = function (drinkName, drink) {
        var payment = this.processCardPayment(drinkName);
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
    };
    VendingMachine.prototype.checkInventory = function () {
        var _this = this;
        return Object.keys(this.inventory).map(function (name) { return ({
            name: name,
            price: _this.inventory[name].price,
            quantity: _this.inventory[name].quantity
        }); });
    };
    VendingMachine.prototype.returnChange = function () {
        if (this.paymentMethod !== 'cash') {
            throw new Error('현금 결제 시에만 거스름돈을 반환할 수 있습니다.');
        }
        var change = this.insertedMoney;
        this.insertedMoney = 0;
        return change;
    };
    VendingMachine.prototype.cancelTransaction = function () {
        var refund = this.insertedMoney;
        this.insertedMoney = 0;
        this.paymentMethod = null;
        return "\uAC70\uB798\uAC00 \uCDE8\uC18C\uB418\uC5C8\uC2B5\uB2C8\uB2E4. \uBC18\uD658 \uAE08\uC561: ".concat(refund, "\uC6D0");
    };
    return VendingMachine;
}());
export { VendingMachine };
