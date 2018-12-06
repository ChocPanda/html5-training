"use strict";

const moment = require("moment");

const createOrder = (
  account,
  price,
  quantity,
  action,
  orderTime = moment.now()
) => ({
  account: account,
  price: price,
  quantity: quantity,
  action: action,
  orderTime: orderTime
});

const createTrade = (buy, sell) => ({
  quantityTraded: Math.min(sell.quantity, buy.quantity),
  buyerAccount: buy.account,
  sellerAccount: sell.account,
  price: buy.price
});

const normalizeOrder = orderFormSub =>
  createOrder(
    orderFormSub.account,
    parseFloat(orderFormSub.price).toFixed(2),
    parseInt(orderFormSub.quantity),
    parseInt(orderFormSub.action)
  );

module.exports = { createOrder, normalizeOrder, createTrade };
