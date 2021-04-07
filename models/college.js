const mongoose = require("mongoose");

const college = mongoose.Schema({
 
  collegeName: { type: String, required: true },
  contractAmount: { type: Number, required: true },
  pricePerApp:{type:Number, required: true},
  contractValue:{type:Number, required:true},
  formsDelievered:{type:Number, },
  remainingForms:{type:Number, required: true},
  revenue:{type:Number, required: true},
  
 
});

module.exports = mongoose.model("college", college);