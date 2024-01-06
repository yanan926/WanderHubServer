const mongoose = require('mongoose');
const cities = require('./cities');
const imageList = require('./image')
const Destination = require('../models/destination');

mongoose.connect('mongodb://localhost:27017/wanderHub', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const db = mongoose.connection;

db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});

const seedDB = async () => {
    await Destination.deleteMany({});
    for (let i = 0; i < 300; i++) {
        const random1000 = Math.floor(Math.random() * 1000);
        const wanderHubDestination = new Destination({
            title: `${cities[random1000].city}, ${cities[random1000].state}`,
            image: { url: `${imageList[Math.floor(Math.random() * imageList.length)]}.`},
            description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Quibusdam dolores vero perferendis laudantium, consequuntur voluptatibus nulla architecto, sit soluta esse iure sed labore ipsam a cum nihil atque molestiae deserunt!',
            geometry: {
                type: "Point",
                coordinates: [
                    cities[random1000].longitude,
                    cities[random1000].latitude,
                ]
            },
            city: `${cities[random1000].city}`,
            state:`${cities[random1000].state}`,
            imageList: [
               imageList.map((image)=>{url: image})
            ]
        })
        await wanderHubDestination.save();
    }
}

seedDB().then(() => {
    mongoose.connection.close();
})