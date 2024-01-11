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
    res.redirect(`games/${newGame.id}`);
  } catch {
    renderNewPage(res, game, true);
  }
});

// Show Game Route
router.get("/:id", async (req, res) => {
  try {
    const game = await Game.findById(req.params.id).populate("author").exec();
    res.render("games/show", { game: game });
  } catch {
    res.redirect("/");
  }
});

// Edit Game Route
router.get("/:id/edit", async (req, res) => {
  try {
    const game = await Game.findById(req.params.id);
    renderEditPage(res, game);
  } catch {
    res.redirect("/");
  }
});

// Update Game Route
router.put("/:id", async (req, res) => {
  let game;

  try {
    game = await Game.findById(req.params.id);
    game.title = req.body.title;
    game.author = req.body.author;
    game.releaseDate = new Date(req.body.releaseDate);
    game.price = req.body.price;
    game.description = req.body.description;
    if (req.body.image != null && req.body.image !== "") {
      saveImage(game, req.body.image);
    }
    await game.save();
    res.redirect(`/games/${game.id}`);
  } catch {
    if (game != null) {
      renderEditPage(res, game, true);
    } else {
      res.redirect("/");
    }
  }
});

// Delete Game Page
router.delete("/:id", async (req, res) => {
  let game;
  try {
    game = await Game.findById(req.params.id);
    await game.deleteOne();
    res.redirect("/games");
  } catch {
    if (game != null) {
      res.render("games/show", {
        game: game,
        errorMessage: "Could not remove game",
      });
    } else {
      res.redirect("/");
    }
  }
});

async function renderNewPage(res, game, hasError = false) {
  renderFormPage(res, game, "new", hasError);
}

async function renderEditPage(res, game, hasError = false) {
  renderFormPage(res, game, "edit", hasError);
}

async function renderFormPage(res, game, form, hasError = false) {
  try {
    const authors = await Author.find({});
    const params = {
      authors: authors,
      game: game,
    };
    if (hasError) {
      if (form === "edit") {
        params.errorMessage = "Error Updating Game";
      } else {
        params.errorMessage = "Error Creating Game";
      }
    }
    res.render(`games/${form}`, params);
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
