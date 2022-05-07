const mongoose = require("mongoose");

const TemperatureSensorSchema = new mongoose.Schema({
    time: { type: Date, required: true, default: Date.now() },
    temperature: { type: String, required: true, default: 'celsius' },
});

const TemperatureSensorModel = mongoose.model("TemperatureSensorModel", TemperatureSensorSchema, "temperatureSensor_data");
module.exports = TemperatureSensorModel;