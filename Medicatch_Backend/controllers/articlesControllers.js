const articleModel = require("../models/Articles");
// const upload = require("../config/multerConfig");
exports.createArticle = async (req, res) => {
  // if (req.user.role !== "admin") {
  //   return res.status(403).json({ message: "Access denied. Admins only." });
  // }
  try {
    const { title, content } = req.body;
    const article = new articleModel({
      title,
      content,
      image: req.file ? req.file.path : "uploads\\noimg.jpeg",
    });
    await article.save();
    res.status(201).json({ message: "Article created successfully", article });
  } catch (error) {
    res.status(500).json({ message: "Error creating article", error });
  }
};

exports.getAllArticles = async (req, res) => {
  try {
    const articles = await articleModel.find({});
    return res.status(200).json(articles);
  } catch (error) {
    return res.status(500).json({ message: "Error fetching articles", error });
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
  // if (req.user.role !== "admin") {
  //   return res.status(403).json({ message: "Access denied. Admins only." });
  // }
  try {
    const { id } = req.params;
    const { title, content } = req.body;
    let image = req.file ? req.file.path : null;
    if (!req.file) {
      // Retrieve the existing article to get the current image path
      const existingArticle = await articleModel.findById(id);
      if (existingArticle) {
        image = existingArticle.image; // Use the existing image path
      }
    }
    const article = await articleModel.findByIdAndUpdate(
      id,
      {
        title,
        content,
        image,
        updatedAt: Date.now(),
      },
      { new: true }
    );

    if (!article) {
      return res.status(404).json({ message: "Article not found" });
    }
    return res
      .status(200)
      .json({ message: "Article updated successfully", article });
  } catch (error) {
    res.status(500).json({ message: "Error updating article", error });
  }
};

exports.deleteAnArticle = async (req, res) => {
  // if (req.user.role !== "admin") {
  //   return res.status(403).json({ message: "Access denied. Admins only." });
  // }

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
};
