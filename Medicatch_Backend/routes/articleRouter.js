const express = require("express");
const {
  createArticle,
  getAllArticles,
  getIndividualArticle,
  updateAnArticle,
  deleteAnArticle,
} = require("../controllers/articlesControllers");
const { verifyToken, allowRole } = require("../middleware/auth");
const upload = require("../config/multerConfig");
const articleRouter = express.Router();
articleRouter.post(
  "/",
  upload.single("image"),
  // verifyToken,
  // allowRole(["admin"]),
  createArticle
);
articleRouter.get("/", getAllArticles);
articleRouter.get("/search", getIndividualArticle);
articleRouter.put(
  "/:id",
  // verifyToken,
  //  allowRole(["admin"]),
  updateAnArticle
);
articleRouter.delete(
  "/:id",
  // verifyToken,
  // allowRole(["admin"]),
  deleteAnArticle
);
module.exports = articleRouter;
