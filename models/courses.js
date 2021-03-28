const mongoose = require("mongoose");

const course = mongoose.Schema({
  courseTitle: { type: String, required: true },
  courseDescription: { type: String, required: true },
  courseContent: { type: String, required: true },
  courseBenefits: { type: String, required: true },
  courseLength: { type: String, required: true },
  awardingBody: { type: String, required: true },
  courseLevel: { type: String, required: true },
  funding: { type: String, required: true },
  learningMethods: { type: String, required: true },
  img: {
    type: String,
  },
});

module.exports = mongoose.model("Course", course);
