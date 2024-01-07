const mongoose = require('mongoose');
const cities = require('./cities');
const imageList = require('./image')
const descriptionList = require('./description')
const Destination = require('../models/destination');
const Review = require('../models/review');

mongoose.connect('mongodb://localhost:27017/wanderHub', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const db = mongoose.connection;

db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});

const imageGalleryList = imageList.map((image) => ({ url: image }));

const seedDB = async () => {
    await Destination.deleteMany({});
    await Review.deleteMany({})
    for (let i = 0; i < 300; i++) {
        const random1000 = Math.floor(Math.random() * 1000);
        const wanderHubDestination = new Destination({
            title: `${cities[random1000].city}, ${cities[random1000].state}`,
            image: { url: `${imageList[Math.floor(Math.random() * imageList.length)]}.`},
            description: descriptionList[Math.floor(Math.random() * descriptionList.length)],
            geometry: {
                type: "Point",
                coordinates: [
                    cities[random1000].longitude,
                    cities[random1000].latitude,
                    0,
                ]
            },
            latitude:  cities[random1000].latitude,
            longitude: cities[random1000].longitude,
            city: `${cities[random1000].city}`,
            state:`${cities[random1000].state}`,
            imageList: imageGalleryList,
            reviews:[],
        })
        await wanderHubDestination.save();
    }
}

seedDB().then(() => {
    mongoose.connection.close();
})