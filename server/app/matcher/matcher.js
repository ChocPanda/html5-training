'use strict';

const { _, createTrade, Action } = require("../orders/order");
const { sortBuyers, sortSellers } = require("../orders/orderComparator")

class Matcher {
    constructor(existingOrders = []) {
        this._trades = []

        const [sellers, buyers] =
            existingOrders
                .reduce((result, trade) => {
                        result[trade.action === Action.SELL ? 0 : 1].push(trade);
                        return result;
                    }, [ [], [] ]);

        if (sellers.length > buyers.length) {
            this._unmatchedBuyers = []
            this._unmatchedSellers = sellers
            buyers.forEach(b => this.add(b));
        } else {
            this._unmatchedSellers = []
            this._unmatchedBuyers = buyers
            sellers.forEach(s => this.add(s));
        }
    }

    get unmatchedBuyers() {
        return this._unmatchedBuyers.slice().sort(sortBuyers)
    }

    get unmatchedSellers() {
        return this._unmatchedSellers.slice().sort(sortSellers)
    }

    get trades() {
        return this._trades.slice()
    }

    add(newOrder) {
        const clonedOrder = {
            ...newOrder,
        }

        switch(newOrder.action) {
            case Action.BUY:
                const [ newBuys, newUnmatchedSellers ] = this.calcTradesWithNewBuyer(clonedOrder)

                this._trades = this._trades.concat(newBuys)
                this._unmatchedSellers = newUnmatchedSellers

                if (clonedOrder.quantity > 0) {
                    this._unmatchedBuyers.push(clonedOrder);
                }
                break;
            case Action.SELL:
                const [ newSales, newUnmatchedBuyers ] = this.calcTradesWithNewSeller(clonedOrder)

                this._trades = this._trades.concat(newSales)
                this._unmatchedBuyers = newUnmatchedBuyers

                if (clonedOrder.quantity > 0) {
                    this._unmatchedSellers.push(clonedOrder);
                }
                break;
            default:
                throw new Error("Unrecognized action")
        }

        return this;
    }

    calcTradesWithNewBuyer(buyer) {
        return this.unmatchedSellers.reduce(([ trades, unmatchedSellers] , sell) => {                    
            const clonedSell = {
                ...sell,
            }

            if (buyer.quantity > 0 && buyer.price >= sell.price) {
                const trade = createTrade(buyer, sell)
                trades.push(trade);

                clonedSell.quantity -= trade.quantityTraded;
                buyer.quantity      -= trade.quantityTraded;
            }
            
            if (clonedSell.quantity > 0) {
                unmatchedSellers.push(clonedSell);
            }

            return [trades, unmatchedSellers];
        }, [ [], [] ]);
    }

    calcTradesWithNewSeller(seller) {
        return this.unmatchedBuyers.reduce(([ trades, unmatchedBuyers ], buy) => {
            const clonedBuy = {
                ...buy,
            }

            if (seller.quantity > 0 && seller.price <= buy.price) {
                const trade = createTrade(buy, seller)
                trades.push(trade);

                clonedBuy.quantity  -= trade.quantityTraded
                seller.quantity     -= trade.quantityTraded
            }

            if (clonedBuy.quantity > 0) {
                unmatchedBuyers.push(clonedBuy)
            }
            
            return [ trades, unmatchedBuyers ]
        }, [ [], [] ]);
    }
}

module.exports = Matcher;