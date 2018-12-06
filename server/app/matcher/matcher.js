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

  _add(potentialPartners, order, createTrade, isViable) {
    const [newTrades, newUnmatchedItems] = potentialPartners.reduce(
      ([trades, accUnmatched], potentialPartner) => {
        if (order.quantity > 0 && isViable(potentialPartner)) {
          const trade = createTrade(potentialPartner);
          trades.push(trade);

          potentialPartner.quantity -= trade.quantityTraded;
          order.quantity -= trade.quantityTraded;
        }

        if (potentialPartner.quantity > 0) {
          accUnmatched.push(potentialPartner);
        }

        return [trades, accUnmatched];
      },
      [[], []]
    );

    return [newTrades, newUnmatchedItems];
  }

  _addSeller(order) {
    const [newTrades, newUnmatchedBuyers] = this._add(
      this.unmatchedBuyers,
      order,
      sell => createTrade(order, sell),
      existingOrder => order.price <= existingOrder.price
    );

    if (order.quantity > 0) {
        this._unmatchedSellers.push(order);
    }

    this._unmatchedBuyers = newUnmatchedBuyers
    this._trades = this._trades.concat(newTrades);
  }

  _addBuyer(order) {
    const [newTrades, newUnmatchedSellers] = this._add(
      this.unmatchedSellers,
      order,
      buy => createTrade(buy, order),
      existingOrder => order.price >= existingOrder.price
    );

    if (order.quantity > 0) {
        this._unmatchedBuyers.push(order);
    }

    this._unmatchedSellers = newUnmatchedSellers
    this._trades = this._trades.concat(newTrades);
  }

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
