const mongoose = require("mongoose");

const fixtureSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  match: String,
  FT: Boolean,
  link: String
});

const Fixture = mongoose.model("Fixture ", fixtureSchema);
module.exports = Fixture;
