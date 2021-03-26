const mongoose = require("mongoose");

const user = mongoose.Schema({
  _id: new mongoose.Schema.Types.ObjectId(),
  name: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
 
});

module.exports = mongoose.model("Users", user);
