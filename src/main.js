import { VendingMachineChat } from "./controllers/VendingMachineChat.js";
var vendingChat = new VendingMachineChat();
Object.defineProperty(window, 'chat', {
    value: vendingChat,
    writable: true,
    configurable: true
});
vendingChat.start();
