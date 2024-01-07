
const destinationRouter = require("express").Router();
const destinationController = require("../controllers/destination");
const {getAllDestinations, getOneDestination, postImage  } = destinationController;

destinationRouter
  .route("/")
  .get(getAllDestinations)

destinationRouter
  .route("/:id")
  .get(getOneDestination)
  .post(postImage)


module.exports = destinationRouter;