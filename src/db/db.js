const mongoose = require("mongoose");

mongoose.connect("mongodb://localhost:27017/myuser", {
  useNewUrlParser: true,
  useCreateIndex: true
});


