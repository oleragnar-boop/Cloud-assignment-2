const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const Humidity = require('./models/humidity_schema');
const LightSensorModel = require('./models/light_schema');
const TemperatureSensorModel = require('./models/temp_schema');
const db = mongoose.connection;

//global variables for humidity, temperature and light averages
var averageHum = "";
var averageLight = "";
var averageTemp = "";

mongoose.connect("mongodb+srv://admin:adminadmin@data.c8vtj.mongodb.net/Smart_greenhouse?retryWrites=true&w=majority", {
	useUnifiedTopology: true,
	useNewUrlParser: true
})
.then(mongoose => {

    app.use(express.static(__dirname + '/style'))
 app.set('views',__dirname+'/views');
 app.set('view engine','ejs');
 app.use(bodyParser.urlencoded({ extended: true }))

 app.listen( process.env.PORT, function () {
    console.log('listening on 3000')
  })


app.get('/', (req, res) => {
    get_average_hum();
    get_average_light();
    get_average_temp();
    Humidity.find({})
    .then(results => { 
        let humData = results.map(e => e.relative_humidity);
        LightSensorModel.find({})
        .then(results => {
            let lightData = results.map(e => e.light_lumen);
            TemperatureSensorModel.find({})
            .then(results => {
                let tempData = results.map(e => e.temperature);
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
                averageHum = Number.parseFloat(avgHum.avg).toFixed(2);
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
                averageLight = Number.parseFloat(avgLight.avg).toFixed(2);
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
                averageTemp = Number.parseFloat(avgTemp.avg).toFixed(2);
        })
    }
})
}
