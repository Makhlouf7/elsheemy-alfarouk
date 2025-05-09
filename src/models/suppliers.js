const mongoose = require("mongoose");

const supplierSchema = new mongoose.Schema({
  name: String,
  phone: String,
  address: String,
  openingBalance: Number,
  notes: String,
});

supplierSchema.pre(/^find/, function (next) {
  this.lean();
  next();
});

supplierSchema.post("find", function (docs) {
  docs.forEach((doc) => (doc._id = doc._id.toString()));
});

supplierSchema.post("findOne", function (doc) {
  doc._id = doc._id.toString();
});

const Supplier = mongoose.model("Supplier", supplierSchema);
module.exports = Supplier;
