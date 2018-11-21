'use strict';

const Matcher = require("../app/matcher.module");
const OrderModule = require("../app/order.module");
const TradeModule = require("../app/trade.module");

const Order = OrderModule.Order
const ActionEnum = OrderModule.ActionEnum
const Trade = TradeModule.Trade

describe("Matcher", () => {
    test("Initialise to an empty set or orders", () => {
        expect(new Matcher().trades).toEqual([]);
        expect(new Matcher().unmatchedBuyers).toEqual([]);
        expect(new Matcher().unmatchedSellers).toEqual([]);
    });

    test("Initialise and separate buyer and seller orders", () => {
        const testBuy = new Order("acc-1", 5.0, 1, ActionEnum.BUY)
        const testSell = new Order("acc-2", 5.0, 1, ActionEnum.SELL)

        const matcher = new Matcher([testBuy, testSell]);
        
        expect(matcher.unmatchedBuyers).toContain(testBuy);
        expect(matcher.unmatchedSellers).toContain(testSell);
    });

    test("Initialise and sort a set of buyers by price", () => {
        const orderTime = new Date()
        const testBuy1 = new Order("acc-1", 5.0, 1, ActionEnum.BUY, orderTime);
        const testBuy2 = new Order("acc-1", 3.0, 1, ActionEnum.BUY, orderTime);
        
        const matcher1 = new Matcher([testBuy1, testBuy2]);
        const matcher2 = new Matcher([testBuy2, testBuy1]);

        expect(matcher1.unmatchedBuyers).toEqual(matcher2.unmatchedBuyers);
    });

    test("Initialise and sort a set of buyers by order time", () => {
        const testBuy1 = new Order("acc-1", 5.0, 1, ActionEnum.BUY, Date(5000000));
        const testBuy2 = new Order("acc-1", 5.0, 1, ActionEnum.BUY, Date(3000000));
        
        const matcher1 = new Matcher([testBuy1, testBuy2]);
        const matcher2 = new Matcher([testBuy2, testBuy1]);

        expect(matcher1.unmatchedBuyers).toEqual(matcher2.unmatchedBuyers);
    });

    test("Initialise and sort a set of sellers by price", () => {
        const orderTime = new Date()
        const testSell1 = new Order("acc-2", 5.0, 1, ActionEnum.SELL, orderTime);
        const testSell2 = new Order("acc-2", 3.0, 1, ActionEnum.SELL, orderTime);
        
        const matcher1 = new Matcher([testSell1, testSell2]);
        const matcher2 = new Matcher([testSell2, testSell1]);

        expect(matcher1.unmatchedSellers).toEqual(matcher2.unmatchedSellers);
    });

    test("Initialise and sort a set of sellers by order time", () => {
        const testSell1 = new Order("acc-2", 3.0, 1, ActionEnum.SELL, new Date(5000000000));
        const testSell2 = new Order("acc-2", 3.0, 1, ActionEnum.SELL, new Date(3000000000));
        
        console.log(testSell1.orderTime)
        console.log(testSell2.orderTime)

        const matcher1 = new Matcher([testSell1, testSell2]);
        const matcher2 = new Matcher([testSell2, testSell1]);

        expect(matcher1.unmatchedSellers).toEqual(matcher2.unmatchedSellers);
    });

    test("receive new buy and sell orders", () => {
        const testBuy = new Order("acc-1", 5.0, 1, ActionEnum.BUY)
        const testSell = new Order("acc-2", 5.0, 1, ActionEnum.SELL)

        const matcher = new Matcher();
        matcher.add(testBuy).add(testSell)

        expect(matcher.unmatchedBuyers).toContain(testBuy);
        expect(matcher.unmatchedSellers).toContain(testSell);
    });

    test("match a buyer and a seller if the buyer is willing to pay the asking price", () => {
        const testBuy = new Order("acc-1", 5.0, 1, ActionEnum.BUY)
        const testSell = new Order("acc-2", 5.0, 1, ActionEnum.SELL)

        const matcher = new Matcher([testBuy, testSell]);

        expect(matcher.trades).toEqual([new Trade(testBuy, testSell)])
        expect(matcher.unmatchedBuyers).toEqual([])
        expect(matcher.unmatchedSellers).toEqual([])
    });

    test("match a buyer and a seller if the buyer is willing to pay more than the asking price", () => {
        const testBuy = new Order("acc-1", 10.0, 1, ActionEnum.BUY)
        const testSell = new Order("acc-2", 5.0, 1, ActionEnum.SELL)

        const matcher = new Matcher([testBuy, testSell]);

        expect(matcher.trades).toEqual([new Trade(testBuy, testSell)])
        expect(matcher.unmatchedBuyers).toEqual([])
        expect(matcher.unmatchedSellers).toEqual([])
    });

    test("match a buyer to multiple sellers if the buyer wants more than the first seller can provide", () => {
        const testBuy = new Order("acc-1", 5.0, 2, ActionEnum.BUY)
        const testSell1 = new Order("acc-2", 5.0, 1, ActionEnum.SELL)
        const testSell2 = new Order("acc-3", 5.0, 1, ActionEnum.SELL)

        const matcher = new Matcher([testBuy, testSell1, testSell2]);

        expect(matcher.trades).toEqual([new Trade(testBuy, testSell1), new Trade(testBuy, testSell2)])
        expect(matcher.unmatchedBuyers).toEqual([])
        expect(matcher.unmatchedSellers).toEqual([])
    });

    test("not match a buyer and a seller if the buyer is not willing to pay the asking price", () => {
        const testBuy = new Order("acc-1", 5.0, 1, ActionEnum.BUY)
        const testSell = new Order("acc-2", 10.0, 1, ActionEnum.SELL)

        const matcher = new Matcher([testBuy, testSell]);

        expect(matcher.trades).toEqual([])
        expect(matcher.unmatchedBuyers).toEqual([])
        expect(matcher.unmatchedSellers).toEqual([])
    });
});