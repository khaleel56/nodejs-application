const express= require('express')
const appRoouter = express.Router();

const controller = require('../Controller/controller')
const authController =require('../AuthController/autController')

//routes with respective endpoints
appRoouter.post('/register', authController.activeAuthentication,controller.register)
appRoouter.post('/login', authController.activeAuthentication, controller.login)
appRoouter.post('/verify-otp', authController.authenticate,controller.verifyOTP)
appRoouter.post('/create-post',authController.authenticate,controller.createPost)
appRoouter.patch('/update-post',authController.authenticate, controller.updatePost)
appRoouter.get('/post-list', authController.authenticate,controller.PostList)
appRoouter.post('/sort-posts',authController.authenticate,controller.sortPosts)
appRoouter.delete('/delete-post',authController.authenticate, controller.deletePost)
appRoouter.post('/logout', authController.authenticate, controller.logout)

module.exports = appRoouter