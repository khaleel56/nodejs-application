const mongoose = require('mongoose')

const PostSchema = new mongoose.Schema({
    emailId:{
        type:String,
        required:true
    },
    taskId:{
        type:Number,
        required:true
    },
    date:{
        type:Date,
        required:true
    },
    task:{
        type:String,
        required:true
    },
    status:{
        type:String,
        required:true
    }
})

module.exports = mongoose.model('Post', PostSchema)