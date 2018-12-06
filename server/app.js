"use strict";

const express = require("express");
const app = express();

const bodyParser = require("body-parser");
const routes = require("./app/routes/routes");
const Matcher = require("./app/matcher/matcher");
const Action = require("./app/orders/action")
const { createOrder, ..._ } = require("./app/orders/order");

const morgan = require("morgan");
const faker = require("faker");
const moment = require("moment")

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(morgan("dev"));

app.use(express.static("public"));
app.use(express.static("partials"));

app.set("view engine", "ejs");

const randomOrder = action => createOrder(
    Math.floor(Math.random() * 10),
    faker.finance.amount,
    faker.random.number,
    action,
    moment().subtract(faker.random.number, "minutes")
  );

const fakeBuyOrders = Array.from({ length: 10 }, _ => {
  return randomOrder(Action.BUY)
});

const fakeSellOrders = Array.from({ length: 50 }, _ => {
  return randomOrder(Action.SELL)
});

const matcher = new Matcher(fakeBuyOrders.concat(fakeSellOrders));

routes(app, matcher);

const server = app.listen(3000, () => {
  console.log(`app running on http://localhost:${server.address().port}`);
});
