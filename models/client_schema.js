const mongoose = require("mongoose");

const ClientSchema = new mongoose.Schema({
    name: { type: String, required: true},
    password: { type: String, required: true},
});

const Clients = mongoose.model("Clients", ClientSchema, "clients");

module.exports = Clients;