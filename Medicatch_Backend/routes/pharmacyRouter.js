const express = require("express");
const {
  createPharmacy,
  getUsersPharmacy,
  updatePharmacy,
  deletePharmacy,
  addStock,
  getMedicine,
} = require("../controllers/pharmacyControllers");
const csvUpload = require("../config/csvUploadConfig");
const { verifyToken, allowRole } = require("../middleware/auth");
const pharmacyRouter = express.Router();
pharmacyRouter.post("/", createPharmacy);
pharmacyRouter.get("/:id", getUsersPharmacy);
pharmacyRouter.post("/searchMedicine", getMedicine);
// pharmacyRouter.get("/", verifyToken, allowRole(["pharmacy"]), getUsersPharmacy);
pharmacyRouter.put(
  "/:id",
  // verifyToken,
  // allowRole(["pharmacy"]),
  updatePharmacy
);
pharmacyRouter.delete(
  "/:id",
  // verifyToken,
  // allowRole(["pharmacy"]),
  deletePharmacy
);
pharmacyRouter.put(
  "/:id/stock",
  // verifyToken,
  // allowRole(["pharmacy"]),
  csvUpload,
  addStock
);
module.exports = pharmacyRouter;
