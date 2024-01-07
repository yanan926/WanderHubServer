const Destination = require('../models/destination');

const getOneDestination = async (req, res,) => {
  try {
  const destination = await Destination.findById(req.params.id).populate({
    path: 'reviews',
    populate: {
        path: 'author'
    }
})

  res.status(200).json(destination);
  }catch(err) {
    res.status(500).json({
      message: `${err}`,
    });

  }
}

const getAllDestinations = async (_req, res) => {
  try {
    const destinations = await Destination.find({});
    res.status(200).json(destinations);
  } catch(error) {
    res.status(400).send(`There were issues contacting the database: ${error}`);
  }
};


module.exports = {
  getOneDestination,
  getAllDestinations
};
