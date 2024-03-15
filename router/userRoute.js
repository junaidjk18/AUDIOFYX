const express = require ('express')
const user_route = express();

user_route.set('view engine','ejs')
user_route.set('views','./views/users')

const userController= require('../controllers/userController')

user_route.use(express.json())
user_route.use(express.urlencoded({extended:true}))

user_route.get('/',userController.loadhome)

user_route.get('/login',userController.loadLogin)
user_route.post('/login',userController.verifyLogin)

user_route.get('/register',userController.loadRegister)
user_route.post('/signup',userController.insertUser)

user_route.get('/otp',userController.loadotp)
user_route.post('/verifyotp',userController.verifyOtp)

user_route.get('/aboutus',userController.aboutus)

user_route.get('/product',userController.products)

user_route.get('/catagory',userController.catagory)

user_route.get('/contact',userController.contact)

user_route.get('/resendOtp',userController.loadresendotp)

module.exports = user_route
