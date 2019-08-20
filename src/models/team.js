const mongoose = require("mongoose");

const teamSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  name: String
});

const Team = mongoose.model("Team", teamSchema);
module.exports = Team;
