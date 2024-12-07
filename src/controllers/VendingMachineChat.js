import { VendingMachine } from '../viewModels/VendingMachineVM.js';
import { drinkMap } from '../constants/constants.js';
var VendingMachineChat = /** @class */ (function () {
    function VendingMachineChat() {
        this.machine = new VendingMachine();
        this.method = null;
        this.item = null;
        this.amount = null;
    }
    VendingMachineChat.prototype.start = function () {
        var inventory = this.machine.checkInventory();
        console.log('🧃 안녕하세요! 자판기를 이용해주셔서 감사합니다.');
        console.log('📣 명령어 chat.handleCommand("도움말") 또는 chat.handleCommand("[현금/카드] 결제")로 제품 구매를 시작하세요.');
        console.log('🥫 현재 판매 중인 상품 목록입니다: ');
        inventory.forEach(function (item) {
            console.log("- ".concat(item.name, ": ").concat(item.price, "\uC6D0 (\uC7AC\uACE0: ").concat(item.quantity, "\uAC1C)"));
        });
    };
    VendingMachineChat.prototype.handleCommand = function (input) {
        var words = input.trim().split(' ');
        var keyWord = words[words.length - 1] || '';
        var paymentMethod = words[0];
        switch (keyWord) {
            case '결제':
                var payment = paymentMethod === '현금' ? 'cash' : paymentMethod === '카드' ? 'card' : null;
                if (payment) {
                    this.handlePaymentMethod(payment);
                }
                else {
                    console.log('결제 수단(현금/카드)을 선택해주세요.');
                }
                break;
            case '선택':
                this.handleItemSelection(words[0]);
                break;
            case '투입':
                this.handleCashInsert(Number(words[0]));
                break;
            case '확인':
                this.handlePurchaseConfirmation();
                break;
            case '도움말':
                this.showHelp();
                break;
            default:
                console.log('\n 죄송합니다. 알 수 없는 명령어입니다. 도움말을 입력하여 사용할 수 있는 명령어를 확인하세요.');
        }
    };
    VendingMachineChat.prototype.handlePaymentMethod = function (method) {
        try {
            if (method !== 'cash' && method !== 'card') {
                throw new Error('현금(cash) 또는 카드(card)만 선택 가능합니다.');
            }
            this.method = method;
            this.machine.selectPaymentMethod(method);
            console.log("\n".concat(method === 'cash' ? '현금' : '카드', " \uACB0\uC81C\uAC00 \uC120\uD0DD\uB418\uC5C8\uC2B5\uB2C8\uB2E4."));
            if (method === 'cash') {
                console.log('\n투입할 금액을 입력해주세요. (사용 가능: 100원, 500원, 1000원, 5000원, 10000원)');
                console.log('사용자 입력 방법: [금액] 투입');
                console.log('예시: 1000 투입');
            }
            else {
                console.log('\n구매하실 상품을 선택해주세요.');
                console.log('사용자 입력 방법: [상품명] 선택');
                console.log('예시: 콜라 선택');
            }
        }
        catch (err) {
            if (err instanceof Error) {
                console.log('\n시스템:', err.message);
            }
        }
    };
    VendingMachineChat.prototype.handleCashInsert = function (amount) {
        try {
            if (!this.method || this.method !== 'cash') {
                throw new Error('현금 결제가 선택되지 않았습니다.');
            }
            this.machine.insertCash(amount);
            console.log("\n".concat(amount, "\uC6D0\uC774 \uD22C\uC785\uB418\uC5C8\uC2B5\uB2C8\uB2E4."));
            console.log('\n구매하실 상품을 선택해주세요.');
            console.log('사용자 입력 방법: [상품명] 선택');
            console.log('예시: 콜라 선택');
        }
        catch (err) {
            if (err instanceof Error) {
                console.log('\n시스템:', err.message);
            }
        }
    };
    VendingMachineChat.prototype.handleItemSelection = function (itemName) {
        try {
            if (!this.method) {
                throw new Error('먼저 결제 방식을 선택해주세요.');
            }
            this.item = itemName;
            console.log("\n".concat(itemName, "\uC744(\uB97C) \uC120\uD0DD\uD558\uC168\uC2B5\uB2C8\uB2E4."));
            console.log('\n구매를 진행하시겠습니까?');
            console.log('사용자 입력 방법: 확인');
        }
        catch (err) {
            if (err instanceof Error) {
                console.log('\n시스템:', err.message);
            }
        }
    };
    VendingMachineChat.prototype.handlePurchaseConfirmation = function () {
        try {
            if (!this.item) {
                throw new Error('먼저 상품을 선택해주세요.');
            }
            if (this.item in drinkMap) {
                var result = this.machine.selectDrink(drinkMap[this.item]);
                console.log('\n구매가 완료되었습니다.');
                console.log("- \uC0C1\uD488: ".concat(this.item));
                if (result.change !== undefined) {
                    console.log("- \uAC70\uC2A4\uB984\uB3C8: ".concat(result.change, "\uC6D0"));
                }
                if (result.amount !== undefined) {
                    console.log("- \uACB0\uC81C \uAE08\uC561: ".concat(result.amount, "\uC6D0"));
                }
                console.log("- ".concat(result.message));
                this.resetTransaction();
                console.log('\n추가 주문을 원하시면 결제 방식을 다시 선택해주세요.');
                console.log('사용자 입력 방법: [현금/카드] 결제');
            }
        }
        catch (err) {
            if (err instanceof Error) {
                console.log('\n시스템:', err.message);
            }
        }
    };
    VendingMachineChat.prototype.resetTransaction = function () {
        this.method = null;
        this.item = null;
        this.amount = null;
    };
    VendingMachineChat.prototype.showHelp = function () {
        console.log('\n사용 가능한 명령어 목록입니다:');
        console.log('\n명령어는 결제, 투입, 선택, 확인, 도움말 키워드로 구성되었습니다.');
        console.log('- [현금/카드] 결제 : 결제 방식 선택');
        console.log('- [금액] 투입: 현금 투입 (현금 결제 시)');
        console.log('- [상품명] 선택: 상품 선택');
        console.log('- 확인: 구매 확인');
        console.log('- 도움말: 도움말 표시');
    };
    return VendingMachineChat;
}());
export { VendingMachineChat };
