const nodemailer = require('nodemailer')


const PostModel = require('./Models/Post')
const UserOtpVerificationModel = require('./Models/UserOtpVerification')

//pagination for records
const pagination=async(req,res)=>{
    const emailId = req.body.emailId
    const page = parseInt(req.query.page);
    const limit = parseInt(req.query.limit);
    let startIndex =(page-1)*limit
    let endIndex = page*limit
    let paginatedResults={}
    if(endIndex<  await PostModel.find({emailId}).countDocuments()){
        paginatedResults.nextPage ={
            page:page+1,
            limit:limit
        }
    }
    if(startIndex>0){
        paginatedResults.previousPage ={
            page:page-1,
            limit:limit
        }
    }
    paginatedResults.result= await PostModel.find({emailId}).limit(limit).skip(startIndex)
    return  paginatedResults
}

//sent otp via mail
const sendOTPVerificationEmail = async (req, res, emailId) => {
    console.log('...Running Send OTP method...')
    try {
        const otp = Math.floor(1000 + (Math.random() * 9000));
        //establishing connection for nodemailer
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL,
                pass: process.env.PSD
            },
            tls: {
                rejectUnauthorized: false
              }
        })
        const mailOptions = {
            from: process.env.EMAIL,
            to: emailId,
            subject: 'Verify Hour Email',
            html: `<p>Enter <b>${otp}</b> in the app to verify the email address. This code <b>expires in 5 mints</b>.</p>`
        }
        await transporter.sendMail(mailOptions) //sendmail to user
        const date=new Date()
        await UserOtpVerificationModel.create({
            userId: emailId,
            otp: otp,
            createdAt: date,
            expiresAt: new Date(date.getTime()+300000)
        })
        req.session.userId=emailId
        console.log('otp send successfully ')
        res.json({
            status: 'PENDING',
            message: "Verfication otp email sent",
            data: {
                emailId
            }
        })
    } catch (error) {
        console.log('otp send failure ', error)
        res.json({
            status: 'FAILED',
            message: error.message
        })
    }
}

module.exports ={
    pagination,
    sendOTPVerificationEmail
}