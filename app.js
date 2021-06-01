const express = require("express");
const app = express();
var timeout = require('connect-timeout')
const mongoose = require("mongoose");
const morgan = require("morgan");
const config = require("config");
const cors = require("cors");
const Admin = require("./routes/admin");
const Course = require("./routes/courses");
const Form = require("./routes/form");
const Forms = require("./models/form");
const College = require("./models/college")
const User=require("./routes/users")

const Index=require("./routes/index")
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const cron = require('node-cron');
const { PDFDocument } = require('pdf-lib');
const dotenv = require('dotenv')
var nodemailer = require("nodemailer")
var fs = require('fs');
var fetch= require('node-fetch')
const connectDB = require('./config/db')

connectDB();
dotenv.config()

console.log('NODE_ENV: ' + config.util.getEnv('NODE_ENV'));




const port = process.env.PORT || 61500;
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(timeout('5s'))
app.use(morgan("tiny"));
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(logger('dev'));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


app.use("/",Index)
app.use("/admin", Admin);
app.use("/course", Course);
app.use("/form", Form);
app.use("/users",User)


app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, Content-Type, Accept, Authorization"
  );
  if (req.method === "OPTIONS") {
    res.header("Access-Control-Allow-Methods", "GET, POST, PUT, PATCH, DELETE");
    res.status(200).json({});
  }
  next();
});

// updating college revenue every minute
cron.schedule('* * * * *', async(req,res) => {
  try{
    const form = await Forms.find();
    const totalForm = form.length
    const college = await College.find();
  
    const id = college[0]._id
   
    const result = await College.updateOne({
      _id: id
    }, {$set:{
      formsDelievered: totalForm,
      remainingForms: college[0].contractAmount - totalForm,
      revenue: totalForm * college[0].pricePerApp
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
    
  
  }
  catch(err){

  }
});
//---------------------

cron.schedule('12 19 * * *', async(req,res)=> {
  console.log("running cron job")
 
  try {
    const formData = await Forms.find();
    for(i=0;i<formData.length;i++){
      const id= formData[i]._id
      const findform = await Forms.findById(id);
      const pathToPDF = path.resolve(__dirname,`./routes/files/${findform.nationalInsNo}.pdf`);
      console.log(pathToPDF)
  if(fs.existsSync(pathToPDF)){
    console.log("inside")
    pathToImage = `https://res.cloudinary.com/dexn8tnt9/image/upload/v1614679360/signatures/${findform.nationalInsNo}.png`
  
  
  const outputPath = path.resolve(__dirname,`./routes/files/${findform.nationalInsNo}.pdf`);

  const run = async ({ pathToPDF, pathToImage }) => {
    
    const pngImageBytes = await fetch(pathToImage).then((res) => res.arrayBuffer())
    const pdfDoc = await PDFDocument.load(fs.readFileSync(pathToPDF));
    const img = await pdfDoc.embedPng(pngImageBytes);
    
    const imagePage= await pdfDoc.getPage(0);

  
    imagePage.drawImage(img, {
      x: 105,
      y:70,
      width:30,
      height: 30,
    });
  
    const pdfBytes = await pdfDoc.save();
    fs.writeFileSync(outputPath, pdfBytes);

    var transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'fakereview444@gmail.com',
        pass: 'Pakistan1947'
      }
    });
    let mailOption={
      from: 'fakereview444@gmail.com',
      to: 'fakereview444@gmail.com',
      subject: 'form files',
      attachments: [
          {   filename:`${findform.nationalInsNo}.pdf` , path: outputPath}
      ]
  
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

    fs.readFile(outputPath,  (err,data) =>{
      if(err){
        res.statusCode = 500;
        res.end(err)
      }
      else{
        //res.setHeader("ContentType","application/pdf");
        //res.setHeader("Access-Control-Allow-Origin", "https://consulting-frontend.herokuapp.com");
       // res.end(data)
      }
      
    })
  }
  run({ pathToPDF, pathToImage }).catch(console.error);

  }
  else{
    const pathToPDF = path.resolve(__dirname,`./routes/files/${findform.nationalInsNo}une.pdf`);
    pathToImage = `https://res.cloudinary.com/dexn8tnt9/image/upload/v1614679360/signatures/${findform.nationalInsNo}.png`
  
  
  const outputPath = path.resolve(__dirname,`./routes/files/${findform.nationalInsNo}une.pdf`);

  const run = async ({ pathToPDF, pathToImage }) => {
    
    const pngImageBytes = await fetch(pathToImage).then((res) => res.arrayBuffer())
    const pdfDoc = await PDFDocument.load(fs.readFileSync(pathToPDF));
    const img = await pdfDoc.embedPng(pngImageBytes);
    
    const imagePage= await pdfDoc.getPage(0);
    const imagePage1= await pdfDoc.getPage(0);

  
    imagePage.drawImage(img, {
      x: 400,
      y:260,
      width:30,
      height: 30,
    });
    imagePage1.drawImage(img, {
      x: 650,
      y:78,
      width:30,
      height: 30,
    });
  
    const pdfBytes = await pdfDoc.save();
    fs.writeFileSync(outputPath, pdfBytes);
    
    var transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'fa17-bcs-081@cuilahore.edu.pk',
        pass: 'FA17-BCS-081'
      }
    });
    let mailOption={
      from: 'fa17-bcs-081@cuilahore.edu.pk',
      to: 'fa17-bcs-081@cuilahore.edu.pk',
      subject: 'form files',
      attachments: [
          {   filename:`${findform.nationalInsNo}.pdf` , path: outputPath}
      ]
  
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
    fs.readFile(outputPath,  (err,data) =>{
      if(err){
        res.statusCode = 500;
        res.end(err)
      }
      else{
      //res.setHeader("ContentType","application/pdf");
        //res.setHeader("Access-Control-Allow-Origin", "https://consulting-frontend.herokuapp.com");
        res.end(data)
      }
      
    })
  }
  run({ pathToPDF, pathToImage }).catch(console.error);
  }


    }
    
  } catch (error) {
    return res.end(error)
  }


  
})
//-----------------------
function haltOnTimedout (req, res, next) {
  if (!req.timedout) next()
}





app.listen(port, () => console.log(`App listening on port : ${port}`));
