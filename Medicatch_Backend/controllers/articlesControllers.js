const articleModel = require("../models/Articles");
exports.createArticle = async (req, res) => {
  try {
    const { title, content } = req.body;
    const article = new articleModel({ title, content });
    await article.save();
    res.status(201).json({ message: "Article created successfully", article });
  } catch (error) {
    res.status(500).json({ message: "Error creating article", error });
  }
};

exports.getAllArticles = async (req, res) => {
  try {
    const articles = await articleModel.find({});
    res.status(200).json(articles);
  } catch (error) {
    res.status(500).json({ message: "Error fetching articles", error });
  }
};

exports.getIndividualArticle = async (req, res) => {
  try {
    const { query } = req.query; // /api/articles/search?query=the
    const articles = await articleModel.find({
      $or: [
        { title: { $regex: query, $options: "i" } },
        { content: { $regex: query, $options: "i" } },
        { tags: { $regex: query, $options: "i" } },
      ],
    });
    if (articles.length > 0) {
      res.status(200).json(articles);
      return;
    } else {
      res.json({ message: "No matching article found." });
    }
  } catch (error) {
    res.status(500).json({ message: "Error searching articles", error });
  }
};

exports.updateAnArticle = async (req, res) => {
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
};

exports.deleteAnArticle = async (req, res) => {
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
}