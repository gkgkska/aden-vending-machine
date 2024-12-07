import { VendingMachineChat } from "./controllers/VendingMachineChat.js";

const vendingChat = new VendingMachineChat();
Object.defineProperty(window, 'chat', {
    value: vendingChat,
    writable: true,
    configurable: true
});
vendingChat.start();