'use strict';

const Matcher = require("../app/matcher/matcher");
const { createOrder, createTrade, Action } = require("../app/orders/order");

describe("Matcher", () => {
    test("Initialise to an empty set of orders", () => {
        expect(new Matcher().trades).toEqual([]);
        expect(new Matcher().unmatchedBuyers).toEqual([]);
        expect(new Matcher().unmatchedSellers).toEqual([]);
    });

    test("Initialise and separate unmatched buyer and seller orders", () => {
        const testBuy = createOrder("acc-1", 5.0, 1, Action.BUY)
        const testSell = createOrder("acc-2", 7.0, 1, Action.SELL)

        const matcher = new Matcher([testBuy, testSell]);
        
        expect(matcher.unmatchedBuyers).toEqual([testBuy]);
        expect(matcher.unmatchedSellers).toEqual([testSell]);
    });

    describe("Initialise and sort", () => {

        test("a set of buyers by price", () => {
            const orderTime = new Date()
            const testBuy1 = createOrder("acc-1", 5.0, 1, Action.BUY, orderTime);
            const testBuy2 = createOrder("acc-1", 3.0, 1, Action.BUY, orderTime);
            
            const matcher1 = new Matcher([testBuy1, testBuy2]);
            const matcher2 = new Matcher([testBuy2, testBuy1]);
    
            expect(matcher1.unmatchedBuyers).toEqual(matcher2.unmatchedBuyers);
        });
    
        test("a set of buyers by order time", () => {
            const testBuy1 = createOrder("acc-1", 5.0, 1, Action.BUY, Date(5000000));
            const testBuy2 = createOrder("acc-1", 5.0, 1, Action.BUY, Date(3000000));
            
            const matcher1 = new Matcher([testBuy1, testBuy2]);
            const matcher2 = new Matcher([testBuy2, testBuy1]);
    
            expect(matcher1.unmatchedBuyers).toEqual(matcher2.unmatchedBuyers);
        });
    
        test("a set of sellers by price", () => {
            const orderTime = new Date()
            const testSell1 = createOrder("acc-2", 5.0, 1, Action.SELL, orderTime);
            const testSell2 = createOrder("acc-2", 3.0, 1, Action.SELL, orderTime);
            
            const matcher1 = new Matcher([testSell1, testSell2]);
            const matcher2 = new Matcher([testSell2, testSell1]);
    
            expect(matcher1.unmatchedSellers).toEqual(matcher2.unmatchedSellers);
        });
    
        test("a set of sellers by order time", () => {
            const testSell1 = createOrder("acc-2", 3.0, 1, Action.SELL, new Date(5000000000));
            const testSell2 = createOrder("acc-2", 3.0, 1, Action.SELL, new Date(3000000000));
            
            console.log(testSell1.orderTime)
            console.log(testSell2.orderTime)
    
            const matcher1 = new Matcher([testSell1, testSell2]);
            const matcher2 = new Matcher([testSell2, testSell1]);
    
            expect(matcher1.unmatchedSellers).toEqual(matcher2.unmatchedSellers);
        });

    })

    test("add new buy and sell orders", () => {
        const testBuy = createOrder("acc-1", 5.0, 1, Action.BUY)
        const testSell = createOrder("acc-2", 7.0, 1, Action.SELL)

        const matcher = new Matcher();
        matcher.add(testBuy).add(testSell)

        expect(matcher.unmatchedBuyers).toEqual([testBuy]);
        expect(matcher.unmatchedSellers).toEqual([testSell]);
    });

    test("match a buyer and a seller if the buyer is willing to pay the asking price", () => {
        const testBuy = createOrder("acc-1", 5.0, 1, Action.BUY)
        const testSell = createOrder("acc-2", 5.0, 1, Action.SELL)

        const matcher = new Matcher([testBuy, testSell]);

        expect(matcher.unmatchedBuyers).toEqual([])
        expect(matcher.unmatchedSellers).toEqual([])
        expect(matcher.trades).toEqual([createTrade(testBuy, testSell)])
    });

    test("match a buyer and a seller if the buyer is willing to pay more than the asking price", () => {
        const testBuy = createOrder("acc-1", 10.0, 1, Action.BUY)
        const testSell = createOrder("acc-2", 5.0, 1, Action.SELL)

        const matcher = new Matcher([testBuy, testSell]);

        expect(matcher.trades).toEqual([createTrade(testBuy, testSell)])
        expect(matcher.unmatchedBuyers).toEqual([])
        expect(matcher.unmatchedSellers).toEqual([])
    });

    test("match a buyer to multiple sellers if the buyer wants more than the first seller can provide", () => {
        const testBuy = createOrder("acc-1", 5.0, 2, Action.BUY)
        const testSell1 = createOrder("acc-2", 5.0, 1, Action.SELL)
        const testSell2 = createOrder("acc-3", 5.0, 1, Action.SELL)

        const matcher = new Matcher([testBuy, testSell1, testSell2]);

        expect(matcher.trades).toEqual([createTrade(testBuy, testSell1), createTrade(testBuy, testSell2)])
        expect(matcher.unmatchedBuyers).toEqual([])
        expect(matcher.unmatchedSellers).toEqual([])
    });

    test("not match a buyer and a seller if the buyer is not willing to pay the asking price", () => {
        const testBuy = createOrder("acc-1", 5.0, 1, Action.BUY)
        const testSell = createOrder("acc-2", 10.0, 1, Action.SELL)

        const matcher = new Matcher([testBuy, testSell]);

        expect(matcher.trades).toEqual([])
        expect(matcher.unmatchedBuyers).toEqual([testBuy])
        expect(matcher.unmatchedSellers).toEqual([testSell])
    });
    
    test("match existing buyers will new sellers once they're added", () => {
        const testBuy = createOrder("acc-1", 5.0, 1, Action.BUY)
        const testSell = createOrder("acc-2", 5.0, 1, Action.SELL)

        const matcher = new Matcher([testBuy]);
        expect(matcher.unmatchedBuyers).toEqual([testBuy])
        expect(matcher.unmatchedSellers).toEqual([])

        matcher.add(testSell)

        expect(matcher.unmatchedBuyers).toEqual([])
        expect(matcher.unmatchedSellers).toEqual([])
        expect(matcher.trades).toEqual([createTrade(testBuy, testSell)])
    });
    
    test("match existing sellers with new buyers once they're added", () => {
        const testBuy = createOrder("acc-1", 5.0, 1, Action.BUY)
        const testSell = createOrder("acc-2", 5.0, 1, Action.SELL)

        const matcher = new Matcher([testSell]);
        expect(matcher.unmatchedSellers).toEqual([testSell])
        expect(matcher.unmatchedBuyers).toEqual([])

        matcher.add(testBuy)

        expect(matcher.unmatchedBuyers).toEqual([])
        expect(matcher.unmatchedSellers).toEqual([])
        expect(matcher.trades).toEqual([createTrade(testBuy, testSell)])
    });
});