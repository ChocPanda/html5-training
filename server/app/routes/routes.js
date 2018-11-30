'use strict'

const appRouter = app => {
  app.get("/", (_, res) => {
    res.redirect("/index.html");
  });

  app.use(express.static("public"));
};

module.exports = appRouter;
