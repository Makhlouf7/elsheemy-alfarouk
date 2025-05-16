const mongoose = require("mongoose");
const safeSchema = new mongoose.Schema({
  date: {
    type: String,
  },
  amount: {
    type: Number,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  source: {
    type: String,
  },
  reviewer: {
    type: String,
  },
  transactionType: {
    type: String,
    enum: ["income", "expense"],
    required: true,
  },
});

safeSchema.pre(/^find/, function (next) {
  this.lean();
  next();
});

safeSchema.post("findOne", function (doc) {
  if (!doc) return;
  doc._id = doc._id.toString();
});

safeSchema.statics.totalIncomes = async function (date) {
  const match = {
    transactionType: "income",
  };
  console.log("Date", date);
  if (date) {
    match.date = date;
  }

  const totalStat = await this.aggregate([
    {
      $match: match,
    },
    {
      $group: {
        _id: null,
        totalIncome: {
          $sum: "$amount",
        },
      },
    },
  ]);

  return totalStat[0]?.totalIncome || 0;
};

safeSchema.statics.totalExpenses = async function (date) {
  const match = {
    transactionType: "expense",
  };
  if (date) {
    match.date = date;
  }

  const totalStat = await this.aggregate([
    {
      $match: match,
    },
    {
      $group: {
        _id: null,
        totalExpense: {
          $sum: "$amount",
        },
      },
    },
  ]);

  return totalStat[0]?.totalExpense || 0;
};

safeSchema.post("find", function (docs) {
  docs.forEach((doc) => (doc._id = doc._id.toString()));
});

const Safe = mongoose.model("Safe", safeSchema);
module.exports = Safe;
