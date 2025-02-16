const userModel = require("../models/Users");
const bcrypt = require("bcrypt");
const saltRounds = 10;
const jwt = require("jsonwebtoken");
exports.registerUser = async (req, res) => {
  const { username, password, role } = req.body;
  if (!username || !password) {
    return res
      .status(400)
      .json({ message: "Username, password and role are required." });
  }

  try {
    // Check if the username already exists
    const existingUser = await userModel.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ message: "Username already exists." });
    }
    let newUser;
    bcrypt.genSalt(saltRounds, function (err, salt) {
      bcrypt.hash(password, salt, async function (err, hash) {
        newUser = await userModel.create({
          username,
          password: hash,
          role: role || "user",
        });
      });
    });

    res
      .status(201)
      .json({ message: "User registered successfully", user: newUser });
  } catch (error) {
    res.status(500).json({ message: "Error registering user", error });
  }
};

exports.loginUser = async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res
      .status(400)
      .json({ message: "Username and password are required." });
  }

  try {
    const user = await userModel.findOne({ username });
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    bcrypt.compare(password, user.password, (err, isMatch) => {
      if (err) console.log("Error comparing password: ", err);
      else if (isMatch) {
        const token = jwt.sign(
          { id: user._id, role: user.role },
          "PakistanZindabad", //secret key
          { expiresIn: "1h" }
        );
        return res.status(200).json({
          message: "Login successful",
          token,
          username,
          role: user.role,
        });
      } else {
        return res.status(401).json({ message: "Invalid credentials" });
      }
    });
  } catch (error) {
    res.status(500).json({ message: "Error during login", error });
  }
};

exports.getAllUsers = async (req, res) => {
  try {
    let users = await userModel.find({});
    res.status(200).json({ message: "user fetched successfully", users });
  } catch (error) {
    res.status(500).json({ message: "Error fetching users", error });
  }
};

exports.deleteAUser = async (req, res) => {
  const { id } = req.params;

  try {
    const deletedUser = await userModel.findByIdAndDelete(id);
    if (!deletedUser) {
      return res.status(404).json({ message: "User not found." });
    }
    res.status(200).json({ message: "User deleted successfully", deletedUser });
  } catch (error) {
    res.status(500).json({ message: "Error deleting user", error });
  }
};
exports.updateExpoPushToken = async (req, res) => {
  const { expoPushToken, userId } = req.body;
  console.log("expoPushToken: ", expoPushToken);
  console.log("userId: ", userId);
  if (!expoPushToken) {
    return res.status(400).json({ message: "Expo push token is required." });
  }
  try {
    const user = await userModel.findByIdAndUpdate(
      userId,
      { expoPushToken },
      { new: true }
    );
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }
    res.status(200).json({
      message: "Push token updated successfully.",
      user,
    });
  } catch (error) {
    res.status(500).json({ message: "Error updating push token", error });
  }
};
