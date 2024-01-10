const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const Game = require("../models/game");
const uploadPath = path.join("public", Game.imageBasePath);
const imageMimeType = ["image/jpeg", "image/png", "image/gif"];
const Author = require("../models/author");
const upload = multer({
  dest: uploadPath,
  fileFilter: (req, file, callback) => {
    callback(null, imageMimeType.includes(file.mimetype));
  },
});

// All Games Route
router.get("/", async (req, res) => {
  let query = Game.find();
  if (req.query.title != null && req.query.title != "") {
    query = query.regex("title", new RegExp(req.query.title, "i"));
  }
  if (req.query.releasedBefore != null && req.query.releasedBefore != "") {
    query = query.lte("releaseDate", req.query.releasedBefore);
  }
  if (req.query.releasedAfter != null && req.query.releasedAfter != "") {
    query = query.gte("releaseDate", req.query.releasedAfter);
  }

  try {
    const games = await query.find({});
    res.render("games/index", {
      games: games,
      searchOptions: req.query,
    });
  } catch {
    res.redirect("/");
  }
});

// New Game Route
router.get("/new", async (req, res) => {
  renderNewPage(res, new Game());
});

// Create Game Route
router.post("/", upload.single("image"), async (req, res) => {
  const fileName = req.file != null ? req.file.filename : null;
  const game = new Game({
    title: req.body.title,
    author: req.body.author,
    releaseDate: new Date(req.body.releaseDate),
    price: req.body.price,
    imageName: fileName,
    description: req.body.description,
  });

  try {
    const newGame = await game.save();
    // res.redirect(`games/${newGame.id}`);
    res.redirect(`games`);
  } catch {
    if (game.imageName != null) {
      removeGameCover(game.imageName);
    }
    renderNewPage(res, game, true);
  }
});

function removeGameCover(fileName) {
  fs.unlink(path.join(uploadPath, fileName), (err) => {
    if (err) console.error(err);
  });
}

async function renderNewPage(res, game, hasError = false) {
  try {
    const authors = await Author.find({});
    const params = {
      authors: authors,
      game: game,
    };
    if (hasError) params.errorMessage = "Error creating Game";
    res.render("games/new", params);
  } catch {
    res.redirect("/games");
  }
}

module.exports = router;
