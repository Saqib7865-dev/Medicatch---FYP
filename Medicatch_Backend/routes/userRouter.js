const express = require("express");
const {
  registerUser,
  loginUser,
  getAllUsers,
  deleteAUser,
  updateExpoPushToken,
} = require("../controllers/usersControllers");
const userRouter = express.Router();
userRouter.post("/register", registerUser);
userRouter.post("/login", loginUser);
userRouter.get("/", getAllUsers);
userRouter.post("/updateToken", updateExpoPushToken);
userRouter.delete("/:id", deleteAUser);
module.exports = userRouter;
