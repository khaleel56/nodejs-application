const {isEmpty,get} =require('lodash')

//authentication using session
const authenticate=async(req,res, next)=>{
    console.log('...Running Autehentication validation method...')
    const emailId= get(req.body, 'emailId')
    const sessionId = get(req.session, 'userId', null)
    if(!isEmpty(sessionId)){
        if(!isEmpty(emailId)){
            if(sessionId==emailId){
                console.log('validation successfull')
                next()
            }else{
                console.log('unauthorized user')
                res.status(400).json({message:'unauthorized user'})
            }
        } else{
            console.log('emailId required')
            res.status(400).json({message:'emailId required'})
        }
    }else{
        console.log('Session expired')
        res.status(302).json({message:'Session expired'})
    }
}

//session validations for already logged in user
const activeAuthentication=(req,res, next)=>{
console.log('...Running Authentication Validation method...')
const sessionId = get(req.session, 'userId', null)
if(isEmpty(sessionId)){
    console.log('Authentication Validation successfull')
    next();
}else{
    console.log('Authentication Validation failure')
    res.status(400).json({message:'LoggedIn User, cannot  perfrom this task'})
}
}

module.exports ={
    authenticate,
    activeAuthentication
}