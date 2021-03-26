const mongoose = require("mongoose");

const details = mongoose.Schema({
  _id: new mongoose.Schema.Types.ObjectId(),
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true },
  mobile: { type: String, required: true },
  daysPassed: {type:Number}

});

module.exports = mongoose.model("Details", details);
