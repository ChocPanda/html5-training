"use strict";

const { normalizeOrder } = require("../orders/order");
const createOrderBook = require("../orders/orderBook");

const appRouter = (app, matcher) => {

  app.get("/", (_, res) => {
    res.render("mockup.ejs", {
      buyOrders: matcher.unmatchedBuyers,
      sellOrders: matcher.unmatchedSellers,
      trades: matcher.trades
    });
  });

  app.get("/:id", (req, res) => {
    const accountId = req.params.id
    const orderBook = createOrderBook(accountId, matcher)
console.log(orderBook)
    res.render("mockup.ejs", {
      buyOrders: orderBook.unmatchedBuyers,
      sellOrders: orderBook.unmatchedSellers,
      trades: orderBook.trades
    });
  });

  app.get("/trades", (_, res) => {
    res.send(matcher.trades);
  });

  app.get("/trades/:id", (_, res) => {
    const accountId = req.params.id
    const orderBook = createOrderBook(accountId, matcher)

    res.send(orderBook.trades);
  });

  app.get("/orders", (_, res) => {
    res.send(matcher.unmatchedBuyers.concat(matcher.unmatchedSellers));
  });

  app.get("/orders/:id", (_, res) => {
    const accountId = req.params.id
    const orderBook = createOrderBook(accountId, matcher)

    res.send(orderBook.unmatchedBuyers.concat(matcher.unmatchedSellers));
  });

  app.get("/orders/:action/:id", (_, res) => {
    const action = req.params.action.toLowerCase();
    switch (action) {
      case "sell":
        res.send(matcher.unmatchedSellers);
        break;
      case "buy":
        res.send(matcher.unmatchedBuyers);
        break;
      default:
        res.sendStatus(404);
    }
  });

  app.post("/order", (req, res) => {
    console.log(JSON.stringify(req.body));
    const order = normalizeOrder(req.body);

    matcher.add(order);
    res.redirect(`/`);
  });
};

module.exports = appRouter;
