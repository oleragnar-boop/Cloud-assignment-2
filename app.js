const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const Humidity = require('./models/humidity_schema')
const LightSensorModel = require('./models/light_schema')
const TemperatureSensorModel = require('./models/temp_schema')
const db = mongoose.connection;

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
    db.collection('humidity_data').findOne()
    .then(results => { 
        let humData = results;
        console.log(results)
        db.collection('lightSensor_data').findOne()
        .then(results => {
            let lightData = results;
            console.log(results)
            db.collection('temperatureSensor_data').findOne()
            .then(results => {
                let tempData = results;
                console.log(results)
                res.render("index.ejs", { humData: humData, lightData: lightData, tempData: tempData});
            })
        })
    })
})


})
