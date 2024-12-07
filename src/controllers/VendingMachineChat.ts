import { VendingMachine } from '../viewModels/VendingMachineVM.js';
import { PaymentMethod } from '../types/types.js';
import { drinkMap } from '../constants/constants.js';

export class VendingMachineChat {
    machine: VendingMachine;
    method: PaymentMethod;
    item: string | null;
    amount: number | null;

    constructor() {
        this.machine = new VendingMachine();
        this.method = null;
        this.item = null;
        this.amount = null;
    }

    start(): void {
        const inventory = this.machine.checkInventory();
        console.log('🧃 안녕하세요! 자판기를 이용해주셔서 감사합니다.');
        console.log('📣 명령어 chat.handleCommand("도움말") 또는 chat.handleCommand("[현금/카드] 결제")로 제품 구매를 시작하세요.');
        console.log('🥫 현재 판매 중인 상품 목록입니다: ')
        inventory.forEach(item => {
            console.log(`- ${item.name}: ${item.price}원 (재고: ${item.quantity}개)`);
        });
    }

    handleCommand(input: string): void {
        const words = input.trim().split(' ');
        const keyWord = words[words.length - 1] || '';
        const paymentMethod = words[0];
        switch (keyWord) {
            case '결제':
                const payment = paymentMethod === '현금' ? 'cash' : paymentMethod === '카드' ? 'card' : null;
                if (payment) {
                    this.handlePaymentMethod(payment);
                } else {
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
    }

    handlePaymentMethod(method: 'cash' | 'card'): void {
        try {
            if (method !== 'cash' && method !== 'card') {
                throw new Error('현금(cash) 또는 카드(card)만 선택 가능합니다.');
            }

            this.method = method;
            this.machine.selectPaymentMethod(method);
            console.log(`\n${method === 'cash' ? '현금' : '카드'} 결제가 선택되었습니다.`);
            
            if (method === 'cash') {
                console.log('\n투입할 금액을 입력해주세요. (사용 가능: 100원, 500원, 1000원, 5000원, 10000원)');
                console.log('사용자 입력 방법: [금액] 투입');
                console.log('예시: 1000 투입');
            } else {
                console.log('\n구매하실 상품을 선택해주세요.');
                console.log('사용자 입력 방법: [상품명] 선택');
                console.log('예시: 콜라 선택');
            }
        } catch (err) {
            if (err instanceof Error) {
                console.log('\n시스템:', err.message);
            }
        }
    }

    handleCashInsert(amount: number): void {
        try {
            if (!this.method || this.method !== 'cash') {
                throw new Error('현금 결제가 선택되지 않았습니다.');
            }

            this.machine.insertCash(amount);
            console.log(`\n${amount}원이 투입되었습니다.`);
            console.log('\n구매하실 상품을 선택해주세요.');
            console.log('사용자 입력 방법: [상품명] 선택');
            console.log('예시: 콜라 선택');
        } catch (err) {
            if (err instanceof Error) {
                console.log('\n시스템:', err.message);
            }
        }
    }

    handleItemSelection(itemName: string): void {
        try {
            if (!this.method) {
                throw new Error('먼저 결제 방식을 선택해주세요.');
            }

            this.item = itemName;
            console.log(`\n${itemName}을(를) 선택하셨습니다.`);
            console.log('\n구매를 진행하시겠습니까?');
            console.log('사용자 입력 방법: 확인');
        } catch (err) {
            if (err instanceof Error) {
                console.log('\n시스템:', err.message);
            }
        }
    }

    handlePurchaseConfirmation(): void {
        try {
            if (!this.item) {
                throw new Error('먼저 상품을 선택해주세요.');
            }

             if (this.item in drinkMap) {
                const result = this.machine.selectDrink(drinkMap[this.item as keyof typeof drinkMap]);
                
                console.log('\n구매가 완료되었습니다.');
                console.log(`- 상품: ${this.item}`);
                
                if (result.change !== undefined) {
                    console.log(`- 거스름돈: ${result.change}원`);
                }
                if (result.amount !== undefined) {
                    console.log(`- 결제 금액: ${result.amount}원`);
                }
                console.log(`- ${result.message}`);
             
                this.resetTransaction();
             
                console.log('\n추가 주문을 원하시면 결제 방식을 다시 선택해주세요.');
                console.log('사용자 입력 방법: [현금/카드] 결제');
             }
        } catch (err) {
            if (err instanceof Error) {
                console.log('\n시스템:', err.message);
            }
        }
    }

    resetTransaction(): void {
        this.method = null;
        this.item = null;
        this.amount = null;
    }
    
    showHelp(): void {
        console.log('\n사용 가능한 명령어 목록입니다:');
        console.log('\n명령어는 결제, 투입, 선택, 확인, 도움말 키워드로 구성되었습니다.');
        console.log('- [현금/카드] 결제 : 결제 방식 선택');
        console.log('- [금액] 투입: 현금 투입 (현금 결제 시)');
        console.log('- [상품명] 선택: 상품 선택');
        console.log('- 확인: 구매 확인');
        console.log('- 도움말: 도움말 표시');
    }
}
