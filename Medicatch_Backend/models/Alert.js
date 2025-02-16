const mongoose = require("mongoose");

const alertSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  medicineName: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  // Alerts expire 3 days after being set
  expiresAt: {
    type: Date,
    required: true,
  },
  isNotified: {
    type: Boolean,
    default: false,
  },
});

module.exports = mongoose.model("Alert", alertSchema);
