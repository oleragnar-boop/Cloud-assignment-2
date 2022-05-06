//this client is based on the example provided in exercise 9
const mqtt = require('mqtt')
const host = 'cloud-oblig-2-mqtt.herokuapp.com'
const clientId = `mqtt_${Math.random().toString(16).slice(3)}`

const connectUrl = `ws://${host}`

// new client/ user = dæ som æ i client atm

const client = mqtt.connect(connectUrl, {
    clientId,
    clean: true,
    connectTimeout: 4000,
    name: 'test', //check in database for username and pass?
    password: '123',
    reconnectPeriod: 1000,
})

//const topic = 'test'
client.on('connect', () => {
    console.log('Sucessfully connected to the broker')

    client.subscribe([topic], () => {
        console.log(`Subscribe to topic '${topic}'`)
    })
    client.publish(topic, 'nodejs mqtt test', { qos: 0, retain: false }, (error) => {
        if (error) {
            console.error(error)
        }
    })
})

client.on('message', (topic, payload) => {
    console.log('Received Message:', topic, payload.toString())
})