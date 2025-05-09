const mongoose = require("mongoose");

const incomingSchema = new mongoose.Schema({
  name: String,
  loadType: String,
  loadWeight: Number,
});
