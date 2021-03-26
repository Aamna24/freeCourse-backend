const express = require("express");
const route = express.Router();
const mongoose = require("mongoose");
const User = require("../models/users");
const jwt = require("jsonwebtoken");
const Details = require("../models/details")
var nodemailer = require("nodemailer")

//Get all the user route
route.get("/", async (req, res) => {
  try {
    const userData = await User.find();
    if (userData.length === 0) {
      res.status(200).send({
        success: true,
        data: userData,
        message: "No User registered"
      });
    } else {
      res.status(200).send({
        success: true,
        data: userData
      });
    }
  } catch (err) {
    res.status(503).send({
      success: false,
      message: "Server error"
    });
  }
});

//Login user route
route.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const getUser = await User.find({
      email,
      password
    });


    if (getUser.length > 0) {
      let token = jwt.sign({ id: getUser[0]._id, name: getUser[0].name }, "secret_key");
      res
        .header("auth-token", token)
        .status(200)
        .send({
          data: getUser,
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
      message: "Server error"
    });
  }
});

//Register the user route
route.post("/register", async (req, res) => {
  const { name, email, password } = req.body;

  const newUser = new User({
    _id: new mongoose.Types.ObjectId(),
    name,
    email,
    password,

  });

  newUser
    .save()
    .then(response => {
      res.status(200).send({
        success: true,
        message: "Successfully Registered",
        data: response
      });
    })
    .catch(err => {
      res.status(400).send({
        success: false,
        message: "User already registered",
        Error: err
      });
    });
});

//Register the user detail route
route.post("/registerDetails", async (req, res) => {
  const { firstName, lastName, email, mobile } = req.body;

  const newDetail = new Details({
    _id: new mongoose.Types.ObjectId(),
    firstName,
    lastName,
    email,
    mobile,
    daysPassed: 0

  });

  newDetail
    .save()
    .then(response => {
      res.status(200).send({
        success: true,
        message: "Successfully Registered",
        data: response
      });
      var transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: 'fa17-bcs-081@cuilahore.edu.pk',
          pass: 'FA17-BCS-081'
        }
      });
      let mailOption={
        from: 'fa17-bcs-081@cuilahore.edu.pk',
        to: email,
        subject: 'Your Free Course',
        
      html: `<p>Hi  ${firstName},</p>
      <p>Congratulations on qualifying for a government funded (free) online course.</p>
      <p>You’re almost there….</p>
      <p>Use the below link to complete your application, it takes less than 20 minutes.</p>
      <a href="#">www.myfreecourse.co.uk</a>
      <p>What you’ll need to complete the application form - </p>
      <ul><li>Your personal details</li>
      <li>Proof of UK status to access funding (National insurance Number)</li>
      <li>Employment details (if applicable)</li>
      </ul>
      <p>Many thanks,</p><p>My Free Course Team</p>`
      
      
      }
      //send email
      transporter.sendMail(mailOption,function(err,res){
      if(err){
        console.log("error ",err)
      }
      else{
        console.log("File sent")
      }
      })
    })
    .catch(err => {
      res.status(400).send({
        success: false,
        message: "User already registered",
        Error: err
      });
    });
});



module.exports = route;