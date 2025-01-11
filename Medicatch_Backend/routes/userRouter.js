const express = require("express");
const {
  registerUser,
  loginUser,
  getAllUsers,
  deleteAUser,
} = require("../controllers/usersControllers");
const userRouter = express.Router();
userRouter.post("/register", registerUser);
userRouter.post("/login", loginUser);
userRouter.get("/", getAllUsers);
userRouter.delete("/:id", deleteAUser);
module.exports = userRouter;