const express = require("express");
const {
  createPharmacy,
  getUsersPharmacy,
  updatePharmacy,
  deletePharmacy,
  addStock,
} = require("../controllers/pharmacyControllers");
const pharmacyRouter = express.Router();
pharmacyRouter.post("/", createPharmacy);
pharmacyRouter.get("/", getUsersPharmacy);
pharmacyRouter.put("/:id", updatePharmacy);
pharmacyRouter.delete("/:id", deletePharmacy);
pharmacyRouter.put("/:id/stock", addStock);
module.exports = pharmacyRouter;
