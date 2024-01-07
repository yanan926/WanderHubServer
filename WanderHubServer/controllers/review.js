const Destination = require('../models/destination');
const Review = require('../models/review');

const createReview = async (req, res) => {
  try {
    const destination = await Destination.findById(req.params.id);
    if (!destination) {
      return res.status(404).json({ message: 'Destination not found' });
    }
    const {reviewText, reviewValue, userId} = req.body
    if(!reviewText || !reviewValue || !userId) {
      return res.status(400).json({message: "incomplete information!"})
    }
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

module.exports = {
  createReview
};
