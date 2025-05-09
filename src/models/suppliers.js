const mongoose = require("mongoose");

const supplierSchema = new mongoose.Schema({
  name: String,
  phone: String,
  address: String,
  openingBalance: Number,
  notes: String,
});

const Supplier = mongoose.model("Supplier", supplierSchema);
module.exports = Supplier;
