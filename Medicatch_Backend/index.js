const express = require("express");
const mongoose = require("mongoose");
const userModel = require("./models/Users");
const articleModel = require("./models/Articles");
const pharmacyModel = require("./models/Pharmacy");
const feedbackModel = require("./models/Feedback");
const cors = require("cors");
const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
mongoose.connect("mongodb://localhost:27017/Medicatch");

// Users routes
// Register a user
app.post("/register", async (req, res) => {
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
});

// Login a user
app.post("/login", async (req, res) => {
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
});

// get all users
app.get("/users", async (req, res) => {
  try {
    let users = await userModel.find({});
    res.status(200).json({ message: "user fetched successfully", users });
  } catch (error) {
    res.status(500).json({ message: "Error fetching users", error });
  }
});

// Delete a user
app.delete("/users/:id", async (req, res) => {
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
});

// Articles routes:
// Create an article
app.post("/api/articles", async (req, res) => {
  try {
    const { title, content } = req.body;
    const article = new articleModel({ title, content });
    await article.save();
    res.status(201).json({ message: "Article created successfully", article });
  } catch (error) {
    res.status(500).json({ message: "Error creating article", error });
  }
});

app.get("/api/articles", async (req, res) => {
  try {
    const articles = await articleModel.find({});
    res.status(200).json(articles);
  } catch (error) {
    res.status(500).json({ message: "Error fetching articles", error });
  }
});

// Search for article:
app.get("/api/articles/search", async (req, res) => {
  try {
    const { query } = req.query; // /api/articles/search?query=the
    const articles = await articleModel.find({
      $or: [
        { title: { $regex: query, $options: "i" } },
        { content: { $regex: query, $options: "i" } },
        { tags: { $regex: query, $options: "i" } },
      ],
    });
    res.status(200).json(articles);
  } catch (error) {
    res.status(500).json({ message: "Error searching articles", error });
  }
});

// Update an article
app.put("/api/articles/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { title, content } = req.body;

    const article = await articleModel.findByIdAndUpdate(
      id,
      { title, content, updatedAt: Date.now() },
      { new: true }
    );

    if (!article) {
      return res.status(404).json({ message: "Article not found" });
    }

    res.status(200).json({ message: "Article updated successfully", article });
  } catch (error) {
    res.status(500).json({ message: "Error updating article", error });
  }
});
// Delete an article
app.delete("/api/articles/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const article = await articleModel.findByIdAndDelete(id);

    if (!article) {
      return res.status(404).json({ message: "Article not found" });
    }

    res.status(200).json({ message: "Article deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting article", error });
  }
});
// Feedback
app.post("/api/articles/:id/feedback", async (req, res) => {
  try {
    const { id } = req.params; // Article ID
    const { userId, feedback } = req.body;

    const article = await articleModel.findById(id);
    if (!article) {
      return res.status(404).json({ message: "Article not found" });
    }

    const newFeedback = new feedbackModel({ articleId: id, userId, feedback });
    await newFeedback.save();

    res
      .status(201)
      .json({ message: "Feedback added successfully", feedback: newFeedback });
  } catch (error) {
    res.status(500).json({ message: "Error adding feedback", error });
  }
});
// Get feedback based on article id
app.get("/api/articles/:id/feedback", async (req, res) => {
  try {
    const { id } = req.params;

    const feedbacks = await feedbackModel
      .find({ articleId: id })
      .populate("userId", "username");
    res.status(200).json(feedbacks);
  } catch (error) {
    res.status(500).json({ message: "Error fetching feedback", error });
  }
});

// Pharmacy
app.post("/pharmacies", async (req, res) => {
  const { name, password, location, createdBy } = req.body;
  if (!name || !password || !location || !createdBy) {
    return res.status(400).json({
      message: "Name, password, location, and createdBy are required.",
    });
  }

  try {
    const pharmacy = await pharmacyModel.create({
      name,
      password,
      location,
      createdBy,
    });

    res
      .status(201)
      .json({ message: "Pharmacy created successfully", pharmacy });
  } catch (error) {
    res.status(500).json({ message: "Error creating pharmacy", error });
  }
});

// Get user's pharmacy
app.get("/pharmacies", async (req, res) => {
  const userId = req.body.userId;

  try {
    const pharmacy = await pharmacyModel.findOne({ createdBy: userId });

    if (!pharmacy) {
      return res.status(404).json({ message: "Pharmacy not found" });
    }

    res
      .status(200)
      .json({ message: "Pharmacies fetched successfully", pharmacy });
  } catch (error) {
    res.status(500).json({ message: "Error fetching pharmacy", error });
  }
});
// Update pharmacy
app.put("/pharmacies/:id", async (req, res) => {
  const { id } = req.params; // Pharmacy id
  const { stock, location } = req.body;
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

    await pharmacy.save();
    res
      .status(200)
      .json({ message: "Pharmacy updated successfully", pharmacy });
  } catch (error) {
    res.status(500).json({ message: "Error updating pharmacy", error });
  }
});

// Delete pharmacy
app.delete("/pharmacies/:id", async (req, res) => {
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
});

// Add stock to pharmacy
app.put("/pharmacies/:id/stock", async (req, res) => {
  const { id } = req.params;
  const { medicineName, quantity } = req.body;
  const userId = req.body.userId;

  if (!medicineName || !quantity) {
    return res
      .status(400)
      .json({ message: "Medicine name and quantity are required." });
  }

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

    const stockIndex = pharmacy.stock.findIndex(
      (item) => item.medicineName === medicineName
    );

    if (stockIndex >= 0) {
      pharmacy.stock[stockIndex].quantity = quantity;
    } else {
      pharmacy.stock.push({ medicineName, quantity });
    }
    await pharmacy.save();
    res.status(200).json({ message: "Stock updated successfully", pharmacy });
  } catch (error) {
    res.status(500).json({ message: "Error updating stock", error });
  }
});

app.listen(3000, () => console.log("Application is running at localhost 3000"));
