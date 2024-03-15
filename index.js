//  connecting mongodb

const mongoose = require('mongoose')
mongoose.connect('mongodb://localhost:27017/AUDIOFYX')

const userRoute = require('./router/userRoute');
// const adminRoute = require('./router/adminRoute')

const session = require ('express-session')
const express= require('express')
const path = require('path')

const flash = require('express-flash')

const app=express()

app.use(express.static(path.join(__dirname,'public')))

app.use(session({
    secret: 'your_secret_key',
    resave: false,
    saveUninitialized: true
  }));
  
app.use(flash())

const adminRoute = require('./router/adminRoute')
app.use('/admin',adminRoute)

app.use('/',userRoute)



app.listen(4000,()=>{
    console.log('http://localhost:4000');
})


