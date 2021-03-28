const mongoose = require("mongoose");

const signatures = mongoose.Schema({
  nationalInsNo: { type: String, required: true },

  img: {
    type: String,
  },
});

module.exports = mongoose.model("signatures", signatures);
