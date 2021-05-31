const express = require("express");
const app = express();
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
const dotenv = require('dotenv')
dotenv.config()

console.log('NODE_ENV: ' + config.util.getEnv('NODE_ENV'));




const port = process.env.PORT || 61500;
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


mongoose
  .connect("mongodb+srv://johnoconsulting:Newcastle9@cluster0.btsxm.mongodb.net/freeCourse?retryWrites=true&w=majority",{
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(success => console.log("Successfully connected to database"))
  .catch(err => console.log("Error while connecting to database"));

app.listen(port, () => console.log(`App listening on port : ${port}`));
