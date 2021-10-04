const mongoose = require('mongoose');

const companySchema=new mongoose.Schema({
    CIN:{
        type : String
    },
    CompanyName : {
        type : String
    },
    CompanyStatus : {
        type : String
    },
    RoC :{
        type :String
    },
    RegistrationNumber : {
        type : String
    },
    ClassofCompany : {
        type : String
    },
    DateofIncorporation : {
        type : Date
    },
    AgeofCompany : {
        type : String
    },
    Email_id : {
        type : String
    }
})

const Company = mongoose.model("company",companySchema);

module.exports = Company;