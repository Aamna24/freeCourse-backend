const express = require("express");
const route = express.Router();
const mongoose = require("mongoose");
const Details = require("../models/details")
const Form = require("../models/forms");
const Sign=require("../models/signatures")
const moment = require('moment')
var ID = require("../models/idCard")
var fs = require('fs');
var path = require('path');
const fetch = require("node-fetch");
var nodemailer = require("nodemailer")
const { PDFDocument } = require('pdf-lib');
const { PDFNet } = require('@pdftron/pdfnet-node'); 
var cloudinary = require('cloudinary').v2;
const multer = require("multer");
var fs = require('fs');
var path = require('path');
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


//Register the user route
route.post("/submit",  async (req, res) => {
    const { appliedCourse,highestQualificationLevel, age19orOlder, residencyStatus,livingStatus,proof,title,firstName, lastName
, gender, dob,addLine1,
age,
city,
county,postcode,
yearsAtAdd,
telephone,
mobile,
email,
emergencyContactName,
emergencyTelephone,
nationality,
nationalInsNo,
employmentStatus,
hoursPerWeek,
employmentLength,
employerName,
employerAddress,
      employerPostcode,
      employersTelNo,
      unemployedLength,
      benefits,
      areYou,
      ethnicOrigin,
      firstLang,
      residentOfEngland,
      nonEEACitizen,
      householdSituation,
      criminalConvictions,
      qualification,
      mathsGrades,
      englishGrades,
      contactPref,
      contactMethodPref,
      marketingMethodPref,
      collegeName,
      wheelchair,
      disabilities,
      disabilitiesValues

} = req.body;

    const newForm = new Form({
      _id: new mongoose.Types.ObjectId(),
      appliedCourse,
      highestQualificationLevel,
      age19orOlder,
      residencyStatus,
      livingStatus,
      proof,
      title,
      firstName,
      lastName,
      gender,
      dob,
      addLine1,
      age,
      city,
      county,
      postcode,
      yearsAtAdd,
      telephone,
      mobile,
      email,
      emergencyContactName,
      emergencyTelephone,
      nationality,
      nationalInsNo,
      employmentStatus,
      hoursPerWeek,
      employmentLength,
      employerName,
      employerAddress,
      employerPostcode,
      employersTelNo,
      unemployedLength,
      benefits,
      areYou,
      ethnicOrigin,
      firstLang,
      residentOfEngland,
      nonEEACitizen,
      householdSituation,
      criminalConvictions,
      qualification,
      mathsGrades,
      englishGrades,
      contactPref,
      contactMethodPref,
      marketingMethodPref,
      date: moment().format('LL'),
      collegeName,
      wheelchair,
      disabilities,
      disabilitiesValues,
     

  
    });
    const response = await newForm.save();
   
    const findform = await Form.findById(response._id);
    const ins = findform.nationalInsNo;
    const checkedMark = "\u2714";
    
    const check=findform.employmentStatus
    if(check=="Employed but on less than £17,004 per year" || check=="Not in paid employment, looking for work"){
      const inputPath = path.resolve(__dirname,"./files/pdf2.pdf");
    const outputPath = path.resolve(__dirname,`./files/${ins}une.pdf`);
  
       const replaceText = async()=>{
        const pdfdoc = await PDFNet.PDFDoc.createFromFilePath(inputPath);
        await pdfdoc.initSecurityHandler();
        const replacer = await PDFNet.ContentReplacer.create()
        const page= await pdfdoc.getPage(1);
        
        if(findform.contactMethodPref[0]=="Phone"){
          await replacer.addString("o1","");
          await replacer.addString("o2","");
          await replacer.addString("o3","");
          await replacer.addString("o4",checkedMark);
          await replacer.addString("o5","");
        }
        else if(findform.contactMethodPref[0]=="Email"){
          await replacer.addString("o1","");
          await replacer.addString("o2","");
          await replacer.addString("o3","");
          await replacer.addString("o4","");
          await replacer.addString("o5",checkedMark);
        }
        else if(findform.contactMethodPref[0]=="Text"){
          await replacer.addString("o1","");
          await replacer.addString("o2","");
          await replacer.addString("o3",checkedMark);
          await replacer.addString("o4","");
          await replacer.addString("o5","");
        }
  
       else if(findform.contactMethodPref[1]=="Phone"){
          await replacer.addString("o1","");
          await replacer.addString("o2","");
          await replacer.addString("o3","");
          await replacer.addString("o4",checkedMark);
          await replacer.addString("o5","");
        }
        else if(findform.contactMethodPref[1]=="Email"){
          await replacer.addString("o1","");
          await replacer.addString("o2","");
          await replacer.addString("o3","");
          await replacer.addString("o4","");
          await replacer.addString("o5",checkedMark);
        }
        else if(findform.contactMethodPref[1]=="Text"){
          await replacer.addString("o1","");
          await replacer.addString("o2","");
          await replacer.addString("o3",checkedMark);
          await replacer.addString("o4","");
          await replacer.addString("o5","");
        }
       
  
        if(findform.benefits=="JSA"){
          await replacer.addString('x1',checkedMark);
          await replacer.addString('x2',"");
          await replacer.addString('x3',"");
          await replacer.addString('x4',"");
          await replacer.addString('x5',"");
          await replacer.addString('x6',"");
          await replacer.addString('x7',"");
          await replacer.addString('x8',"");
        }
        else if(findform.benefits=="Income Support"){
          await replacer.addString('x1',"");
          await replacer.addString('x2',"");
          await replacer.addString('x3',"");
          await replacer.addString('x4',checkedMark);
          await replacer.addString('x5',"");
          await replacer.addString('x6',"");
          await replacer.addString('x7',"");
          await replacer.addString('x8',"");
        }
        else if(findform.benefits=="Council Tax Benefit"){
          await replacer.addString('x1',"");
          await replacer.addString('x2',"");
          await replacer.addString('x3',"");
          await replacer.addString('x4',"");
          await replacer.addString('x5',"");
          await replacer.addString('x6',checkedMark);
          await replacer.addString('x7',"");
          await replacer.addString('x8',"");
        }
        else if(findform.benefits=="ESA (Any)"){
          await replacer.addString('x1',"");
          await replacer.addString('x2',checkedMark);
          await replacer.addString('x3',"");
          await replacer.addString('x4',"");
          await replacer.addString('x5',"");
          await replacer.addString('x6',"");
          await replacer.addString('x7',"");
          await replacer.addString('x8',"");
        }
        else if(findform.benefits=="Incapacity benefit"){
          await replacer.addString('x1',"");
          await replacer.addString('x2',"");
          await replacer.addString('x3',"");
          await replacer.addString('x4',"");
          await replacer.addString('x5',checkedMark);
          await replacer.addString('x6',"");
          await replacer.addString('x7',"");
          await replacer.addString('x8',"");
        }
        else if(findform.benefits=="Housing Benefit"){
          await replacer.addString('x1',"");
          await replacer.addString('x2',"");
          await replacer.addString('x3',"");
          await replacer.addString('x4',"");
          await replacer.addString('x5',"");
          await replacer.addString('x6',"");
          await replacer.addString('x7',checkedMark);
          await replacer.addString('x8',"");
        }
        else if(findform.benefits=="Universal Credit"){
          await replacer.addString('x1',"");
          await replacer.addString('x2',"");
          await replacer.addString('x3',checkedMark);
          await replacer.addString('x4',"");
          await replacer.addString('x5',"");
          await replacer.addString('x6',"");
          await replacer.addString('x7',"");
          await replacer.addString('x8',"");
        }
        else {
          await replacer.addString('x1',"");
          await replacer.addString('x2',"");
          await replacer.addString('x3',"");
          await replacer.addString('x4',"");
          await replacer.addString('x5',"");
          await replacer.addString('x6',"");
          await replacer.addString('x7',"");
          await replacer.addString('x8',checkedMark);
        }
  
        if(findform.unemployedLength=="0-5 months"){
          await replacer.addString('w1',checkedMark);
          await replacer.addString('w2',"");
          await replacer.addString('w3',"");
          await replacer.addString('w4',"");
          await replacer.addString('w5',"");
        }
        else if(findform.unemployedLength=="6-11 months"){
          await replacer.addString('w1',"");
          await replacer.addString('w2',"");
          await replacer.addString('w3',checkedMark);
          await replacer.addString('w4',"");
          await replacer.addString('w5',"");
        }
        else if(findform.unemployedLength=="12-23 months"){
          await replacer.addString('w1',"");
          await replacer.addString('w2',"");
          await replacer.addString('w3',"");
          await replacer.addString('w4',"");
          await replacer.addString('w5',checkedMark);
        }
        else if(findform.unemployedLength=="24-35 months"){
          await replacer.addString('w1',"");
          await replacer.addString('w2',checkedMark);
          await replacer.addString('w3',"");
          await replacer.addString('w4',"");
          await replacer.addString('w5',"");
        }
        else if(findform.unemployedLength=="Over 36 months"){
          await replacer.addString('w1',"");
          await replacer.addString('w2',"");
          await replacer.addString('w3',"");
          await replacer.addString('w4',checkedMark);
          await replacer.addString('w5',"");
        }
  
       // if(findform.contactMethodPref)
        await replacer.process(page);
       pdfdoc.save(outputPath,PDFNet.SDFDoc.SaveOptions.e_linearized);
       }
  
       PDFNet.runWithCleanup(replaceText).then(()=>{
        fs.readFile(outputPath, (err,data)=>{
          if(err){
            res.statusCode = 500;
            res.end(err)
          }
          else{
            res.setHeader("ContentType","application/pdf");
            res.end(data)
          }
        })
       }).catch(err=>{
         res.statusCode = 500;
         res.end(err)
       })
    }
  
    else
    {
      const gender = findform.gender
      const inputPath = path.resolve(__dirname,"./files/pdf1.pdf");
      const outputPath = path.resolve(__dirname,`./files/${ins}.pdf`);
  
      const replaceText = async()=>{
      const pdfdoc = await PDFNet.PDFDoc.createFromFilePath(inputPath);
      await pdfdoc.initSecurityHandler();
      const replacer = await PDFNet.ContentReplacer.create()
      const page= await pdfdoc.getPage(1);
          
      
      // converting date obj to string
      const datestring = findform.dob.toLocaleDateString();
      
      
      // check mark for gender
      if(gender=="Female"){
        await replacer.addString('G2',checkedMark);
        await replacer.addString('G1',"");
      }
      else{
        await replacer.addString('G1',checkedMark);
        await replacer.addString('G2',"");
      }
  
      //check mark for title
      if(findform.title=="Miss"){
        await replacer.addString('T4',checkedMark);
        await replacer.addString('T1',"");
        await replacer.addString('T2',"");
        await replacer.addString('T3',"");
        await replacer.addString('T5',"");
      }
      else if(findform.title=="Mr"){
        await replacer.addString('T1',checkedMark);
        await replacer.addString('T4',"");
        await replacer.addString('T2',"");
        await replacer.addString('T3',"");
        await replacer.addString('T5',"");
      }
      else if(findform.title=="Mrs"){
        await replacer.addString('T2',checkedMark);
        await replacer.addString('T1',"");
        await replacer.addString('T2',"");
        await replacer.addString('T3',"");
        await replacer.addString('T5',"");
      }
      else if(findform.title=="Ms"){
        await replacer.addString('T3',checkedMark);
        await replacer.addString('T1',"");
        await replacer.addString('T2',"");
        await replacer.addString('T4',"");
        await replacer.addString('T5',"");
      }
      else {
        await replacer.addString('T5',checkedMark);
        await replacer.addString('T1',"");
        await replacer.addString('T2',"");
        await replacer.addString('T3',"");
        await replacer.addString('T4',"");
      }
      
      //check mark for nonEEA citizen
      if(findform.nonEEACitizen=="Yes"){
        await replacer.addString("N1",checkedMark);
        await replacer.addString("N2","");
      }
      else{
        await replacer.addString("N2",checkedMark);
        await replacer.addString("N1","");
      }
  
      // for first language
      if(findform.firstLang=="Yes"){
        await replacer.addString("L1",checkedMark);
        await replacer.addString("L2","");
      }
      else{
        await replacer.addString("L2",checkedMark);
        await replacer.addString("L1","");
      }
  //for residency of eng
      if(findform.residentOfEngland=="Yes"){
        await replacer.addString("R1",checkedMark);
        await replacer.addString("R2","");
      }
      else{
        await replacer.addString("R2",checkedMark);
        await replacer.addString("R1","");
      }
  
      //checked mark for qualification
      if(findform.qualification=="None"){
        await replacer.addString("Q1",checkedMark);
        await replacer.addString("Q2","");
        await replacer.addString("Q3","");
        await replacer.addString("Q4","");
        await replacer.addString("Q5","");
        await replacer.addString("Q6","");
        await replacer.addString("Q7","");
        await replacer.addString("Q8","");
        await replacer.addString("Q9","");
      }
      else if(findform.qualification=="Level 1"){
        await replacer.addString("Q2",checkedMark);
        await replacer.addString("Q1","");
        await replacer.addString("Q3","");
        await replacer.addString("Q4","");
        await replacer.addString("Q5","");
        await replacer.addString("Q6","");
        await replacer.addString("Q7","");
        await replacer.addString("Q8","");
        await replacer.addString("Q9","");
      }
      else if(findform.qualification=="Level 2"){
        await replacer.addString("Q1","");
        await replacer.addString("Q2","");
        await replacer.addString("Q3",checkedMark);
        await replacer.addString("Q4","");
        await replacer.addString("Q5","");
        await replacer.addString("Q6","");
        await replacer.addString("Q7","");
        await replacer.addString("Q8","");
        await replacer.addString("Q9","");
      }
      else if(findform.qualification=="Level 3"){
        await replacer.addString("Q1","");
        await replacer.addString("Q2","");
        await replacer.addString("Q3","");
        await replacer.addString("Q4",checkedMark);
        await replacer.addString("Q5","");
        await replacer.addString("Q6","");
        await replacer.addString("Q7","");
        await replacer.addString("Q8","");
        await replacer.addString("Q9","");
      }
      else if(findform.qualification=="Level 4"){
        await replacer.addString("Q1","");
        await replacer.addString("Q2","");
        await replacer.addString("Q3","");
        await replacer.addString("Q4","");
        await replacer.addString("Q5",checkedMark);
        await replacer.addString("Q6","");
        await replacer.addString("Q7","");
        await replacer.addString("Q8","");
        await replacer.addString("Q9","");
      }
  
      else if(findform.qualification=="Level 5"){
        await replacer.addString("Q1","");
        await replacer.addString("Q2","");
        await replacer.addString("Q3","");
        await replacer.addString("Q4","");
        await replacer.addString("Q5","");
        await replacer.addString("Q6",checkedMark);
        await replacer.addString("Q7","");
        await replacer.addString("Q8","");
        await replacer.addString("Q9","");
      }
      else if(findform.qualification=="Level 6"){
        await replacer.addString("Q1","");
        await replacer.addString("Q2","");
        await replacer.addString("Q3","");
        await replacer.addString("Q4","");
        await replacer.addString("Q5","");
        await replacer.addString("Q6","");
        await replacer.addString("Q7",checkedMark);
        await replacer.addString("Q8","");
        await replacer.addString("Q9","");
      }
      else if(findform.qualification=="Level 7"){
        await replacer.addString("Q1","");
        await replacer.addString("Q2","");
        await replacer.addString("Q3","");
        await replacer.addString("Q4","");
        await replacer.addString("Q5","");
        await replacer.addString("Q6","");
        await replacer.addString("Q7","");
        await replacer.addString("Q8",checkedMark);
        await replacer.addString("Q9","");
      }
      else {
        await replacer.addString("Q1","");
        await replacer.addString("Q2","");
        await replacer.addString("Q3","");
        await replacer.addString("Q4","");
        await replacer.addString("Q5","");
        await replacer.addString("Q6","");
        await replacer.addString("Q7","");
        await replacer.addString("Q8","");
        await replacer.addString("Q9",checkedMark);
      }
  
      //for ethnic origin
      if(findform.ethnicOrigin=="English/Welsh/Scottish/Northern Irish/British"){
        await replacer.addString("E1",checkedMark);
        await replacer.addString("E2","")
        await replacer.addString("E3","")
        await replacer.addString("E4","")
        await replacer.addString("E5","")
        await replacer.addString("E6","")
        await replacer.addString("E7","")
        await replacer.addString("E8","")
        await replacer.addString("E9","")
        await replacer.addString("E10","")
        await replacer.addString("E11","")
        await replacer.addString("E12","")
        await replacer.addString("E13","")
        await replacer.addString("E14","")
        await replacer.addString("E15","")
        await replacer.addString("E16","")
        await replacer.addString("E17","")
        await replacer.addString("E18","")
      }
      else if(findform.ethnicOrigin=="Irish"){
        await replacer.addString("E1","");
        await replacer.addString("E2",checkedMark);
        await replacer.addString("E3","");
        await replacer.addString("E4","");
        await replacer.addString("E5","");
        await replacer.addString("E6","");
        await replacer.addString("E7","");
        await replacer.addString("E8","");
        await replacer.addString("E9","");
        await replacer.addString("E10","");
        await replacer.addString("E11","");
        await replacer.addString("E12","");
        await replacer.addString("E13","");
        await replacer.addString("E14","");
        await replacer.addString("E15","");
        await replacer.addString("E16","");
        await replacer.addString("E17","");
        await replacer.addString("E18","");
      }
      else if(findform.ethnicOrigin=="Gypsy or Irish traveller"){
        await replacer.addString("E1","");
        await replacer.addString("E2","")
        await replacer.addString("E3",checkedMark)
        await replacer.addString("E4","")
        await replacer.addString("E5","")
        await replacer.addString("E6","")
        await replacer.addString("E7","")
        await replacer.addString("E8","")
        await replacer.addString("E9","")
        await replacer.addString("E10","")
        await replacer.addString("E11","")
        await replacer.addString("E12","")
        await replacer.addString("E13","")
        await replacer.addString("E14","")
        await replacer.addString("E15","")
        await replacer.addString("E16","")
        await replacer.addString("E17","")
        await replacer.addString("E18","")
      }
      else if(findform.ethnicOrigin=="Any other white background"){
        await replacer.addString("E1","");
        await replacer.addString("E2","")
        await replacer.addString("E3","")
        await replacer.addString("E4",checkedMark)
        await replacer.addString("E5","")
        await replacer.addString("E6","")
        await replacer.addString("E7","")
        await replacer.addString("E8","")
        await replacer.addString("E9","")
        await replacer.addString("E10","")
        await replacer.addString("E11","")
        await replacer.addString("E12","")
        await replacer.addString("E13","")
        await replacer.addString("E14","")
        await replacer.addString("E15","")
        await replacer.addString("E16","")
        await replacer.addString("E17","")
        await replacer.addString("E18","")
      }
      
      else if(findform.ethnicOrigin=="White and Black Carribean"){
        await replacer.addString("E1","");
        await replacer.addString("E2","")
        await replacer.addString("E3","")
        await replacer.addString("E4","")
        await replacer.addString("E5",checkedMark)
        await replacer.addString("E6","")
        await replacer.addString("E7","")
        await replacer.addString("E8","")
        await replacer.addString("E9","")
        await replacer.addString("E10","")
        await replacer.addString("E11","")
        await replacer.addString("E12","")
        await replacer.addString("E13","")
        await replacer.addString("E14","")
        await replacer.addString("E15","")
        await replacer.addString("E16","")
        await replacer.addString("E17","")
        await replacer.addString("E18","")
      }
      else if(findform.ethnicOrigin=="White and Black African"){
        await replacer.addString("E1","");
        await replacer.addString("E2","")
        await replacer.addString("E3","")
        await replacer.addString("E4","")
        await replacer.addString("E5","")
        await replacer.addString("E6",checkedMark)
        await replacer.addString("E7","")
        await replacer.addString("E8","")
        await replacer.addString("E9","")
        await replacer.addString("E10","")
        await replacer.addString("E11","")
        await replacer.addString("E12","")
        await replacer.addString("E13","")
        await replacer.addString("E14","")
        await replacer.addString("E15","")
        await replacer.addString("E16","")
        await replacer.addString("E17","")
        await replacer.addString("E18","")
      }
      else if(findform.ethnicOrigin=="White and Asian"){
        await replacer.addString("E1","");
        await replacer.addString("E2","")
        await replacer.addString("E3","")
        await replacer.addString("E4","")
        await replacer.addString("E5","")
        await replacer.addString("E6","")
        await replacer.addString("E7",checkedMark)
        await replacer.addString("E8","")
        await replacer.addString("E9","")
        await replacer.addString("E10","")
        await replacer.addString("E11","")
        await replacer.addString("E12","")
        await replacer.addString("E13","")
        await replacer.addString("E14","")
        await replacer.addString("E15","")
        await replacer.addString("E16","")
        await replacer.addString("E17","")
        await replacer.addString("E18","")
      }
      else if(findform.ethnicOrigin=="Any other mixed/multiple ethnic background"){
        await replacer.addString("E1","");
        await replacer.addString("E2","")
        await replacer.addString("E3","")
        await replacer.addString("E4","")
        await replacer.addString("E5","")
        await replacer.addString("E6","")
        await replacer.addString("E7","")
        await replacer.addString("E8",checkedMark)
        await replacer.addString("E9","")
        await replacer.addString("E10","")
        await replacer.addString("E11","")
        await replacer.addString("E12","")
        await replacer.addString("E13","")
        await replacer.addString("E14","")
        await replacer.addString("E15","")
        await replacer.addString("E16","")
        await replacer.addString("E17","")
        await replacer.addString("E18","")
      }
      else if(findform.ethnicOrigin=="Indian"){
        await replacer.addString("E1","");
        await replacer.addString("E2","")
        await replacer.addString("E3","")
        await replacer.addString("E4","")
        await replacer.addString("E5","")
        await replacer.addString("E6","")
        await replacer.addString("E7","")
        await replacer.addString("E8","")
        await replacer.addString("E9",checkedMark)
        await replacer.addString("E10","")
        await replacer.addString("E11","")
        await replacer.addString("E12","")
        await replacer.addString("E13","")
        await replacer.addString("E14","")
        await replacer.addString("E15","")
        await replacer.addString("E16","")
        await replacer.addString("E17","")
        await replacer.addString("E18","")
      }
      else if(findform.ethnicOrigin=="Pakistani"){
        await replacer.addString("E1","");
        await replacer.addString("E2","")
        await replacer.addString("E3","")
        await replacer.addString("E4","")
        await replacer.addString("E5","")
        await replacer.addString("E6","")
        await replacer.addString("E7","")
        await replacer.addString("E8","")
        await replacer.addString("E9","")
        await replacer.addString("E10",checkedMark)
        await replacer.addString("E11","")
        await replacer.addString("E12","")
        await replacer.addString("E13","")
        await replacer.addString("E14","")
        await replacer.addString("E15","")
        await replacer.addString("E16","")
        await replacer.addString("E17","")
        await replacer.addString("E18","")
      }
      else if(findform.ethnicOrigin=="Bangladeshi"){
        await replacer.addString("E1","");
        await replacer.addString("E2","")
        await replacer.addString("E3","")
        await replacer.addString("E4","")
        await replacer.addString("E5","")
        await replacer.addString("E6","")
        await replacer.addString("E7","")
        await replacer.addString("E8","")
        await replacer.addString("E9","")
        await replacer.addString("E10","")
        await replacer.addString("E11",checkedMark)
        await replacer.addString("E12","")
        await replacer.addString("E13","")
        await replacer.addString("E14","")
        await replacer.addString("E15","")
        await replacer.addString("E16","")
        await replacer.addString("E17","")
        await replacer.addString("E18","")
      }
      else if(findform.ethnicOrigin=="Chinese"){
        await replacer.addString("E1","");
        await replacer.addString("E2","")
        await replacer.addString("E3","")
        await replacer.addString("E4","")
        await replacer.addString("E5","")
        await replacer.addString("E6","")
        await replacer.addString("E7","")
        await replacer.addString("E8","")
        await replacer.addString("E9","")
        await replacer.addString("E10","")
        await replacer.addString("E11","")
        await replacer.addString("E12",checkedMark)
        await replacer.addString("E13","")
        await replacer.addString("E14","")
        await replacer.addString("E15","")
        await replacer.addString("E16","")
        await replacer.addString("E17","")
        await replacer.addString("E18","")
      }
      else if(findform.ethnicOrigin=="Any other Asian background"){
        await replacer.addString("E1","");
        await replacer.addString("E2","")
        await replacer.addString("E3","")
        await replacer.addString("E4","")
        await replacer.addString("E5","")
        await replacer.addString("E6","")
        await replacer.addString("E7","")
        await replacer.addString("E8","")
        await replacer.addString("E9","")
        await replacer.addString("E10","")
        await replacer.addString("E11","")
        await replacer.addString("E12","")
        await replacer.addString("E13",checkedMark)
        await replacer.addString("E14","")
        await replacer.addString("E15","")
        await replacer.addString("E16","")
        await replacer.addString("E17","")
        await replacer.addString("E18","")
      }
      else if(findform.ethnicOrigin=="African"){
        await replacer.addString("E1","");
        await replacer.addString("E2","")
        await replacer.addString("E3","")
        await replacer.addString("E4","")
        await replacer.addString("E5","")
        await replacer.addString("E6","")
        await replacer.addString("E7","")
        await replacer.addString("E8","")
        await replacer.addString("E9","")
        await replacer.addString("E10","")
        await replacer.addString("E11","")
        await replacer.addString("E12","")
        await replacer.addString("E13","")
        await replacer.addString("E14",checkedMark)
        await replacer.addString("E15","")
        await replacer.addString("E16","")
        await replacer.addString("E17","")
        await replacer.addString("E18","")
      }
      else if(findform.ethnicOrigin=="Caribbean"){
        await replacer.addString("E1","");
        await replacer.addString("E2","")
        await replacer.addString("E3","")
        await replacer.addString("E4","")
        await replacer.addString("E5","")
        await replacer.addString("E6","")
        await replacer.addString("E7","")
        await replacer.addString("E8","")
        await replacer.addString("E9","")
        await replacer.addString("E10","")
        await replacer.addString("E11","")
        await replacer.addString("E12","")
        await replacer.addString("E13","")
        await replacer.addString("E14","")
        await replacer.addString("E15",checkedMark)
        await replacer.addString("E16","")
        await replacer.addString("E17","")
        await replacer.addString("E18","")
      }
      else if(findform.ethnicOrigin=="Any other Black/African/Caribbean"){
        await replacer.addString("E1","");
        await replacer.addString("E2","")
        await replacer.addString("E3","")
        await replacer.addString("E4","")
        await replacer.addString("E5","")
        await replacer.addString("E6","")
        await replacer.addString("E7","")
        await replacer.addString("E8","")
        await replacer.addString("E9","")
        await replacer.addString("E10","")
        await replacer.addString("E11","")
        await replacer.addString("E12","")
        await replacer.addString("E13","")
        await replacer.addString("E14","")
        await replacer.addString("E15","")
        await replacer.addString("E16",checkedMark)
        await replacer.addString("E17","")
        await replacer.addString("E18","")
      }
      else if(findform.ethnicOrigin=="Arab"){
        await replacer.addString("E1","");
        await replacer.addString("E2","")
        await replacer.addString("E3","")
        await replacer.addString("E4","")
        await replacer.addString("E5","")
        await replacer.addString("E6","")
        await replacer.addString("E7","")
        await replacer.addString("E8","")
        await replacer.addString("E9","")
        await replacer.addString("E10","")
        await replacer.addString("E11","")
        await replacer.addString("E12","")
        await replacer.addString("E13","")
        await replacer.addString("E14","")
        await replacer.addString("E15","")
        await replacer.addString("E16","")
        await replacer.addString("E17",checkedMark)
        await replacer.addString("E18","")
      }
      else if(findform.ethnicOrigin==" Any other ethnic group"){
        await replacer.addString("E1","");
        await replacer.addString("E2","")
        await replacer.addString("E3","")
        await replacer.addString("E4","")
        await replacer.addString("E5","")
        await replacer.addString("E6","")
        await replacer.addString("E7","")
        await replacer.addString("E8","")
        await replacer.addString("E9","")
        await replacer.addString("E10","")
        await replacer.addString("E11","")
        await replacer.addString("E12","")
        await replacer.addString("E13","")
        await replacer.addString("E14","")
        await replacer.addString("E15","")
        await replacer.addString("E16","")
        await replacer.addString("E17","")
        await replacer.addString("E18",checkedMark)
      }
  
      await replacer.addString('LastName',findform.lastName);
      await replacer.addString('ForeName',findform.firstName);
      await replacer.addString('Age',findform.age);
      await replacer.addString('DateOfBirth',datestring);
      await replacer.addString('NatInsuranceNo',findform.nationalInsNo);
      await replacer.addString('HomeAddress',findform.addLine1);
      await replacer.addString('PostCode',findform.postcode);
      await replacer.addString('AddL',findform.yearsAtAdd);
      await replacer.addString('Telephone',findform.telephone);
      await replacer.addString('Mobile',findform.mobile);
      await replacer.addString('Email',findform.email);
      await replacer.addString('EmerCN',findform.emergencyContactName);
      await replacer.addString('EmerTel',findform.emergencyTelephone);
      await replacer.addString('Nationality',findform.nationality);
      await replacer.addString('AddressEmploy',findform.employerAddress);
      await replacer.addString('WorkPC',findform.employerPostcode);
      await replacer.addString('WorkTel',findform.employersTelNo);
      await replacer.addString('HoursWorked',findform.hoursPerWeek);
      await replacer.addString('Maths',findform.mathsGrades);
      await replacer.addString('English',findform.englishGrades);
      await replacer.addString('Crime',findform.criminalConvictions);
  
      if(findform.disabilities=="Yes"){
        if(findform.disabilitiesValues=="04"){
        await replacer.addString('04',checkedMark)
        await replacer.addString('05',"")
        await replacer.addString('06',"")
        await replacer.addString('07',"")
        await replacer.addString('08',"")
        await replacer.addString('09',"")
        await replacer.addString('10',"")
        await replacer.addString('11',"")
        await replacer.addString('12',"")
        await replacer.addString('13',"")
        await replacer.addString('14',"")
        await replacer.addString('15',"")
        await replacer.addString('16',"")
        await replacer.addString('17',"")
        await replacer.addString('93',"")
        await replacer.addString('95',"")
        await replacer.addString('96',"")
        await replacer.addString('97',"")
        }
        else if(findform.disabilitiesValues=="05"){
          await replacer.addString('04',"")
          await replacer.addString('05',checkedMark)
          await replacer.addString('06',"")
          await replacer.addString('07',"")
          await replacer.addString('08',"")
          await replacer.addString('09',"")
          await replacer.addString('10',"")
          await replacer.addString('11',"")
          await replacer.addString('12',"")
          await replacer.addString('13',"")
          await replacer.addString('14',"")
          await replacer.addString('15',"")
          await replacer.addString('16',"")
          await replacer.addString('17',"")
          await replacer.addString('93',"")
          await replacer.addString('95',"")
          await replacer.addString('96',"")
          await replacer.addString('97',"")
          }
          else if(findform.disabilitiesValues=="06"){
            await replacer.addString('04',"")
            await replacer.addString('05',"")
            await replacer.addString('06',checkedMark)
            await replacer.addString('07',"")
            await replacer.addString('08',"")
            await replacer.addString('09',"")
            await replacer.addString('10',"")
            await replacer.addString('11',"")
            await replacer.addString('12',"")
            await replacer.addString('13',"")
            await replacer.addString('14',"")
            await replacer.addString('15',"")
            await replacer.addString('16',"")
            await replacer.addString('17',"")
            await replacer.addString('93',"")
            await replacer.addString('95',"")
            await replacer.addString('96',"")
            await replacer.addString('97',"")
            }
            else if(findform.disabilitiesValues=="07"){
              await replacer.addString('04',"")
              await replacer.addString('05',"")
              await replacer.addString('06',"")
              await replacer.addString('07',checkedMark)
              await replacer.addString('08',"")
              await replacer.addString('09',"")
              await replacer.addString('10',"")
              await replacer.addString('11',"")
              await replacer.addString('12',"")
              await replacer.addString('13',"")
              await replacer.addString('14',"")
              await replacer.addString('15',"")
              await replacer.addString('16',"")
              await replacer.addString('17',"")
              await replacer.addString('93',"")
              await replacer.addString('95',"")
              await replacer.addString('96',"")
              await replacer.addString('97',"")
              }
              else if(findform.disabilitiesValues=="08"){
                await replacer.addString('04',"")
                await replacer.addString('05',"")
                await replacer.addString('06',"")
                await replacer.addString('07',"")
                await replacer.addString('08',checkedMark)
                await replacer.addString('09',"")
                await replacer.addString('10',"")
                await replacer.addString('11',"")
                await replacer.addString('12',"")
                await replacer.addString('13',"")
                await replacer.addString('14',"")
                await replacer.addString('15',"")
                await replacer.addString('16',"")
                await replacer.addString('17',"")
                await replacer.addString('93',"")
                await replacer.addString('95',"")
                await replacer.addString('96',"")
                await replacer.addString('97',"")
                }
                else if(findform.disabilitiesValues=="09"){
                  await replacer.addString('04',"")
                  await replacer.addString('05',"")
                  await replacer.addString('06',"")
                  await replacer.addString('07',"")
                  await replacer.addString('08',"")
                  await replacer.addString('09',checkedMark)
                  await replacer.addString('10',"")
                  await replacer.addString('11',"")
                  await replacer.addString('12',"")
                  await replacer.addString('13',"")
                  await replacer.addString('14',"")
                  await replacer.addString('15',"")
                  await replacer.addString('16',"")
                  await replacer.addString('17',"")
                  await replacer.addString('93',"")
                  await replacer.addString('95',"")
                  await replacer.addString('96',"")
                  await replacer.addString('97',"")
                  }
                  else if(findform.disabilitiesValues=="10"){
                    await replacer.addString('04',"")
                    await replacer.addString('05',"")
                    await replacer.addString('06',"")
                    await replacer.addString('07',"")
                    await replacer.addString('08',"")
                    await replacer.addString('09',"")
                    await replacer.addString('10',checkedMark)
                    await replacer.addString('11',"")
                    await replacer.addString('12',"")
                    await replacer.addString('13',"")
                    await replacer.addString('14',"")
                    await replacer.addString('15',"")
                    await replacer.addString('16',"")
                    await replacer.addString('17',"")
                    await replacer.addString('93',"")
                    await replacer.addString('95',"")
                    await replacer.addString('96',"")
                    await replacer.addString('97',"")
                    }
                    else if(findform.disabilitiesValues=="11"){
                      await replacer.addString('04',"")
                      await replacer.addString('05',"")
                      await replacer.addString('06',"")
                      await replacer.addString('07',"")
                      await replacer.addString('08',"")
                      await replacer.addString('09',"")
                      await replacer.addString('10',"")
                      await replacer.addString('11',checkedMark)
                      await replacer.addString('12',"")
                      await replacer.addString('13',"")
                      await replacer.addString('14',"")
                      await replacer.addString('15',"")
                      await replacer.addString('16',"")
                      await replacer.addString('17',"")
                      await replacer.addString('93',"")
                      await replacer.addString('95',"")
                      await replacer.addString('96',"")
                      await replacer.addString('97',"")
                      }
                      else if(findform.disabilitiesValues=="12"){
                        await replacer.addString('04',"")
                        await replacer.addString('05',"")
                        await replacer.addString('06',"")
                        await replacer.addString('07',"")
                        await replacer.addString('08',"")
                        await replacer.addString('09',"")
                        await replacer.addString('10',"")
                        await replacer.addString('11',"")
                        await replacer.addString('12',checkedMark)
                        await replacer.addString('13',"")
                        await replacer.addString('14',"")
                        await replacer.addString('15',"")
                        await replacer.addString('16',"")
                        await replacer.addString('17',"")
                        await replacer.addString('93',"")
                        await replacer.addString('95',"")
                        await replacer.addString('96',"")
                        await replacer.addString('97',"")
                        }
                        else if(findform.disabilitiesValues=="13"){
                          await replacer.addString('04',"")
                          await replacer.addString('05',"")
                          await replacer.addString('06',"")
                          await replacer.addString('07',"")
                          await replacer.addString('08',"")
                          await replacer.addString('09',"")
                          await replacer.addString('10',"")
                          await replacer.addString('11',"")
                          await replacer.addString('12',"")
                          await replacer.addString('13',checkedMark)
                          await replacer.addString('14',"")
                          await replacer.addString('15',"")
                          await replacer.addString('16',"")
                          await replacer.addString('17',"")
                          await replacer.addString('93',"")
                          await replacer.addString('95',"")
                          await replacer.addString('96',"")
                          await replacer.addString('97',"")
                          }
                          else if(findform.disabilitiesValues=="14"){
                            await replacer.addString('04',"")
                            await replacer.addString('05',"")
                            await replacer.addString('06',"")
                            await replacer.addString('07',"")
                            await replacer.addString('08',"")
                            await replacer.addString('09',"")
                            await replacer.addString('10',"")
                            await replacer.addString('11',"")
                            await replacer.addString('12',"")
                            await replacer.addString('13',"")
                            await replacer.addString('14',checkedMark)
                            await replacer.addString('15',"")
                            await replacer.addString('16',"")
                            await replacer.addString('17',"")
                            await replacer.addString('93',"")
                            await replacer.addString('95',"")
                            await replacer.addString('96',"")
                            await replacer.addString('97',"")
                            }
                            else if(findform.disabilitiesValues=="15"){
                              await replacer.addString('04',"")
                              await replacer.addString('05',"")
                              await replacer.addString('06',"")
                              await replacer.addString('07',"")
                              await replacer.addString('08',"")
                              await replacer.addString('09',"")
                              await replacer.addString('10',"")
                              await replacer.addString('11',"")
                              await replacer.addString('12',"")
                              await replacer.addString('13',"")
                              await replacer.addString('14',"")
                              await replacer.addString('15',checkedMark)
                              await replacer.addString('16',"")
                              await replacer.addString('17',"")
                              await replacer.addString('93',"")
                              await replacer.addString('95',"")
                              await replacer.addString('96',"")
                              await replacer.addString('97',"")
                              }
                              else if(findform.disabilitiesValues=="16"){
                                await replacer.addString('04',"")
                                await replacer.addString('05',"")
                                await replacer.addString('06',"")
                                await replacer.addString('07',"")
                                await replacer.addString('08',"")
                                await replacer.addString('09',"")
                                await replacer.addString('10',"")
                                await replacer.addString('11',"")
                                await replacer.addString('12',"")
                                await replacer.addString('13',"")
                                await replacer.addString('14',"")
                                await replacer.addString('15',"")
                                await replacer.addString('16',checkedMark)
                                await replacer.addString('17',"")
                                await replacer.addString('93',"")
                                await replacer.addString('95',"")
                                await replacer.addString('96',"")
                                await replacer.addString('97',"")
                                }
                                else if(findform.disabilitiesValues=="17"){
                                  await replacer.addString('04',"")
                                  await replacer.addString('05',"")
                                  await replacer.addString('06',"")
                                  await replacer.addString('07',"")
                                  await replacer.addString('08',"")
                                  await replacer.addString('09',"")
                                  await replacer.addString('10',"")
                                  await replacer.addString('11',"")
                                  await replacer.addString('12',"")
                                  await replacer.addString('13',"")
                                  await replacer.addString('14',"")
                                  await replacer.addString('15',"")
                                  await replacer.addString('16',"")
                                  await replacer.addString('17',checkedMark)
                                  await replacer.addString('93',"")
                                  await replacer.addString('95',"")
                                  await replacer.addString('96',"")
                                  await replacer.addString('97',"")
                                  }
                                  else if(findform.disabilitiesValues=="93"){
                                    await replacer.addString('04',"")
                                    await replacer.addString('05',"")
                                    await replacer.addString('06',"")
                                    await replacer.addString('07',"")
                                    await replacer.addString('08',"")
                                    await replacer.addString('09',"")
                                    await replacer.addString('10',"")
                                    await replacer.addString('11',"")
                                    await replacer.addString('12',"")
                                    await replacer.addString('13',"")
                                    await replacer.addString('14',"")
                                    await replacer.addString('15',"")
                                    await replacer.addString('16',"")
                                    await replacer.addString('17',"")
                                    await replacer.addString('93',checkedMark)
                                    await replacer.addString('95',"")
                                    await replacer.addString('96',"")
                                    await replacer.addString('97',"")
                                    }
                                    else if(findform.disabilitiesValues=="95"){
                                      await replacer.addString('04',"")
                                      await replacer.addString('05',"")
                                      await replacer.addString('06',"")
                                      await replacer.addString('07',"")
                                      await replacer.addString('08',"")
                                      await replacer.addString('09',"")
                                      await replacer.addString('10',"")
                                      await replacer.addString('11',"")
                                      await replacer.addString('12',"")
                                      await replacer.addString('13',"")
                                      await replacer.addString('14',"")
                                      await replacer.addString('15',"")
                                      await replacer.addString('16',"")
                                      await replacer.addString('17',"")
                                      await replacer.addString('93',"")
                                      await replacer.addString('95',checkedMark)
                                      await replacer.addString('96',"")
                                      await replacer.addString('97',"")
                                      }
                                      else if(findform.disabilitiesValues=="96"){
                                        await replacer.addString('04',"")
                                        await replacer.addString('05',"")
                                        await replacer.addString('06',"")
                                        await replacer.addString('07',"")
                                        await replacer.addString('08',"")
                                        await replacer.addString('09',"")
                                        await replacer.addString('10',"")
                                        await replacer.addString('11',"")
                                        await replacer.addString('12',"")
                                        await replacer.addString('13',"")
                                        await replacer.addString('14',"")
                                        await replacer.addString('15',"")
                                        await replacer.addString('16',"")
                                        await replacer.addString('17',"")
                                        await replacer.addString('93',"")
                                        await replacer.addString('95',"")
                                        await replacer.addString('96',checkedMark)
                                        await replacer.addString('97',"")
                                        }
                                        else if(findform.disabilitiesValues=="97"){
                                          await replacer.addString('04',"")
                                          await replacer.addString('05',"")
                                          await replacer.addString('06',"")
                                          await replacer.addString('07',"")
                                          await replacer.addString('08',"")
                                          await replacer.addString('09',"")
                                          await replacer.addString('10',"")
                                          await replacer.addString('11',"")
                                          await replacer.addString('12',"")
                                          await replacer.addString('13',"")
                                          await replacer.addString('14',"")
                                          await replacer.addString('15',"")
                                          await replacer.addString('16',"")
                                          await replacer.addString('17',"")
                                          await replacer.addString('93',"")
                                          await replacer.addString('95',"")
                                          await replacer.addString('96',"")
                                          await replacer.addString('97',checkedMark)
                                          }
  
      }
      else{
          await replacer.addString('04',"")
          await replacer.addString('05',"")
          await replacer.addString('06',"")
          await replacer.addString('07',"")
          await replacer.addString('08',"")
          await replacer.addString('09',"")
          await replacer.addString('10',"")
          await replacer.addString('11',"")
          await replacer.addString('12',"")
          await replacer.addString('13',"")
          await replacer.addString('14',"")
          await replacer.addString('15',"")
          await replacer.addString('16',"")
          await replacer.addString('17',"")
          await replacer.addString('93',"")
          await replacer.addString('95',"")
          await replacer.addString('96',"")
          await replacer.addString('97',"")
          
      }
  
      if(findform.wheelchair=="Yes"){
        await replacer.addString('Y',checkedMark)
        await replacer.addString('N',"")
      }
      else if(findform.wheelchair=="No"){
        await replacer.addString('Y',"")
        await replacer.addString('N',checkedMark)
      }
  
      
      await replacer.process(page);
       pdfdoc.save(outputPath,PDFNet.SDFDoc.SaveOptions.e_linearized);
      
    }
    PDFNet.runWithCleanup(replaceText).then(()=>{
      fs.readFile(outputPath, (err,data)=>{
        if(err){
          res.statusCode = 500;
          res.end(err)
        }
        else{
          res.setHeader("ContentType","application/pdf");
          res.end(data)
        }
      })
     }).catch(err=>{
       res.statusCode = 500;
       res.end(err)
     })

    }

  
})

