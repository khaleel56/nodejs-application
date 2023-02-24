const { isEmpty, flattenDepth } = require('lodash')
const bcrypt = require('bcrypt')

const UserModel = require('../Models/User')
const PostModel = require('../Models/Post')
const UserOtpVerificationModel = require('../Models/UserOtpVerification')
const {pagination, sendOTPVerificationEmail} = require('../helper')

//registration for new users
const register = async (req, res) => {
    console.log('..Running Registeration method..')
    try {
        const emailId = req.body.emailId
        const password = req.body.password
        if (isEmpty(emailId) || isEmpty(password)) {
            throw new Error('incomplete!! all fileds are required to be filled')
        } else {
            const userExistCheck = await UserModel.findOne({ emailId }).lean()
            if (isEmpty(userExistCheck)) {
                //encryptin user password
                const hashedPassword = await bcrypt.hash(password, 10)
                await UserModel.create({ emailId, password: hashedPassword })
                message = 'register successfull'
            } else {
                message = 'user already exist'
            }
            console.log(`..${message}..`)
            res.status(201).json({message:message})
        }
    }
    catch (error) {
        console.log('register error', error)
        res.status(401).json({message:'register failure. ' + error.message})
    }
}


//login for existing users
const login = async (req, res) => {
    console.log('...Running Login method...')
    try {
        const {emailId, password} = req.body
        if (isEmpty(emailId) || isEmpty(password)) {
            throw new Error('incomplete!! all fileds are required to be filled')
        }else{
            const result = await UserModel.findOne({ emailId }).lean()
            if (!isEmpty(result)) {
                //user authnetication validation
                if (await bcrypt.compare(password, result.password)) {
                    await sendOTPVerificationEmail(req, res, emailId)
                }else{
                    throw new Error('invalid credentials')
                }
            }else{
                throw new Error('User does not exist with this email')
            }
        }
    }
    catch (error) {
        console.log('login error', error)
        res.status(401).json({message:'login failure ' + error.message})
    }
}

//otp verfication for login
const verifyOTP = async (req, res) => {
    console.log('...Running OTP verification method...')
    try {
        const { emailId, otp } = req.body
        if (!emailId || !otp) {
            throw Error('incomplete!! all fileds are required to be filled');
        } else {
            const userOTPRecord = await UserOtpVerificationModel.findOne({ emailId }).lean()
            if (isEmpty(userOTPRecord)) {
                throw new Error('account details doesnot found or verified already ')
            } else {
                //otp & its expiry valdiation
                const { expiresAt, otp: userOTP } = userOTPRecord
                if (expiresAt.getTime() < new Date().getTime()) {
                    await UserOtpVerificationModel.deleteMany({ emailId })
                    throw new Error('code has expired. Please request again')
                } else {
                    if (!(otp == userOTP)) {
                        //entered wrong otp
                        throw new Error('invalid OTP entered')
                    } else {
                        //delete otp once loggedin
                        await UserOtpVerificationModel.deleteMany({ emailId })
                        console.log('User email verified successfully')
                        res.json({
                            status: 'VERIFIED',
                            message: 'User email verified successfully'
                        })
                    }
                }

            }
        }
    } catch (error) {
        console.log('otp verfication failure',error)
        res.json({
            status: 'VERIFICATION FAILED',
            message: error.message
        })
    }
}


//logout (destroy session)
const logout=async(req, res)=>{
    try{
        console.log('...Running Logout method...')
        req.session.destroy(err=>{
            if(err){
                throw new Error(err)
            }
        })
        res.clearCookie(process.env.SESSION_SECRET)
        console.log('logged off successfuly')
        res.status(200).json({message:'logged off successfuly'})
    }catch(error){
        console.log('logout failed \n', error)
        res.status(400).json({message:error.message})
    }
}

