const mongoose = require("mongoose");

const attendanceSchema = new mongoose.Schema({
  employeeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Employee", // Reference to Employee model
    required: true,
  },
  date: {
    type: String, // Format: "YYYY-MM-DD" as string to avoid time conflicts
    required: true,
  },
  status: {
    type: String,
    enum: ["present", "absent", "late", "leave"],
    required: true,
  },
  checkIn: {
    type: String,
  },
  checkOut: {
    type: String,
  },
});

// Ensure each employee can only have one record per date
attendanceSchema.index({ employeeId: 1, date: 1 }, { unique: true });

attendanceSchema.pre(/^find/, function (next) {
  this.lean();
  next();
});

attendanceSchema.post("find", function (docs) {
  docs.forEach((doc) => (doc._id = doc._id.toString()));
});

attendanceSchema.post("findOne", function (doc) {
  if (!doc) return;
  doc._id = doc._id.toString();
});

const Attendance = mongoose.model("Attendance", attendanceSchema);
module.exports = Attendance;
