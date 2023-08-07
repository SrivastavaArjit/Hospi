const mongoose = require("mongoose");
const { firstname, lastname, specialization } = require("./details");
const cities = require("./cities");
const Doctor = require("../models/doctors");
const fetch = require("node-fetch");

mongoose.connect("mongodb://0.0.0.0:27017/hospi", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
  console.log("Database Connected");
});

const sample = (array) => array[Math.floor(Math.random() * array.length)];

const seedDB = async () => {
  await Doctor.deleteMany({});
  for (let i = 0; i < 10; i++) {
    const url = await fetch(
      "https://api.unsplash.com/photos/random?collections=Pf7ghhqRr4I&client_id=3HIG83dk4kEhQIf95MCIqL2vodiAwwrEK0AbyRxC2EY"
    )
      .then((response) => {
        return response.json();
      })
      .then((jsondata) => {
        return jsondata.urls.regular;
      })
      .catch((err) => err.data);
    // const random = Math.floor(Math.random() * 1000);
    const selectedCity = sample(cities);
    const randRating = Math.round((Math.random() * 9 + 1) * 10) / 10;
    const doctorDetail = new Doctor({
      firstname: `${sample(firstname)}`,
      lastname: `${sample(lastname)}`,
      location: `${selectedCity.city}, ${selectedCity.state}`,
      geometry: {
        type: "Point",
        coordinates: [selectedCity.longitude, selectedCity.latitude],
      },
      specialization: `${sample(specialization)}`,
      description:
        "Lorem ipsum dolor sit amet consectetur adipisicing elit. Distinctio eius perferendis voluptatibus itaque ipsam deserunt beatae unde doloremque neque ab!",
      rating: `${randRating}`,
      image: url,
    });
    await doctorDetail.save();
  }
};

seedDB().then(() => {
  mongoose.connection.close();
});
