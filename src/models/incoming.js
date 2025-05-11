const mongoose = require("mongoose");

const incomingSchema = new mongoose.Schema({
  supplier: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Supplier",
    required: true,
  },
  carNumber: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
  },
  loadType: {
    type: String,
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
  },
  shakara: {
    type: Number,
    required: true,
  },
  tonPrice: {
    type: Number,
    required: true,
  },
  type: {
    type: String,
    required: true,
  },
});

incomingSchema.pre(/^find/, function (next) {
  this.populate({
    path: "supplier",
    select: "name",
  }).lean();
  next();
});

incomingSchema.post("find", function (docs) {
  docs.forEach((doc) => (doc._id = doc._id.toString()));
});

incomingSchema.post("findOne", function (doc) {
  if (!doc) return;
  doc._id = doc._id.toString();
});

const Incoming = mongoose.model("Incoming", incomingSchema);
module.exports = Incoming;
