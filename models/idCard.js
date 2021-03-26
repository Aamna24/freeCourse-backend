const mongoose = require("mongoose");

const idCard = mongoose.Schema({
  _id: new mongoose.Schema.Types.ObjectId(),
 nationalInsNo:{type:String, required:true},
 
  idPic:
  {
    type: String
  }

 
});

module.exports = mongoose.model("idCard", idCard);