const mongoose = require("mongoose");

const HumiditySchema = new mongoose.Schema({
    name: { type: String, required: true},
    time: { type: Date, required: true},
    relative_humidity: { type: Number, required: true},
});

const Humidity = mongoose.model("Humidity", HumiditySchema, "humidity_data");

module.exports = Humidity;