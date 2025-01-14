const express = require("express");
const {
  createPharmacy,
  getUsersPharmacy,
  updatePharmacy,
  deletePharmacy,
  addStock,
} = require("../controllers/pharmacyControllers");
const { verifyToken, allowRole } = require("../middleware/auth");
const pharmacyRouter = express.Router();
pharmacyRouter.post("/", createPharmacy);
pharmacyRouter.get("/", verifyToken, allowRole(["pharmacy"]), getUsersPharmacy);
pharmacyRouter.put(
  "/:id",
  verifyToken,
  allowRole(["pharmacy"]),
  updatePharmacy
);
pharmacyRouter.delete(
  "/:id",
  verifyToken,
  allowRole(["pharmacy"]),
  deletePharmacy
);
pharmacyRouter.put(
  "/:id/stock",
  verifyToken,
  allowRole(["pharmacy"]),
  addStock
);
module.exports = pharmacyRouter;
