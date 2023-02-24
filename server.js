const express = require('express')
const mongoose =require('mongoose')
const session = require('express-session')

require('dotenv').config();
const appRoouter = require('./Routes/appRouter')

//establishing database connection
mongoose.connect(process.env.MONGODB_URL, {
    useNewUrlParser: true, 
    useUnifiedTopology: true,
    family: 4,
},(err)=>{
    if(!err) console.log('connected to DB')
    else console.log(err)
})

const app = express();
const port = process.env.PORT 

app.use(express.json())
app.use(session({
    secret:process.env.SESSION_SECRET,
    resave:false,
    saveUninitialized:false,
    cookie:{
         maxAge:Number(process.env.MAX_AGE)
    }
}))


//routing to app router
app.use('/app', appRoouter)
app.use('/', (req, res)=>{
    res.send('use the postman and perfrom operations using curls')
})

app.listen(port, console.log('server running...'))