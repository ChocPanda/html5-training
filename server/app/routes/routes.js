"use strict";

const formidable = require("formidable");
const { _, normalizeOrder, ...rest } = require("../orders/order");
const moment = require("moment");

const appRouter = (app, matcher) => {

  app.get("/", (_, res) => {
    res.redirect(`/main/${moment().unix()}`)
  });

  app.get("/main/:timestamp", (_, res) => {
    res.render("\mockup.ejs", {
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
    const form = new formidable.IncomingForm();
    form.parse(req, (err, fields, _) => {
      console.log(`Recieved form: ${JSON.stringify(fields)}`);
      const order = normalizeOrder(fields);
      if (err) {
        console.error(`Caught error: ${err}`);
        res.sendStatus(400);
      } else {
        matcher.add(order);
        res.redirect(303, `/main/${moment().unix()}`)
      }
    });
  });
};

module.exports = appRouter;
