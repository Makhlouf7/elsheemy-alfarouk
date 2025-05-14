const mongoose = require("mongoose");
const customerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    unique: true,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  balance: {
    type: Number,
    default: 0,
  },
  notes: {
    type: String,
  },
});

// Query Middleware =====

customerSchema.pre(/^find/, function (next) {
  this.lean();
  next();
});

customerSchema.post("find", function (docs) {
  docs.forEach((doc) => (doc._id = doc._id.toString()));
});

customerSchema.post("findOne", function (doc) {
  if (!doc) return;
  doc._id = doc._id.toString();
});

const Customer = mongoose.model("Customer", customerSchema);
module.exports = Customer;
