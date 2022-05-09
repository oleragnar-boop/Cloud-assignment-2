/*
===================================================================
|humidity_sensor.js simulates a humidity sensor
|
|1. Connects to the broker as a PUBLISHER on the topic 'humidity'|
|2. Generates humidity data on a set intervall           |
|3. Publishes the data to the broker
|   a. On the topic 'humidity'
|   b. With the payload of the humidity data
===================================================================
*/

//this client is based on the example provided in exercise 9
//dependencies
const mqtt = require("mqtt")
const mongoose = require ("mongoose")
const Clients = require ("../models/client_schema")
const host = 'cloud-oblig-2-mqtt.herokuapp.com'
const clientId = `mqtt_${Math.random().toString(16).slice(3)}`
const connectUrl = `ws://${host}`

//establishing connection to database
mongoose.connect("mongodb+srv://admin:adminadmin@data.c8vtj.mongodb.net/Smart_greenhouse?retryWrites=true&w=majority", {
	useUnifiedTopology: true,
	useNewUrlParser: true
});

//setting client data name and password
const client_name = 'Humidity_sensor'
const client_pass = 'splashsplash'

//setting global variable payload
var payload =""

//function for generating humidity data
const generateHumData = () => {
    min = Math.ceil(95);
    max = Math.floor(60);
    let = humData = [{
        name: client_name,
        time : Date.now(),
        relative_humidity : Math.floor(Math.random() * (max - min) + min) 
    }]
    payload = JSON.stringify(humData)
}

//calling the data generation function on a set interval
setInterval(() => {
    generateHumData();
    }, 5000) 


//function for connecting to the broker and publishing
const connectToBroker = () => {

    const client = mqtt.connect(connectUrl, {
        clientId,
        clean: true,
        connectTimeout: 10000,
        username: client_name,
        password: client_pass,
        reconnectPeriod: 1000,
        })

    const topic = 'humidity';
    console.log('Trying to connect')

    client.on('connect', () => {
        console.log('Sucessfully connected to the broker')

        //publishing on a set interval, uses global variable payload
          setInterval(() => {
            client.publish(topic, payload, { qos: 0, retain: false }, (error) => {
                if (error) {
                    console.error(error)
                } else {
                    console.log(payload)
                }
            })
            }, 5000) 
    })
}

//function that verifies if client is approved and then runs the connectToBroker function 
const verify_client = async () => {
Clients.findOne({name: client_name, password: client_pass}, function (err, obj){
    if(err || obj == null ) {
        console.log("Wrong credentials, client was not connected.")
    } else{
        connectToBroker()
    }
})
}

//calling verify_client
verify_client();