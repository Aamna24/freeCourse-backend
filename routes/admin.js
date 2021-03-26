const express = require("express");
const route = express.Router();
const mongoose = require("mongoose");
const Admin = require("../models/admin");
const jwt = require("jsonwebtoken");

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

  
module.exports = route;