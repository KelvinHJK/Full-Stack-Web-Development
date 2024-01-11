const mongoose = require("mongoose");
const Game = require("./game");

const authorSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
});

authorSchema.pre("deleteOne", function (next) {
  // this.model('Game').deleteMany({ author: this._id }, next);

  Game.find({ author: this.id }, (err, games) => {
    if (err) {
      next(err);
    } else if (games.length > 0) {
      next(new Error("This author has games still"));
    } else {
      next();
    }
  });
});

module.exports = mongoose.model("Author", authorSchema);
