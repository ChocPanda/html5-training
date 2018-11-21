'use strict';

const moment = require('moment');

const createOrder = (account, price, quantity, action, orderTime = moment.now()) => ({
    account,
    price,
    quantity,
    action,
    orderTime,
})

const createTrade = (buy, sell) => ({
    quantityTraded : Math.min(sell.quantity, buy.quantity),
    buyerAccount : buy.account,
    sellerAccount : sell.account,
    tradePrice : buy.price,
})

const Action = {
    BUY : 1,
    SELL : 2
}
Object.freeze(Action)

module.exports = { createOrder, createTrade, Action };