const reviewsRouter = require("express").Router();
const reviewsController = require("../controllers/review");
const { createReview} = reviewsController;

reviewsRouter.route("/:id").post(createReview);

module.exports =  reviewsRouter;

