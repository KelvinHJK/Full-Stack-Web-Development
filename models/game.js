const mongoose = require("mongoose");

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
  image: {
    type: Buffer,
    required: true,
  },
  imageType: {
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
  if (this.image != null && this.imageType != null) {
    return (
      "data:" +
      this.imageType +
      ";charset=utf-8;base64," +
      this.image.toString("base64")
    );
  }
});

module.exports = mongoose.model("Game", gameSchema);
