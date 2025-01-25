const pharmacyModel = require("../models/Pharmacy");
const userModel = require("../models/Users");
const csv = require("csvtojson");
exports.createPharmacy = async (req, res) => {
  const { name, location, createdBy, address, contact } = req.body;
  if (!name || !location || !createdBy || !address || !contact) {
    return res.status(400).json({
      message: "Please provide all the credentials.",
    });
  }

  try {
    // const existingPharmacy = await pharmacyModel.findOne({
    //   createdBy: req.user.userId,
    // });

    // if (existingPharmacy) {
    //   return res.status(400).json({
    //     message:
    //       "You already have a pharmacy. Only one pharmacy is allowed per user.",
    //   });
    // }
    const pharmacy = await pharmacyModel.create({
      name,
      location,
      createdBy,
      address,
      contact,
    });
    let user = await userModel.findOne({ _id: createdBy });
    user.role = "pharmacy";
    await user.save();
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
      createdBy: req.params.id,
    });

    // const pharmacy = await pharmacyModel.findOne({
    //   createdBy: req.user.userId,
    // });

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
    let user = await userModel.findOne({ _id: userId });
    user.role = "user";
    await user.save();
    await pharmacyModel.findByIdAndDelete(id);
    res.status(200).json({ message: "Pharmacy deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting pharmacy", error });
  }
};

exports.addStock = async (req, res) => {
  const { id } = req.params;
  // const userId = req.body.userId;

  // if (!medicineName || !quantity) {
  //   return res
  //     .status(400)
  //     .json({ message: "Medicine name and quantity are required." });
  // }

  if (!req.file) res.status(404).send({ message: "CSV file is required" });
  try {
    const pharmacy = await pharmacyModel.findOne({
      _id: id,
      // createdBy: userId,
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

exports.getMedicine = async (req, res) => {
  try {
    const { query } = req.query;
    if (!query) {
      return res.status(400).json({ message: "Query parameter is required." });
    }
    const pharmacies = await pharmacyModel.find({
      stock: {
        $elemMatch: {
          medicineName: { $regex: query, $options: "i" },
        },
      },
    });

    if (pharmacies.length === 0) {
      return res.json({ message: "No matching medicines found." });
    }

    // Transform the response into the desired format
    const result = pharmacies.flatMap((pharmacy) =>
      pharmacy.stock
        .filter((item) =>
          item.medicineName.toLowerCase().includes(query.toLowerCase())
        )
        .map((item) => ({
          pharmacy: {
            medicineName: item.medicineName,
            quantity: item.quantity,
            pharmacyName: pharmacy.name,
            address: pharmacy.address,
            contact: pharmacy.contact,
            location: {
              latitude: pharmacy.location.latitude,
              longitude: pharmacy.location.longitude,
            },
          },
        }))
    );
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ message: "Error fetching medicines", error });
  }
};
