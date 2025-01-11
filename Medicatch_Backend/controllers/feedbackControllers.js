const articleModel = require("../models/Articles");
const feedbackModel = require("../models/Feedback");

exports.createFeedback = async (req, res) => {
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
};

exports.getFeedback = async (req, res) => {
  try {
    const { id } = req.params;
    const feedbacks = await feedbackModel
      .find({ articleId: id })
      .populate("userId", "username");
    res.status(200).json(feedbacks);
  } catch (error) {
    res.status(500).json({ message: "Error fetching feedback", error });
  }
};
