'use strict'

const express = require("express");
const app = express();

const bodyParser = require("body-parser");
const routes = require("./app/routes/routes");
const Matcher = require("./app/matcher/matcher")
const morgan = require("morgan")

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(morgan("dev"));

app.use(express.static("public"));
app.use(express.static("partials"));

const matcher = new Matcher()

routes(app, matcher);

const server = app.listen(3000, () => {
  console.log(`app running on http://localhost:${server.address().port}`);
});
