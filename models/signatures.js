const mongoose = require("mongoose");

const signatures = mongoose.Schema({
  _id: new mongoose.Schema.Types.ObjectId(),
 nationalInsNo:{type:String, required:true},
 
  img:
  {
    type: String
  }

 
});

module.exports = mongoose.model("signatures", signatures);