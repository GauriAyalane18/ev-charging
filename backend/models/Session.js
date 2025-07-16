// models/Session.js
const mongoose = require("mongoose");

const sessionSchema = new mongoose.Schema({
  chargerId: String,
  label: String,
  startTime: Date,
  endTime: Date,
  status: { type: String, enum: ["pending", "charging", "stopped"], default: "pending" },
  payment: {
    paid: { type: Boolean, default: false },
    amount: Number,
    method: String
  }
});

module.exports = mongoose.model("Session", sessionSchema);
