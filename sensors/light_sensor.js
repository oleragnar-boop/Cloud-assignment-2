/*
===================================================================
|light_sensor.js simulates a light sensor
|
|1. Connects to the broker as a PUBLISHER on the topic 'light'|
|2. Generates light data on a set intervall           |
|3. Publishes the data to the broker
|   a. On the topic 'light'
|   b. With the payload of the light data
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
const client_name = 'Light_sensor'
const client_pass = 'veryverybright'

//setting global variable payload
var payload =""

//function for generating humidity data
//400 is normal outdoors, 30000 is direct sunlight (really bad interp)
//endra te lumen, 7000 æ optimal
const generateLightData = () => {
    min = Math.ceil(7500);
    max = Math.floor(6500);
    let = lightData = [{
        name: client_name,
        time : Date.now(),
        light_lumen : Math.floor(Math.random() * (max - min) + min) 
    }]
    payload = JSON.stringify(lightData)
}

//calling the data generation function on a set interval
setInterval(() => {
    generateLightData();
    }, 60000) 


//function for connecting to the broker and publishing
const connectToBroker = () => {

    const client = mqtt.connect(connectUrl, {
        clientId,
        clean: true,
        connectTimeout: 650000,
        username: client_name,
        password: client_pass,
        reconnectPeriod: 1000,
        })

    const topic = 'light';
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
            }, 600000) 
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