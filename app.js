const express = require("express");
const app = express();
const mongoose = require("mongoose");
const morgan = require("morgan");
const config = require("config");
const cors = require("cors");
const Admin = require("./routes/admin");
const Course = require("./routes/courses");
const Form = require("./routes/form");
const User=require("./routes/users")
const Index=require("./routes/index")
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

const cron = require('node-cron');
var nodemailer = require("nodemailer")
const Details = require("./models/details")
const Forms = require("./models/forms");
const schedule = require('node-schedule');
const { PDFDocument } = require('pdf-lib');

const port = 61500;
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

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

// schedule a job to increment no of days passed
const job = schedule.scheduleJob('00 12 * * *', async function(){

  // compare emails and delete the matched ones
  const Forms = await Forms.find();
  const Detail = await Details.find()
 
for(i=0;i<Forms.length;i++){
 
    
      Details.deleteOne({ email: Forms[i].email }).then(function(){ 
        console.log("Data deleted"); // Success 
    }).catch(function(error){ 
        console.log(error); // Failure 
    }); 
}
  
// increment no of days passed 
  for (i=0;i<Detail.length;i++){
    Detail[i].daysPassed = Detail[i].daysPassed + 1;
    Detail[i].save()
   
  }
  // create transporter
  var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'fa17-bcs-081@cuilahore.edu.pk',
      pass: 'FA17-BCS-081'
    }
  });
  

  for(i=0;i<Detail.length;i++){
    // if days passed == 1
    if(Detail[i].daysPassed==1){
      let mailOption={
        from: 'fa17-bcs-081@cuilahore.edu.pk',
        to: Detail[i].email,
        subject: 'Urgent Action Needed',
        
      html: `<p>Hi  ${Detail[i].firstName},</p>
      <p>You have started your application form but haven’t completed it</p>
      <p>Don’t miss out on your FREE online course available with a nationally recognised qualification, complete your course enrolment form today.</p>
      <p>The application form form takes less than 20 minutes and you could have a nationally recognised qualification in 4-12 weeks.</p>
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
    }

    // if days passed == 2
    if(Detail[i].daysPassed==2){
      let mailOption={
        from: 'fa17-bcs-081@cuilahore.edu.pk',
        to: Detail[i].email,
        subject: 'Urgent Action Needed',
        
      html: `<p>Hi  ${Detail[i].firstName},</p>
      <p>Not enough people in the UK are aware that government funded (free) online training opportunities exist.</p>
      <p>That's where we can help.</p>
      <p>Our aim is to help as many people train via these courses. So we partner with colleges and universities across the UK to get you access to these FREE courses.</p>
      <p>These courses can help you upskill, develop and gain a nationally recognised qualification.</p>
        <p>Start your course and you could have a nationally recognised qualification in 4-12 weeks.</p>
        <p>The application form form takes less than 20 minutes and you could have a nationally recognised qualification in 4-12 weeks.</p>
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
    }
    
    // if days passed == 4
    if(Detail[i].daysPassed==4){
      let mailOption={
        from: 'fa17-bcs-081@cuilahore.edu.pk',
        to: Detail[i].email,
        subject: 'Do not miss out',
        
      html: `<p>Hi  ${Detail[i].firstName},</p>
      <p>You have started your application form but haven’t completed it.</p>
      <p>Spaces for your chosen course are running out so don’t miss out on your fully funded online training.</p>
      <p>The application form form takes less than 20 minutes and you could have a nationally recognised qualification in 4-12 weeks.</p>
      <p>These courses can help you upskill, develop and gain a nationally recognised qualification.</p>
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
    }

       // if days passed == 7
       if(Detail[i].daysPassed==7){
        let mailOption={
          from: 'fa17-bcs-081@cuilahore.edu.pk',
          to: Detail[i].email,
          subject: 'Time is running out',
          
        html: `<p>Hi  ${Detail[i].firstName},</p>
        <p>You have started your application form but haven’t completed it. So you don’t miss out on your chosen fully funded online course, please complete your application. </p>
        <p>If you are having any trouble, do let us know if you need any help with the application</p>
        
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
      }
  }
});

//---------------------

cron.schedule('00 00 * * *', async function() {
  try {
    const formData = await Forms.find();
    for(i=0;i<formData.length;i++){
      const id= formData[i]._id
      const findform = await Forms.findById(id);
      const pathToPDF = path.resolve(__dirname,`./files/${findform.nationalInsNo}.pdf`);
  if(fs.existsSync(pathToPDF)){
    pathToImage = `https://res.cloudinary.com/dexn8tnt9/image/upload/v1614679360/signatures/${findform.nationalInsNo}.png`
  
  
  const outputPath = path.resolve(__dirname,`./files/${findform.nationalInsNo}.pdf`);

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
  else{
    const pathToPDF = path.resolve(__dirname,`./files/${findform.nationalInsNo}une.pdf`);
    pathToImage = `https://res.cloudinary.com/dexn8tnt9/image/upload/v1614679360/signatures/${findform.nationalInsNo}.png`
  
  
  const outputPath = path.resolve(__dirname,`./files/${findform.nationalInsNo}une.pdf`);

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
      to: 'johno.cosulting@gmail.com',
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
    
  }
})
//-----------------------

mongoose
  .connect("mongodb+srv://johnoconsulting:Newcastle9@cluster0.btsxm.mongodb.net/freeCourse?retryWrites=true&w=majority",{
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(success => console.log("Successfully connected to database"))
  .catch(err => console.log("Error while connecting to database"));

app.listen(port, () => console.log(`App listening on port : ${port}`));
