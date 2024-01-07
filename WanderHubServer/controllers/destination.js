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

const postImage = async (req, res) => {
  try {
    const destination = await Destination.findById(req.params.id);
    if (!destination) {
      return res.status(404).json({ message: 'Destination not found' });
    }
    const {url} = req.body
    if(!url) {
      return res.status(400).json({message: "url can't be null"})
    }
    destination.imageList.unshift({url});
    await destination.save();
    res.status(200).json(destination.imageList);
  }catch(err) {
    res.status(400).json({
      message: `${err}`,
    });

  }
}

const getAllDestinations = async (_req, res) => {
  try {
    const destinations = await Destination.find({});
    res.status(200).json(destinations);
  } catch(error) {
    res.status(400).send(`${error}`);
  }
};


module.exports = {
  getOneDestination,
  getAllDestinations,
  postImage,
};
