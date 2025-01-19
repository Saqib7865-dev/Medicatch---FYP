const pharmacyModel = require("../models/Pharmacy");
const csv = require("csvtojson");
exports.createPharmacy = async (req, res) => {
  const { name, password, location, createdBy, address, contact } = req.body;
  if (!name || !location || !createdBy || !address || !contact) {
    return res.status(400).json({
      message:
        "Name, password, location, address and contact details are required.",
    });
  }

  try {
    const existingPharmacy = await pharmacyModel.findOne({
      createdBy: req.user.userId,
    });

    if (existingPharmacy) {
      return res.status(400).json({
        message:
          "You already have a pharmacy. Only one pharmacy is allowed per user.",
      });
    }
    const pharmacy = await pharmacyModel.create({
      name,

      location,
      createdBy,
      address,
      contact,
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
  const { stock, location, address, contact } = req.body;
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
    if (address) {
      pharmacy.address = address;
    }
    if (contact) {
      pharmacy.contact = contact;
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
  // const { medicineName, quantity } = req.body;
  const userId = req.body.userId;

  // if (!medicineName || !quantity) {
  //   return res
  //     .status(400)
  //     .json({ message: "Medicine name and quantity are required." });
  // }
  if (!req.file) res.status(404).send({ message: "CSV file is required" });
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
    let userData = [];
    csv()
      .fromFile(req.file.path)
      .then(async (response) => {
        for (let i = 0; i < response.length; i++) {
          userData.push({
            medicineName: response[i].medicineName,
            quantity: response[i].quantity,
          });
        }
        for (let i = 0; i < userData.length; i++) {
          const { medicineName, quantity } = userData[i];

          // Ensure both fields exist
          if (!medicineName || !quantity) {
            return res.status(400).json({ message: "Invalid CSV data format" });
          }

          // Check if the medicine already exists in stock
          const stockIndex = pharmacy.stock.findIndex(
            (item) => item.medicineName === medicineName
          );

          if (stockIndex >= 0) {
            // Update quantity if medicine exists
            pharmacy.stock[stockIndex].quantity = parseInt(quantity);
          } else {
            // Add new medicine to stock
            pharmacy.stock.push({
              medicineName,
              quantity: parseInt(quantity),
            });
          }
        }
        await pharmacy.save();
        res
          .status(200)
          .json({ message: "Stock updated successfully", pharmacy });
      });
  } catch (error) {
    res.status(500).json({ message: "Error updating stock", error });
  }
};
