const express = require("express");
const route = express.Router();
const mongoose = require("mongoose");
const Admin = require("../models/admin");
const jwt = require("jsonwebtoken");
const College = require("../models/college")
//Get all the user route
route.get("/", async (req, res) => {
    try {
      const adminData = await Admin.find();
      if (adminData.length === 0) {
        res.status(200).send({
          success: true,
          data: adminData,
          message: "No Admin registered"
        });
      } else {
        res.status(200).send({
          success: true,
          data: adminData
        });
      }
    } catch (err) {
      res.status(503).send({
        success: false,
        message: "Server error"
      });
    }
  });
  

//Register the user route
route.post("/register", async (req, res) => {
    const { name, email, password } = req.body;
  
    const newAdmin = new Admin({
      _id: new mongoose.Types.ObjectId(),
      name,
      email,
      password,
  
    });
  
    newAdmin
      .save()
      .then(response => {
        res.status(200).send({
          success: true,
          message: "Admin Successfully Registered",
          data: response
        });
      })
      .catch(err => {
        res.status(400).send({
          success: false,
          message: "Admin already registered",
          Error: err
        });
      });
  });


//Login user route
route.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const getAdmin = await Admin.find({
      email,
      password
    });


    if (getAdmin.length > 0) {
      let token = jwt.sign({ id: getAdmin[0]._id , name: getAdmin[0].name}, "secret_key");
      console.log("token is")
      res
        .header("auth-token", token)
        .status(200)
        .send({
          data: getAdmin,
          message: "Successfully login",
          token,
          
        });
    } else {
      console.log("else");
      res.status(404).send({
        success: false,
        message: "User not found!"
      });
    }
  } catch (err) {
    console.log("catch");
    res.status(503).send({
      success: false,
      message: err
    });
  }
});

// enter colllege data
route.post("/college",async(req,res)=>{
  const newCollege = new College({
    _id: new mongoose.Types.ObjectId(),
    collegeName:"Vision West Notthinghamshire College",
    contractAmount:0,
    pricePerApp:0,
    contractValue:0,
    formsDelievered:0,
    remainingForms:0,
    revenue:0
  });

  newCollege
    .save()
    .then(response => {
      res.status(200).send({
        success: true,
        message: "College Successfully Added",
        data: response
      });
    })
    .catch(err => {
      res.status(400).send({
        success: false,
        message: "College already registered",
        Error: err
      });
    });
})

// edit college info
route.patch("/college/:id",async(req,res)=>{
  var {contractAmount,pricePerApp} = req.body;
  const {id} = req.params
  try {
    const result = await College.updateOne({
      _id: id
    }, {$set:{
      contractAmount: contractAmount,
      pricePerApp: pricePerApp,
      contractValue: contractAmount * pricePerApp
    }
      })
    if (result.length === 0) {
      res.status(200).send({
        success: true,
        data: result,
        message: "No College data Updated"
      });
    } else {
      res.status(200).send({
        success: true,
        data: result
      });
    }
    
  } catch (error) {
    res.status(503).send({
      success: false,
      message: "Server error"
    });
  }

})


//get college data
route.get("/collegedata", async (req, res) => {
  try {
    const collegeData = await College.find();
    if (collegeData.length === 0) {
      res.status(200).send({
        success: true,
        data: collegeData,
        message: "No Admin registered"
      });
    } else {
      res.status(200).send({
        success: true,
        data: collegeData
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