const mongoose = require("mongoose");
const mailSender = require("../utils/mailSender");
const { emailVerificationTemplate } = require("../mail/templates/emailVerificationTemplate");

const OTPSchema = new mongoose.Schema({
    email:{
        type:String,
        required:true,
    },
    otp:{
        type:String,
        required:true,
    },
    createdAt:{
        type:Date,
        default:Date.now(),
        expires:5*60,
    }
});

//mail to user //db me entry hone se phle
async function sendVerificationEmail(email,otp){
    try{
        const mailResponse = await mailSender(email, "Verification Email from Parikshit", emailVerificationTemplate(otp));
        console.log("Email sent Successfully", mailResponse);
    }
    catch(error){
        console.log("Error occured while Sending mail of OTP ", error);
        throw error;
    }
}

OTPSchema.pre("save", async function(next){
    await sendVerificationEmail(this.email, this.otp);
    next();
})

module.exports = mongoose.model("OTP", OTPSchema);