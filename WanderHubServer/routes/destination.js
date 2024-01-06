
const destinationRouter = require("express").Router();
const destinationController = require("../controllers/destination");
const {getAllDestinations, getOneDestination  } = destinationController;

destinationRouter
  .route("/")
  .get(getAllDestinations)

destinationRouter
  .route("/:id")
  .get(getOneDestination)


module.exports = destinationRouter;