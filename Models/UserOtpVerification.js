const mongoose = require('mongoose')

const UserOtpVerificationSchema = new mongoose.Schema({
    userId:{
        type:String
    },
    otp:{
        type:String
    },
    createdAt:{
        type:Date
    },
    expiresAt:{
        type:Date
    }
})

module.exports = mongoose.model('UserOtpVerification', UserOtpVerificationSchema)