const mongoose = require("mongoose");
const path = require("path");

const imageBasePath = "uploads/gameCovers";

const gameSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "Author",
  },
  releaseDate: {
    type: Date,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  imageName: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  createdAtDate: {
    type: Date,
    required: true,
    default: Date.now,
  },
});

gameSchema.virtual("imagePath").get(function () {
  if (this.imageName != null) {
    return path.join("/", imageBasePath, this.imageName);
  }
});

module.exports = mongoose.model("Game", gameSchema);
module.exports.imageBasePath = imageBasePath;
