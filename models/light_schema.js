const mongoose = require("mongoose");

const LightSensorSchema = new mongoose.Schema({
    time: { type: Date, required: true, default: Date.now() },
    light: { type: String, required: true, default: 'percent' },
});
//LightSensorModel is the name of the model
//LightSensorSchema is the name of the schema
//lightSensor_data is the name of the collection
const LightSensorModel = mongoose.model("LightSensorModel", LightSensorSchema, "lightSensor_data");

module.exports = LightSensorModel;