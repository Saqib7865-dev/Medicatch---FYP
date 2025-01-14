const pharmacyModel = require("../models/Pharmacy");
exports.createPharmacy = async (req, res) => {
  const { name, password, location, createdBy } = req.body;
  if (!name || !password || !location || !createdBy) {
    return res.status(400).json({
      message: "Name, password, location, and createdBy are required.",
    });
  }

  try {
    const pharmacy = await pharmacyModel.create({
      name,
      password,
      location,
      createdBy,
    });

    res
      .status(201)
      .json({ message: "Pharmacy created successfully", pharmacy });
  } catch (error) {
    res.status(500).json({ message: "Error creating pharmacy", error });
  }
};

exports.getUsersPharmacy = async (req, res) => {
  try {
    const pharmacy = await pharmacyModel.findOne({
      createdBy: req.user.userId,
    });

    if (!pharmacy) {
      return res.status(404).json({ message: "Pharmacy not found" });
    }

    res
      .status(200)
      .json({ message: "Pharmacies fetched successfully", pharmacy });
  } catch (error) {
    res.status(500).json({ message: "Error fetching pharmacy", error });
  }
};

exports.updatePharmacy = async (req, res) => {
  const { id } = req.params; // Pharmacy id
  const { stock, location } = req.body;
  const userId = req.body.userId;

  try {
    const pharmacy = await pharmacyModel.findOne({
      _id: id,
      createdBy: userId,
    });

    if (!pharmacy) {
      return res
        .status(404)
        .json({ message: "Pharmacy not found or unauthorized" });
    }
    if (stock) {
      pharmacy.stock = stock;
    }
    if (location) {
      pharmacy.location = location;
    }

    await pharmacy.save();
    res
      .status(200)
      .json({ message: "Pharmacy updated successfully", pharmacy });
  } catch (error) {
    res.status(500).json({ message: "Error updating pharmacy", error });
  }
};
exports.deletePharmacy = async (req, res) => {
  const { id } = req.params;
  const userId = req.body.userId;

  try {
    const pharmacy = await pharmacyModel.findOne({
      _id: id,
      createdBy: userId,
    });

    if (!pharmacy) {
      return res
        .status(404)
        .json({ message: "Pharmacy not found or unauthorized" });
    }

    await pharmacyModel.findByIdAndDelete(id);
    res.status(200).json({ message: "Pharmacy deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting pharmacy", error });
  }
};

exports.addStock = async (req, res) => {
  const { id } = req.params;
  const { medicineName, quantity } = req.body;
  const userId = req.body.userId;

  if (!medicineName || !quantity) {
    return res
      .status(400)
      .json({ message: "Medicine name and quantity are required." });
  }

  try {
    const pharmacy = await pharmacyModel.findOne({
      _id: id,
      createdBy: userId,
    });
    if (!pharmacy) {
      return res
        .status(404)
        .json({ message: "Pharmacy not found or unauthorized" });
    }

    const stockIndex = pharmacy.stock.findIndex(
      (item) => item.medicineName === medicineName
    );

    if (stockIndex >= 0) {
      pharmacy.stock[stockIndex].quantity = quantity;
    } else {
      pharmacy.stock.push({ medicineName, quantity });
    }
    await pharmacy.save();
    res.status(200).json({ message: "Stock updated successfully", pharmacy });
  } catch (error) {
    res.status(500).json({ message: "Error updating stock", error });
  }
};
