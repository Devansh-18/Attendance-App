const mongoose = require("mongoose");

const OTPSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        validate: {
            validator: function (v) {
                return /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(v);
            },
            message: (props) => `${props.value} is not a valid email!`,
        },
    },
    otp: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
        expires: 5 * 60, // Expires after 5 minutes
    },
});

// Add indexing
OTPSchema.index({ email: 1 });

module.exports = mongoose.model("OTP", OTPSchema);

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