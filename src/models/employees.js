const mongoose = require("mongoose");
const employeeSchema = new mongoose.Schema({
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
  salary: {
    type: Number,
    required: true,
  },
  hireDate: {
    type: String,
  },
  department: {
    type: String,
    required: true,
  },
  notes: {
    type: String,
  },
});

employeeSchema.pre(/^find/, function (next) {
  this.lean();
  next();
});

employeeSchema.post("find", function (docs) {
  docs.forEach((doc) => (doc._id = doc._id.toString()));
});

employeeSchema.post("findOne", function (doc) {
  if (!doc) return;
  doc._id = doc._id.toString();
});

const Employee = mongoose.model("Employee", employeeSchema);
module.exports = Employee;
