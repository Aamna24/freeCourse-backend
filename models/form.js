const mongoose = require('mongoose')

const FormSchema = mongoose.Schema({

    detailsFormData:{
        appliedCourse:{type:String, required: true},

    },

    personalDetails: {
        title: {type: String, required: true},
        firstName: {type: String, required: true},
        lastName: {type: String, required: true},
        gender: {type: String, required: true},
        dob:{type:String,},
        age:{type:String},
        addLine1: {type: String, required: true},
        city: {type: String, required: true},
        county: {type: String, required: true},
        postcode:{type: String, },
        telephone:{type:String},
        email:{type:String, required: true},
        emergencyContactName:{type:String},
        yearsAtAdd:{type:String},
        emergencyTelephone:{type:String}
    },
    employmentDetails:{
        employementStatus:{type:String, required: true},
        hoursPerWeek:{type:String},
        length:{type:String},
        employerName:{type:String},
        employerAdd:{type:String},
        postcode:{type:String},
        ph:{type:String},
        unemployedLength:{type:String},
        benefits:{type:String},

    },
    qualificationDetails:{
        level:{type:String,required:true},
        mathGrades:{type:String, required: true},
        englishGrades:{type:String, required: true}
    },
    oppDetails:{
        ethnicOrigin:{type:String},
        disabilities:{type:String},
        wheelchair:{type:String},
        firstLang:{type:String},
        resident:{type:String},
        nonEEACitizen:{type:String},
        criminalConv:{type:String}
    },
    declaration:{
        prefContact:{type:String}
    },

    signature:{type:String},
    date:{type:String}
   


})

module.exports = mongoose.model("Form", FormSchema);