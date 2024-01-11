const express = require("express");
const router = express.Router();
const Game = require("../models/game");
const imageMimeType = ["image/jpeg", "image/png", "image/gif"];
const Author = require("../models/author");

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
router.post("/", async (req, res) => {
  const game = new Game({
    title: req.body.title,
    author: req.body.author,
    releaseDate: new Date(req.body.releaseDate),
    price: req.body.price,
    description: req.body.description,
  });
  saveImage(game, req.body.image);

  try {
    const newGame = await game.save();
    // res.redirect(`games/${newGame.id}`);
    res.redirect(`games`);
  } catch {
    renderNewPage(res, game, true);
  }
});

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

function saveImage(game, imageEncoded) {
  if (imageEncoded == null) return;
  const image = JSON.parse(imageEncoded);
  if (image != null && imageMimeType.includes(image.type)) {
    game.image = new Buffer.from(image.data, "base64");
    game.imageType = image.type;
  }
}

module.exports = router;
