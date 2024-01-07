const reviewsRouter = require("express").Router();
const reviewsController = require("../controllers/review");
const { getReviews, createReview, deleteReview } = reviewsController;

reviewsRouter.route("/:id").get(getReviews).post(createReview).delete(deleteReview);

reviewsRouter.route("/:id/:reviewId").delete(deleteReview);

module.exports =  reviewsRouter;

