const express = require("express");
const {
  createFeedback,
  getFeedback,
} = require("../controllers/feedbackControllers");
const feedbackRouter = express.Router();
feedbackRouter.post("/:id", createFeedback);
feedbackRouter.get("/:id", getFeedback);
module.exports = feedbackRouter;
