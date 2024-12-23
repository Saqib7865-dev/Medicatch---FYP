const express = require("express");
const mongoose = require("mongoose");
const userModel = require("./models/Users");
const cors = require("cors");
const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
mongoose.connect("mongodb://localhost:27017/Medicatch");
app.post("/user", async (req, res) => {
  const users = await userModel.create(req.body);
  if (users) {
    res.json(users);
    console.log(`User successfully created. ${users}`);
  }
});

app.get("/allUsers", async (req, res) => {
  let users = await userModel.find({});
  if (users) {
    console.log(`All users: ${users}`);
  }
});

app.delete("/deleteUser", async (req, res) => {
  let deletedUser = await userModel.deleteMany({});
  if (deletedUser) res.json(deletedUser);
});

app.listen(3000);
