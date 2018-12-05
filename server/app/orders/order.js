"use strict";

const moment = require("moment");

const createOrder = (
  account,
  price,
  quantity,
  action,
  orderTime = moment.now()
) => {
  return {
    account: account,
    price: price,
    quantity: quantity,
    action: action,
    orderTime: orderTime
  };
};

const createTrade = (buy, sell) => {
  console.log(`Creating trade between: ${JSON.stringify(buy)} and ${JSON.stringify(sell)}`)
  return {
    quantityTraded: Math.min(sell.quantity, buy.quantity),
    buyerAccount: buy.account,
    sellerAccount: sell.account,
    price: buy.price
  };
};

const normalizeOrder = orderFormSub => {
  return createOrder(
    orderFormSub.account,
    parseFloat(orderFormSub.price).toFixed(2),
    parseInt(orderFormSub.quantity),
    parseInt(orderFormSub.action)
  );
};

const Action = {
  BUY: 1,
  SELL: 2
};
Object.freeze(Action);

module.exports = { createOrder, normalizeOrder, createTrade, Action };
