const mongoose = require("mongoose");

const idCard = mongoose.Schema({
  nationalInsNo: { type: String, required: true },

  idPic: {
    type: String,
  },
});

module.exports = mongoose.model("idCard", idCard);
