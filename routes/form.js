const express = require("express");
const route = express.Router();
const mongoose = require("mongoose");
const moment = require('moment')
var fs = require('fs');
var path = require('path');
const fetch = require("node-fetch");
var nodemailer = require("nodemailer")
const { PDFDocument } = require('pdf-lib');
var cloudinary = require('cloudinary').v2;
const multer = require("multer");
const asyncHandler = require('express-async-handler');


const Details = require("../models/details")
const Form = require("../models/form");
var ID = require("../models/idCard")

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

// add form
route.post('/add',upload.single('signature'), asyncHandler(async (req,res)=>{
  const {detailsFormData, personalDetails,emergencyDetails, employmentDetails, qualificationDetails, oppDetails,
  declaration} = req.body
  var path = req.body.signature
   try{
      const image = await cloudinary.uploader.upload(path, {
          public_id: `signatures/${personalDetails.nationalInsNo}`,
          tags: "signatures",
        });
        if(image){
          const newUser = new Form({
              detailsFormData, personalDetails,emergencyDetails, employmentDetails, qualificationDetails, oppDetails,
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



// incomplete forms
route.get("/incompleteForms", async(req,res)=>{
 try{ const Forms = await Form.find();
  const Detail = await Details.find()
  
  //compare form and detail tables and delete the detailsrec against submitted form
 
for(i=0;i<Forms.length;i++){
    
      Details.deleteOne({ email: Forms[i].personalDetails.email }).then(function(){ 
        console.log("Data deleted"); // Success 
    }).catch(function(error){ 
        console.log(error); // Failure 
    }); 
}

if (Detail.length === 0) {
  res.status(200).send({
    success: true,
    data: Detail,
    message: "No Forms found"
  });
} else {
  res.status(200).send({
    success: true,
    data: Detail
  });
}


  }
catch(err){
  res.status(503).send({
    success: false,
    message: "Server error"
  });
}

})

route.get('/getCollegeData', async (req,res)=>{
  const College = await Form.find({city: "Lahore"})
  console.log(College.length)
})

// get cities name

route.get("/getCitiesName", async (req,res)=>{
  const AllForms = await Form.find()
  const cities=[];
  
  for(i=0;i<AllForms.length;i++){
    if(!cities.includes(AllForms[i].city)){
    cities.push(AllForms[i].city)}
  }

  if (cities.length === 0) {
    res.status(200).send({
      success: true,
      data: cities,
      message: "No Cities found"
    });
  } else {
    res.status(200).send({
      success: true,
      data: cities
    });
  }
})

route.post('/ids', upload.array('idPic'), async(req,res)=>{
  const {nationalInsNo} = req.body
  const urls=[]
  const files= req.files
  let image=''
  if(req.method==='POST'){
    try {
      for (const filename of files) {
        const { path } = filename;
        var uniqueFileName = `${nationalInsNo}_${filename.originalname}`;
        image = await cloudinary.uploader.upload(path, {
          public_id: `id/${uniqueFileName}`,
          tags: "id",
        });
        urls.push(image)
        const newID = new ID({
          nationalInsNo,
          idPic: image && image.url,
         
        });
         await newID.save();
        fs.unlinkSync(path)
      }
    } catch (error) {
      console.log(error)
    }
    res.status(200).json({
      message: 'images uploaded successfully',
      data: urls
    })

  }
  else{
    res.status(405).json({
      err: `${req.method} method not allowed`
    })
  }
})
//Get all the forms route
route.get("/", async (req, res) => {
  try {
    const formData = await Form.find();
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

//Get all the forms route
route.get("/:id", async (req, res) => {
  const id=req.params.id
  try {
    const formData = await Form.findById({_id: id});
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

// send email from students list page
route.post('/email', async(req,res)=>{
  const {email, subject, message}= req.body;
   
try{
  var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'fakereview444@gmail.com',
      pass: 'Pakistan1947'
    }
  });
  let mailOption={
    from: 'fakereview444@gmail.com',
    to: email,
    subject: subject,
    
  html: `${message}`
  
  
  }
  //send email
  transporter.sendMail(mailOption,function(err,res){
  if(err){
    console.log("error ",err)
  }
  else{
    console.log("email sent")
  }
})
res.status(200).send("email sent")
}
catch(err){
  res.status(400).send("Email Error")
}
})


route.post('/upload-array', upload.array('image') ,async(req,res)=>{
 
  const uploader = async (path) => await cloudinary.uploader.upload(path, {
    public_id: `newFile`,
    tags: "signatures",
  });
  if (req.method === 'POST') {
    const urls = []
    const files = req.files;
    try {
      for (const filename of files) {
        const { path } = filename;
        const newPath = await uploader(path)

        urls.push(newPath)
        fs.unlinkSync(path)
      }
    } catch (error) {
      console.log(error)
    }

    res.status(200).json({
      message: 'images uploaded successfully',
      data: urls
    })

  } else {
    res.status(405).json({
      err: `${req.method} method not allowed`
    })
  }
})


// update form data
route.patch("/updateform/:id",async(req,res)=>{
  const {id} = req.params
  
  var update = req.body;
  try {
    const result = await Form.updateOne({
      _id: id
    }, {$set:update})
    if (result.length === 0) {
      res.status(200).send({
        success: true,
        data: result,
        message: "No Form Updated"
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


module.exports = route;
