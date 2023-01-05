const homeRouter = require("express").Router();

//main home route
homeRouter.get("/", (req, res) => {
  res.send("/home GET request received!");
});

module.exports = homeRouter;
