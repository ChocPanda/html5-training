'use strict';

const { createOrder, _, __, Action } = require("../app/orders/order");
const { compareBuyers, compareSellers } = require("../app/orders/orderComparator")
const moment = require("moment");

describe("Order Comparator", () => {
    test("Correctly compare buy orders by price", () => {
        const orderTime = moment.now();
        const testBuy1 = createOrder("acc-1", 5.0, 1, Action.BUY, orderTime);
        const testBuy2 = createOrder("acc-2", 3.0, 1, Action.BUY, orderTime);

        expect(compareBuyers(testBuy1, testBuy2)).toBe(1)
        expect(compareBuyers(testBuy2, testBuy1)).toBe(-1)
        expect(compareBuyers(testBuy1, testBuy1)).toBe(0)
    });
    
    test("Correctly compare buy orders by time the order was made", () => {
        const orderTime = moment.now();
        const testBuy1 = createOrder("acc-1", 5.0, 1, Action.BUY, orderTime);
        const testBuy2 = createOrder("acc-2", 5.0, 1, Action.BUY, moment(orderTime).add(1, 'days'));

        expect(compareBuyers(testBuy1, testBuy2)).toBe(1)
        expect(compareBuyers(testBuy2, testBuy1)).toBe(-1)
        expect(compareBuyers(testBuy1, testBuy1)).toBe(0)
    });

    test("Correctly compare sell orders by price", () => {
        const orderTime = moment.now();
        const testSell1 = createOrder("acc-1", 3.0, 1, Action.BUY, orderTime);
        const testSell2 = createOrder("acc-2", 5.0, 1, Action.BUY, orderTime);

        expect(compareSellers(testSell1, testSell2)).toBe(1)
        expect(compareSellers(testSell2, testSell1)).toBe(-1)
        expect(compareSellers(testSell1, testSell1)).toBe(0)
    });
    
    test("Correctly compare sell orders by time the order was made", () => {
        const orderTime = moment.now();
        const testSell1 = createOrder("acc-1", 5.0, 1, Action.BUY, orderTime);
        const testSell2 = createOrder("acc-2", 5.0, 1, Action.BUY, moment(orderTime).add(1, 'days'));

        expect(compareSellers(testSell1, testSell2)).toBe(1)
        expect(compareSellers(testSell2, testSell1)).toBe(-1)
        expect(compareSellers(testSell1, testSell1)).toBe(0)
    });
})