const mongoose = require("mongoose");
const Incoming = require("./incoming");

const supplierSchema = new mongoose.Schema({
  name: {
    type: String,
    unique: true,
    required: true,
  },
  phone: {
    type: String,
    unique: true,
    required: true,
  },
  address: String,
  openingBalance: Number,
  contactPerson: String,
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
  if (!doc) return;
  doc._id = doc._id.toString();
});

supplierSchema.post("findOneAndDelete", async function (doc) {
  if (!doc) return;
  await Incoming.deleteMany({ supplier: doc._id.toString() });
});

const Supplier = mongoose.model("Supplier", supplierSchema);
module.exports = Supplier;
