const express = require("express");
const {
  createArticle,
  getAllArticles,
  getIndividualArticle,
  updateAnArticle,
  deleteAnArticle,
} = require("../controllers/articlesControllers");
const articleRouter = express.Router();
articleRouter.post("/", createArticle);
articleRouter.get("/", getAllArticles);
articleRouter.get("/search", getIndividualArticle);
articleRouter.put("/:id", updateAnArticle);
articleRouter.delete("/:id", deleteAnArticle);
module.exports = articleRouter;
