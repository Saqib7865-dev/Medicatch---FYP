const userModel = require("../models/Users");
exports.registerUser = async (req, res) => {
  const { username, password, role } = req.body;
  if (!username || !password) {
    return res
      .status(400)
      .json({ message: "Username and password are required." });
  }

  try {
    // Check if the username already exists
    const existingUser = await userModel.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ message: "Username already exists." });
    }

    const newUser = await userModel.create({
      username,
      password,
      role: role || "user",
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

    if (user.password != password) {
      return res.status(401).json({ message: "Invalid credentials." });
    } else {
      res.status(200).json({ message: "Login successful" });
    }
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
