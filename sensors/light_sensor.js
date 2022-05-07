//this client is based on the example provided in exercise 9
const mqtt = require('mqtt')
const mongoose = require ("mongoose")
const Clients = require ("../models/client_schema")
const host = 'http://localhost:80/' //'cloud-oblig-2-mqtt.herokuapp.com'
const clientId = `mqtt_${Math.random().toString(16).slice(3)}`

mongoose.connect("mongodb+srv://admin:adminadmin@data.c8vtj.mongodb.net/Smart_greenhouse?retryWrites=true&w=majority", {
	useUnifiedTopology: true,
	useNewUrlParser: true
});

const connectUrl = `${host}` //`ws://${host}`

const client_name = 'Humidity_sensor'
const client_pass = 'splashsplash'

// new client = dæ som æ i client atm
const client_details = {
    clientId,
    clean: true,
    connectTimeout: 4000,
    name: client_name, 
    password: client_pass,
    reconnectPeriod: 1000,
}

generateHumData = () => {
    let = humData = [{
        time : Date.now(),
        humidity : Math.floor(Math.random() * 101) 
    }]
    let humDataString = JSON.stringify(humData)
    return humDataString;
}


verify_client = () => {
Clients.findOne({name: client_name, password: client_pass}, function (err, obj){
    if(err || obj == null ) {
        console.log("Something went wrong, client was not connected")
    } else{
        const client = mqtt.connect(connectUrl, client_details)
        const topic = 'humidity'

        client.on('connect', () => {
            console.log('Sucessfully connected to the broker')
        
            client.subscribe([topic], () => {
                console.log(`Subscribe to topic '${topic}'`)
            })

            setInterval(() => {
                client.publish(topic, generateHumData(), { qos: 0, retain: false }, (error) => {
                    if (error) {
                        console.error(error)
                    }
                })

            }, 10000)
        })
        
        client.on('message', (topic, payload) => {
            console.log('Received Message:', topic, payload.toString())
        })

    }
})
}

