const mongoose = require('mongoose')

const UserSchema = new mongoose.Schema({
    emailId:{
        type:String,
        require:true,
        lowercase:true
    },
    password:{
        type:String,
        require:true
    }
})

module.exports = mongoose.model('User', UserSchema)