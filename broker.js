/*
==========================================================
|broker.js acts as a middleman between subscribers and and publishers
|   Clients can publish to a topic and the broker will
|   forward the message to the subscribers.                
|             
==========================================================
*/


//this broker is based on the example provided in exercise 9
//MQTT broker

const aedes = require('aedes')();
const httpServer = require("http").createServer();
const ws = require("websocket-stream");
const port = process.env.PORT || 80;


ws.createServer({ server: httpServer }, aedes.handle);

httpServer.listen(port, function () {
    console.log('Aedes listening on port:', port)
    aedes.publish({ topic: 'aedes/hello', payload: "I'm broker " + aedes.id })
})

//when a client connects
aedes.on('client', function (client) {
    console.log('Client Connected: \x1b[33m' + (client ? client.id : client) + '\x1b[0m',
        'to broker', aedes.id)
})

//when a client disconnects
aedes.on('clientDisconnect', function (client) {
    console.log('Client Disconnected: \x1b[31m' + (client ? client.id : client) +
        '\x1b[0m', 'to broker', aedes.id)
})

//when a topic is subscribed to
aedes.on('subscribe', function (subscriptions, client) {
    console.log('MQTT client \x1b[32m' + (client ? client.id : client) +
        '\x1b[0m subscribed to topics: ' + subscriptions.map(s => s.topic).join('\n'),
        'from broker', aedes.id)
})

//when a topic is unsubscribed from
aedes.on('unsubscribe', function (subscriptions, client) {
    console.log('MQTT client \x1b[32m' + (client ? client.id : client) +
        '\x1b[0m unsubscribed to topics: ' + subscriptions.join('\n'), 'from broker',
        aedes.id)
})

// fired when a message is published
aedes.on('publish', function (packet, client) {
    console.log('Client \x1b[31m' + (client ? client.id : 'BROKER_' + aedes.id) + '\x1b[0m has published', packet.payload.toString(), 'on', packet.topic, 'to broker', aedes.id)
})