const express = require("express");
const route = express.Router();
const mongoose = require("mongoose");
const Test = require("../models/form");
const moment = require('moment')
const asyncHandler = require('express-async-handler');
var cloudinary = require('cloudinary').v2;
const multer = require("multer");


cloudinary.config({ 
  cloud_name: 'dexn8tnt9', 
  api_key: '828443825275634', 
  api_secret: 'oYWmlitChe7pZ7K9PatCNZaXfMk' 
});
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, "./signs/");
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
  
  

route.post('/add',upload.single('signature'), asyncHandler(async (req,res)=>{
    const {detailsFormData, personalDetails, employmentDetails, qualificationDetails, oppDetails,
    declaration} = req.body
    var path = req.body.signature
     try{
        const image = await cloudinary.uploader.upload(path, {
            public_id: `signatures/${personalDetails.nationalInsNo}`,
            tags: "signatures",
          });
          if(image){
            const newUser = new Test({
                _id: new mongoose.Types.ObjectId(),
                detailsFormData, personalDetails, employmentDetails, qualificationDetails, oppDetails,
            declaration,
            signature: image&& image.url,
            date: moment().format('LL')
            
              });
              const response = await newUser.save();
              if (response) {
                res.status(201).json({
                  success: true,
                  data: response,
                  message: "Item Successfully created",
                });
              }
              else {
                res.status(501).json({
                  success: false,
                  data: [],
                  message: "Error while creating item",
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
     
   
}}
))

//Get all the forms route
route.get("/", async (req, res) => {
  try {
    const formData = await Test.find();
    if (formData.length === 0) {
      res.status(200).send({
        success: true,
        data: formData,
        message: "No Form registered"
      });
    } else {
      res.status(200).send({
        success: true,
        data: formData
      });
    }
  } catch (err) {
    res.status(503).send({
      success: false,
      message: "Server error"
    });
  }
});


// find by id
//Get all the forms route
route.get("/:id", async (req, res) => {
  const id=req.params.id
  try {
    const formData = await Test.findById({_id: id});
    if (formData.length === 0) {
      res.status(200).send({
        success: true,
        data: formData,
        message: "No Form registered"
      });
    } else {
      res.status(200).send({
        success: true,
        data: formData
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

