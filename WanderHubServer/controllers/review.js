const Destination = require('../models/destination');
const Review = require('../models/review');
const getReviews = async (req, res) => {
  try {
    const destination = await Destination.findById(req.params.id);
    console.log(req.params)
    if (!destination) {
      return res.status(404).json({ message: 'Destination not found' });
    }
    res.status(200).json(destination.reviews)

  }catch(err) {
    console.log(err)
    res.status(400).json({message:`${err}`})
  }
}
const createReview = async (req, res) => {
  try {
    const destination = await Destination.findById(req.params.id);
    if (!destination) {
      return res.status(404).json({ message: 'Destination not found' });
    }
    const {reviewText, reviewValue, userId} = req.body
    const review = new Review({reviewText, reviewValue});
    review.author = userId;
    destination.reviews.unshift(review);
    await review.save();
    await destination.save();
    res.status(200).json(destination);
  }catch(err) {
    res.status(400).json({
      message: `${err}`,
    });

  }
}

const deleteReview = async (_req, res) => {
  try {
    const { id, reviewId } = req.params;
    await Destination.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    res.status(200).json(destinations);
  } catch(error) {
    res.status(400).send(`There were issues contacting the database: ${error}`);
  }
};


module.exports = {
  getReviews,
  createReview,
  deleteReview
};
