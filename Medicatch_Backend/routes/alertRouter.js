const express = require("express");
const router = express.Router();
const Alert = require("../models/Alert");

// Endpoint to set an availability alert
router.post("/set-alert", async (req, res) => {
  const { userId, medicineName } = req.body;
  if (!userId || !medicineName) {
    return res
      .status(400)
      .json({ message: "userId and medicineName are required." });
  }
  try {
    // Check if an active alert already exists
    const existingAlert = await Alert.findOne({
      userId,
      medicineName,
      isNotified: false,
    });
    if (existingAlert) {
      return res
        .status(400)
        .json({ message: "Alert already set for this medicine." });
    }

    // Create a new alert that expires in 3 days
    const expiresAt = new Date(Date.now() + 3 * 24 * 60 * 60 * 1000);
    const alert = new Alert({ userId, medicineName, expiresAt });
    await alert.save();
    res.status(201).json({ message: "Alert set successfully.", alert });
  } catch (error) {
    res.status(500).json({ message: "Error setting alert.", error });
  }
});

// Endpoint to cancel an availability alert
router.delete("/cancel-alert", async (req, res) => {
  const { userId, medicineName } = req.body;
  try {
    const deletedAlert = await Alert.findOneAndDelete({
      userId,
      medicineName,
      isNotified: false,
    });
    if (!deletedAlert) {
      return res
        .status(404)
        .json({ message: "No active alert found for cancellation." });
    }
    res.status(200).json({ message: "Alert canceled successfully." });
  } catch (error) {
    res.status(500).json({ message: "Error canceling alert.", error });
  }
});

module.exports = router;
