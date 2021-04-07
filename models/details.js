const mongoose = require("mongoose");

const details = mongoose.Schema({

  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true , unique: false},
  mobile: { type: String, required: true },
  daysPassed: { type: Number },
  dateCreated:{type: String}

});

module.exports = mongoose.model("Details", details);
