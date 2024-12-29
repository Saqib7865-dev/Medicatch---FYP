const mongoose = require("mongoose");

const pharmacySchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  stock: [
    {
      medicineName: { type: String, required: true },
      quantity: { type: Number, required: true },
    },
  ],
  location: {
    latitude: { type: Number, required: true },
    longitude: { type: Number, required: true },
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "userModel",
    required: true,
  },
});

module.exports = mongoose.model("Pharmacy", pharmacySchema);
