'use strict'

const express = require("express");
const bodyParser = require("body-parser");
const routes = require("./routes/routes");
const app = express();
const morgan = require("morgan")
const Matcher = require("./matcher/matcher")

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(morgan("dev"))

routes(app, new Matcher());

const server = app.listen(3000, () => {
  console.log(`app running on http://localhost:${server.address().port}`);
});
