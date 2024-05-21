//  connecting mongodb

const mongoose = require('mongoose')
// mongoose.connect('mongodb://localhost:27017/AUDIOFYX')
mongoose.connect('mongodb+srv://junaidkallil:junaid123@cluster0.4kkcyad.mongodb.net/AUDIOFYX')

const session = require ('express-session')
const express= require('express')
const path = require('path')

const nocashe = require('nocache')

const flash = require('express-flash')

const app=express()

app.use(express.static(path.join(__dirname,'public')))

app.use(session({
    secret: 'your_secret_key',
    resave: false,
    saveUninitialized: true
  }));
  
app.use(flash())

app.use(nocashe())

const adminRoute = require('./router/adminRoute')
app.use('/admin',adminRoute)

const userRoute = require('./router/userRoute');
app.use('/',userRoute)



// const PORT = 4000;

const server = app.listen(4000, () => {
    console.log(`Server is running on http://localhost:4000`);
});





