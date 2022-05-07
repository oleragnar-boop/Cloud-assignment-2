/*
===================================================================
|data_analyzer.js subscribes to the topic of each sensor.
|When a message is received, the data is parsed and the data is
|sent to the database.
|
|
===================================================================
*/
//Import the mqtt library
const mqtt = require('mqtt')
const host = 'cloud-oblig-2-mqtt.herokuapp.com'
const clientId = `mqtt_${Math.random().toString(16).slice(3)}`
const connectUrl = `ws://${host}`
const mongoose = require('mongoose')
const Humidity = require('../models/humidity_schema')
const LightSensorModel = require('../models/light_schema')
const TemperatureSensorModel = require('../models/temp_schema')

//establishing connection to database
mongoose.connect("mongodb+srv://admin:adminadmin@data.c8vtj.mongodb.net/Smart_greenhouse?retryWrites=true&w=majority", {
	useUnifiedTopology: true,
	useNewUrlParser: true
});

const client = mqtt.connect(connectUrl, {
    clientId,
    clean: true,
    connectTimeout: 4000,
    username: 'whatever',
    password: 'blahblahblah',
    reconnectPeriod: 1000,
    })


//Definng the topics to subscribe to
const topicHumidity = 'humidity'
const topicLight = 'light'
const topicTemperature = 'temperature'

client.on('connect', () => {
    console.log('Connected')

    //Subscribe to the topics
 client.subscribe([topicHumidity, topicLight, topicTemperature], () => {
        console.log(`Data analyzer Subscribed to topics ${topicHumidity}, ${topicLight}, ${topicHumidity}`)   
        
    });
})

//When a message is received, the data is parsed 
    client.on('message', async ( topic, payload) => {
        //NAMNET ÄR FAN HÄR FÖRFAN
       //TOTO add logic
        const payloadJSON = JSON.parse(payload)
        let checkString = JSON.stringify(payloadJSON)

// If the name = light, do light shit and if name = humidity, do humidity shit
    if(checkString.includes("Light_sensor")) {
        console.log('Received Message from Light sensor:', topicLight, payload.toString()) 
        LightSensorModel.create(payloadJSON, async function (err, entry) {
            if (err) return console.error(err);
            console.log("Added data to database")
            
        })
     }else if(checkString.includes("Humidity_sensor")) {
        console.log('Received Message from Humidity sensor:', topicHumidity, payload.toString()) 
        Humidity.create(JSON.parse(payload), async function (err, entry) {
            if (err) return console.error(err);
            console.log("Added data to database")
        })
     }else {
         console.log('Received Message from Temperature sensor:', topicTemperature, payload.toString()) 
        TemperatureSensorModel.create(JSON.parse(payload), async function (err, entry) {
            if (err) return console.error(err);
            console.log("Added data to database")
        }) 
     }
    })