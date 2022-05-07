const mongoose = require("mongoose");

const LightSensorSchema = new mongoose.Schema({
    name: { type: String, required: true},
    time: { type: Date, required: true},
    light_lumen: { type: Number, required: true},
});
//LightSensorModel is the name of the model
//LightSensorSchema is the name of the schema
//lightSensor_data is the name of the collection
const LightSensorModel = mongoose.model("LightSensorModel", LightSensorSchema, "lightSensor_data");

module.exports = LightSensorModel;