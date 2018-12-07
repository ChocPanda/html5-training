"use strict";

const createOrderBook = (accountId, matcher) => ({
  unmatchedBuyers: matcher.unmatchedBuyers.filter(o => o.account === accountId),
  unmatchedSellers: matcher.unmatchedSellers.filter(
    o => o.account === accountId
  ),
  trades: matcher.trades.filter(trade => {
    return trade.buyerAccount === accountId || trade.sellerAccount === accountId;
  })
});

module.exports = createOrderBook
