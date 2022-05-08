const express = require('express');
const bodyparser = require('body-parser');
const mongoose = require('mongoose');
const db = mongoose.connection;

mongoose.connect("mongodb+srv://admin:adminadmin@data.c8vtj.mongodb.net/Smart_greenhouse?retryWrites=true&w=majority", {
	useUnifiedTopology: true,
	useNewUrlParser: true
});

app.set('views',__dirname+'/views');
 app.set('view engine','ejs');
 app.use(bodyParser.urlencoded({ extended: true }))


app.get('/', (req, res) => {
    db.collection('humidity_data').findOne().sort({created_at: -1}).toArray()
    .then(results => {
        let humData = results;
        db.collection('humidity_data').findOne().sort({created_at: -1}).toArray()
        
    })
    res.render(__dirname + "index.ejs");
})