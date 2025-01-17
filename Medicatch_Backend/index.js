const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const userRouter = require("./routes/userRouter");
const articleRouter = require("./routes/articleRouter");
const feedbackRouter = require("./routes/feedbackRouter");
const pharmacyRouter = require("./routes/pharmacyRouter");
const path = require("path");
const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
mongoose.connect("mongodb://localhost:27017/Medicatch");
// Users route
app.use("/users", userRouter);
// Article route
app.use("/articles", articleRouter);
// Feedback
app.use("/feedback", feedbackRouter);
// Pharmacy
app.use("/pharmacy", pharmacyRouter);

// In your main app.js or server.js file
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.listen(3001, () => console.log("Application is running at port: 3001"));