//test sign path
route.get("/testsign", async(req,res)=>{
  try {
    const formData = await Form.find();
    for(i=0;i<formData.length;i++){
      const id= formData[i]._id
      const findform = await Form.findById(id);
      const pathToPDF = path.resolve(__dirname,`./files/${findform.nationalInsNo}.pdf`);
  if(fs.existsSync(pathToPDF)){
    console.log("inside")
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



//----------------------------end----------------------------------------------------------//


route.post("/signs",upload.single('img'),  async (req, res) =>{
  const {nationalInsNo} = req.body
  var path = req.body.img
  var uniqueFileName = nationalInsNo;
  try {
    const image = await cloudinary.uploader.upload(path, {
      public_id: `signatures/${uniqueFileName}`,
      tags: "signatures",
    });
    
    //fs.unlinkSync(path);
    
    if(image){
      const newSign = new Sign({
        _id: new mongoose.Types.ObjectId(),
        nationalInsNo,
        img: image && image.url,
       
      });
      
      const response = await newSign.save();
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
  } catch (error) {
    res.status(501).json({
      success: false,
      data: [],
      message: error.message,
    });
  }
  
 
      
});



route.get("/watermark/:id", async(req,res)=>{
  const fo = req.params.id
  const findform = await Form.findById(fo);
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

    fs.readFile(outputPath,  (err,data) =>{
      if(err){
        res.statusCode = 500;
        res.end(err)
      }
      else{
        res.setHeader("ContentType","application/pdf");
       // res.setHeader("Access-Control-Allow-Origin", "https://consulting-frontend.herokuapp.com");
        res.end(data)
      }
      
    }).catch(err=>{
      res.statusCode = 500;
      res.end(err)
    });
  }
  run({ pathToPDF, pathToImage }).catch(console.error);

  }
  else{
    const pathToPDF = path.resolve(__dirname,`./files/${findform.nationalInsNo}une.pdf`);
    pathToImage = `https://res.cloudinary.com/dexn8tnt9/image/upload/v1614679360/signatures/${findform.nationalInsNo}.png`
  
  
  const outputPath = path.resolve(__dirname,`./files/${findform.nationalInsNo}une.pdf`);
    if(findform.employmentStatus=="Not in paid employment, looking for work"){
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

    fs.readFile(outputPath,  (err,data) =>{
      if(err){
        res.statusCode = 500;
        res.end(err)
      }
      else{
        res.setHeader("ContentType","application/pdf");
        res.setHeader("Access-Control-Allow-Origin", "*");
        res.end(data)
      }
      
    }).catch(err=>{
      res.statusCode = 500;
      res.end(err)
    });
  }

  run({ pathToPDF, pathToImage }).catch(console.error);
}

else{
  const run = async ({ pathToPDF, pathToImage }) => {
    
    const pngImageBytes = await fetch(pathToImage).then((res) => res.arrayBuffer())
    const pdfDoc = await PDFDocument.load(fs.readFileSync(pathToPDF));
    const img = await pdfDoc.embedPng(pngImageBytes);
  
    const imagePage1= await pdfDoc.getPage(0);

  
    imagePage1.drawImage(img, {
      x: 650,
      y:78,
      width:30,
      height: 30,
    });
  
    const pdfBytes = await pdfDoc.save();
    fs.writeFileSync(outputPath, pdfBytes);

    fs.readFile(outputPath,  (err,data) =>{
      if(err){
        res.statusCode = 500;
        res.end(err)
      }
      else{
        res.setHeader("ContentType","application/pdf");
        res.setHeader("Access-Control-Allow-Origin", "*");
        res.end(data)
      }
      
    }).catch(err=>{
      res.statusCode = 500;
      res.end(err)
    });
  }

  run({ pathToPDF, pathToImage }).catch(console.error);
}
  }
  
});



// incomplete forms
route.get("/incompleteForms", async(req,res)=>{
 try{ const Forms = await Form.find();
  const Detail = await Details.find()
  
  //compare form and detail tables and delete the detailsrec against submitted form
 
for(i=0;i<Forms.length;i++){
 
    
      Details.deleteOne({ email: Forms[i].email }).then(function(){ 
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

route.post("/ids",upload.single('idPic'),  async (req, res) =>{
  const {nationalInsNo} = req.body
  var path = req.file && req.file.path
  var uniqueFileName = nationalInsNo;
  try {
    const image = await cloudinary.uploader.upload(path, {
      public_id: `id/${uniqueFileName}`,
      tags: "id",
    });
    
    //fs.unlinkSync(path);
    
    if(image){
      const newID = new ID({
        _id: new mongoose.Types.ObjectId(),
        nationalInsNo,
        idPic: image && image.url,
       
      });
      
      const response = await newID.save();
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
  } catch (error) {
    res.status(501).json({
      success: false,
      data: [],
      message: error.message,
    });
  }
  
 
      
});

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


module.exports = route;
