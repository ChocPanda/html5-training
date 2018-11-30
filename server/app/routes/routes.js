'use strict'

const express = require("express");
const path = require('path')
const formidable = require('formidable')

const publicDir = path.join(__dirname, "../../../client/public");

const appRouter = (app, matcher) => {
  app.use(express.static(publicDir));
  
  app.get("/", (_, res) => {
    res.redirect("/mockup.html");
  });

  app.get("/trades", (_, res) => {
    res.send(matcher.trades)
  });

  app.post("/order", (req, res) => {
    const form = new formidable.IncomingForm();
    form.parse(req, (err, fields, _) => {
      console.log(`Recieved form: ${JSON.stringify(fields)} and errors ${JSON.stringify(err)}`)
    })
    res.sendStatus(200)
  })
};

module.exports = appRouter;
