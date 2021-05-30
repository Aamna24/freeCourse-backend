const express = require("express");
const route = express.Router();
const mongoose = require("mongoose");
const multer = require("multer");
const Course = require("../models/courses");
var fs = require('fs');
var path = require('path');
var cloudinary = require('cloudinary').v2;


cloudinary.config({ 
    cloud_name: 'dexn8tnt9', 
    api_key: '828443825275634', 
    api_secret: 'oYWmlitChe7pZ7K9PatCNZaXfMk' 
  });

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + file.originalname);
  }
});

const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === "image/jpeg" ||
    file.mimetype === "image/JPG" ||
    file.mimetype === "image/png"
  ) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

const upload = multer({ storage: storage, fileFilter: fileFilter });

//Get all the user route
route.get("/", async (req, res) => {
    try {
      const courseData = await Course.find();
      if (courseData.length === 0) {
        res.status(200).send({
          success: true,
          data: courseData,
          message: "No Courses found"
        });
      } else {
        res.status(200).send({
          success: true,
          data: courseData
        });
      }
    } catch (err) {
      res.status(503).send({
        success: false,
        message: "Server error"
      });
    }
  });

  module.exports = route;

   //Register the user route
route.post("/registerCourse", upload.single('img'),  async (req, res) => {
  const { courseTitle, courseDescription, courseContent, courseBenefits,
  courseLength, awardingBody, courseLevel, funding, learningMethods } = req.body;
const path = req.file && req.file.path
console.log(req.file)
const uniqueFileName = courseTitle
try{
  const image = await cloudinary.uploader.upload(path, {
    public_id: `logos/${uniqueFileName}`,
    tags: "logos",
  })
  fs.unlinkSync(path);
  if(image){
    const newCourse = new Course({
      courseTitle,
      courseDescription,
      courseContent,
      courseBenefits,
      courseLength,
      awardingBody,
      courseLevel,
      funding,
      learningMethods,
      img: image && image.url,  
    });
    const response = await newCourse.save();
    if(response){
      res.status(201).json({
        success: true,
        data: response,
        message: "Course Successfully added",
    });
   }
   else{
    res.status(501).json({
      success: false,
      data: [],
      message: "Error while adding course",
    });
   }
}

}
catch (error) {
  res.status(501).json({
    success: false,
    data: [],
    message: error.message,
  });
}
})


 



module.exports = route;