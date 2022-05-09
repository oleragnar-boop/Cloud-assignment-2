const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const Humidity = require('./models/humidity_schema')
const LightSensorModel = require('./models/light_schema')
const TemperatureSensorModel = require('./models/temp_schema')
const db = mongoose.connection;

//global variables for humidity, temperature and light averages
var averageHum = ""
var averageLight = ""
var averageTemp = ""

mongoose.connect("mongodb+srv://admin:adminadmin@data.c8vtj.mongodb.net/Smart_greenhouse?retryWrites=true&w=majority", {
	useUnifiedTopology: true,
	useNewUrlParser: true
})
.then(mongoose => {

    app.set('views',__dirname+'/views');
 app.set('view engine','ejs');
 app.use(bodyParser.urlencoded({ extended: true }))

 app.listen(process.env.PORT || 3000, function () {
    console.log('listening on 3000')
  })


app.get('/', (req, res) => {
    get_average_hum();
    get_average_light();
    get_average_temp();
    db.collection('humidity_data').findOne()
    .then(results => { 
        let humData = results;
        db.collection('lightSensor_data').findOne()
        .then(results => {
            let lightData = results;
            db.collection('temperatureSensor_data').findOne()
            .then(results => {
                let tempData = results;
                res.render("index.ejs", { humData: humData, lightData: lightData, tempData: tempData, averageHum: averageHum, averageLight: averageLight, averageTemp: averageTemp});
            })
        })
    })
})


})

//average humidity
const get_average_hum = async () => {
    Humidity.aggregate([{"$group": {"_id": null, "avg": {"$avg": "$relative_humidity"}}}, {"$project": {_id: 0, avg: 1}}], function (err, obj) {
        if(err || obj == null ) {
            console.log("Something went wrong")
        } else{
            obj.forEach(function(avgHum){
                averageHum = avgHum.avg
        })
    }
})
}

//average light
const get_average_light = async () => {
    LightSensorModel.aggregate([{"$group": {"_id": null, "avg": {"$avg": "$light_lumen"}}}, {"$project": {_id: 0, avg: 1}}], function (err, obj) {
        if(err || obj == null ) {
            console.log("Something went wrong")
        } else{
            obj.forEach(function(avgLight){
                averageLight = avgLight.avg
        })
    }
})
}

//average temperature
const get_average_temp = async () => {
    TemperatureSensorModel.aggregate([{"$group": {"_id": null, "avg": {"$avg": "$temperature"}}}, {"$project": {_id: 0, avg: 1}}], function (err, obj) {
        if(err || obj == null ) {
            console.log("Something went wrong")
        } else{
            obj.forEach(function(avgTemp){
                averageTemp = avgTemp.avg
        })
    }
})
}
