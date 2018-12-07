"use strict";

const { createTrade } = require("../orders/order");
const Action = require("../orders/action");
const { compareBuyers, compareSellers } = require("../orders/orderComparator");

// const add = ()

class Matcher {
  constructor(existingOrders = []) {
    this._trades = [];
    this._unmatchedBuyers = [];
    this._unmatchedSellers = [];
    this.add = this.add.bind(this);

    existingOrders.forEach(this.add);
  }

  get unmatchedBuyers() {
    return this._unmatchedBuyers.slice().sort(compareBuyers);
  }

  get unmatchedSellers() {
    return this._unmatchedSellers.slice().sort(compareSellers);
  }

  get trades() {
    return this._trades.slice();
  }

  // Pure
  _add(potentialPartners, order, createTrade, isViable) {
    const [newTrades, newUnmatchedItems] = potentialPartners.reduce(
      ([accTrades, accUnmatched], potentialPartner) => {
        if (order.quantity > 0 && isViable(potentialPartner)) {
          const trade = createTrade(potentialPartner);
          accTrades.push(trade);

          potentialPartner.quantity -= trade.quantityTraded;
          order.quantity -= trade.quantityTraded;
        }

        if (potentialPartner.quantity > 0) {
          accUnmatched.push(potentialPartner);
        }

        return [accTrades, accUnmatched];
      },
      [[], []]
    );

    return [newTrades, newUnmatchedItems];
  }

  // Side effecting
  _addSeller(order) {
    const [newTrades, newUnmatchedBuyers] = this._add(
      this.unmatchedBuyers,
      order,
      buyer => createTrade(buyer, order),
      existingOrder => order.price <= existingOrder.price
    );

    this._unmatchedBuyers = newUnmatchedBuyers
    this._trades = this._trades.concat(newTrades);

    if (order.quantity > 0) {
        this._unmatchedSellers.push(order);
    }
  }

  // Side effecting
  _addBuyer(order) {
    const [newTrades, newUnmatchedSellers] = this._add(
      this.unmatchedSellers,
      order,
      seller => createTrade(order, seller),
      existingOrder => order.price >= existingOrder.price
    );

    this._unmatchedSellers = newUnmatchedSellers
    this._trades = this._trades.concat(newTrades);

    if (order.quantity > 0) {
        this._unmatchedBuyers.push(order);
    }
  }

  // Side effecting
  add(newOrder) {
    const order = {
      ...newOrder
    };
    switch (newOrder.action) {
      case Action.BUY:
        this._addBuyer(order);
        break;
      case Action.SELL:
        this._addSeller(order);
        break;
      default:
        console.error(`Unrecognized action ${JSON.stringify(newOrder)}`);
    }

    return this;
  }
}

module.exports = Matcher;
