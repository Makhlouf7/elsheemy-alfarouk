const mongoose = require("mongoose");

const attendanceSchema = new mongoose.Schema({
  employeeId: {
    type: String,
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

module.exports = mongoose.model("Attendance", attendanceSchema);
