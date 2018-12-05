"use strict";

const { _, normalizeOrder, ...rest } = require("../orders/order");
const moment = require("moment");

const appRouter = (app, matcher) => {
  app.get("/", (_, res) => {
    res.render("mockup.ejs", {
      buyOrders: matcher.unmatchedBuyers,
      sellOrders: matcher.unmatchedSellers,
      trades: matcher.trades
    });
  });

  app.get("/trades", (_, res) => {
    res.send(matcher.trades);
  });

  app.get("/orders", (_, res) => {
    res.send(matcher.unmatchedBuyers.concat(matcher.unmatchedSellers));
  });

  app.get("/orders/:action", (_, res) => {
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