//create post 
const createPost=async(req,res)=>{
    try{
        console.log('...Running Data posting method...')
        const {date, task, status, emailId, taskId=null}=req.body;
        if(isEmpty(date) || isEmpty(task) || isEmpty(status) || taskId==null){
            throw new Error('incomplete!! all fileds are required to be filled')
        }else {
             await PostModel.create({emailId, taskId, date:new Date(date), task,status})
             console.log('data posted successfully')
             res.status(201).json({message:'Data Posted successfully'})
        }
    }catch(error){
        console.log('data post failure..\n ',error)
        res.status(400).json({message:error.message})
    }
}

//update posted post
const updatePost=async(req,res)=>{
    console.log('...Running Post modification method...')
    try{
        const patchData = req.body; 
        const updatedFields = {}; 
        const {emailId, taskId=null} = patchData
        if(taskId==null){
            throw new Error('taskId feild is required')
        }else if(Object.keys(patchData).length>2){
                const resource = await PostModel.findOne({emailId, taskId}).lean()
                if(!isEmpty(resource)){
                    //filtering required fields for update as per body
                    for (const key in patchData) {
                        if (key in resource && !['emailId','taskId'].includes(key)) { 
                          updatedFields[key] = patchData[key]; 
                        }
                      }
                      await PostModel.updateOne({eamilId:emailId, taskId:taskId},{$set:updatedFields})
                      console.log('...Post mofification successfull...')
                      res.json({message:'Post mofification successfull'})
                }else{
                    throw new Error(`Post with taskId:${taskId} not found`)
                }
        }else {
            throw new Error('add required fields to update')
        }
    }catch(error){
        console.log('Post modification error \n',error)
        res.status(400).json({message:error.message})
    }  
}

//deleting post
const deletePost=async(req,res)=>{
    console.log('...Running Post Deletion method...')
    try{
        const {emailId, taskId=null} = req.body
        if(taskId==null){
            throw new Error('taskId feild is required')
        }else{
            const postDetails = await PostModel.findOne({emailId, taskId}).lean()
            if(isEmpty(postDetails)){
                throw new Error('post not found or post already deleted')
            }else{
                await PostModel.deleteOne({emailId,taskId})
                console.log('Post Deletion successfull')
                res.json({message:'Post Deletion successfull'})
            }
        }   
    }catch(error){
        console.log('Post Deletion error \n',error)
        res.status(400).json({message:error.message})
    }
}

//getch list of all posts of that user
const PostList=async(req,res)=>{
    console.log('...Running get lists of posted tasks method...')
    try{
        const result=await  pagination(req, res)
        console.log('posted tasks list fetched successfully')
        res.status(200).json({message:'posted tasks list fetched successfully',result })
    }
    catch(error){
        console.log('error in geting lists of posted tasks', error)
        res.status(400).json({message:error.message})
    }
    
}

//sorting posted tasks
const sortPosts=async (req,res)=>{
    console.log('...Running Tasks sort method...')
    try{
        const {emailId, taskSequence=[]}=req.body
        if(!isEmpty(taskSequence)  || !isEmpty(emailId)){
            const taskList =await PostModel.find({emailId}).lean()
            sortedTaskList = taskSequence.map(id=>{
                return taskList.filter(task=>task.taskId==id)
            })
            const posts=flattenDepth(sortedTaskList)
            for(const task of posts){
                await PostModel.deleteOne({emailId:task.emailId, taskId:task.taskId})
            }
             await PostModel.insertMany(posts)
             const result=await  pagination(req, res)
             console.log('sortings tasks successful')
            res.status(200).json({message:'sortings tasks successful',result})
        }else{
            throw new Error('taskSequence not be empty')
        }
    }catch(error){
        console.log('Failure in sorting tasks', error)
        res.status(400).json({message:'Failure in sorting tasks'})
    }
}

module.exports = {
    register,
    login,
    verifyOTP,
    createPost,
    updatePost,
    logout,
    deletePost,
    PostList,
    sortPosts
}