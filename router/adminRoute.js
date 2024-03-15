
const express =require ('express')

const admin_route = express()

admin_route.set('view engine','ejs')
admin_route.set('views','./views/admin')

const adminController = require('../controllers/adminController')
// const productController = require('../controllers/productController')
const catogaryController=require('../controllers/categaryController')

admin_route.use(express.json())
admin_route.use(express.urlencoded({extended:true}))

admin_route.get('/',adminController.AdminLogin)
admin_route.post('/login',adminController.verifyAdmin)

admin_route.get('/dashboard',adminController.loaddashboard)

admin_route.get('/users',adminController.loadusers)
admin_route.get('/users',adminController.userAction)


// load category

admin_route.get('/category',adminController.adminCategory)

// // admin logout 

admin_route.post('/logout',adminController.adminLogout)


//__________________ category routes


admin_route.post('/category',catogaryController.addCategory)

// edit category

admin_route.put('/category',catogaryController.editCategory)

// category action

admin_route.put('/categoryaction',catogaryController.categaryAction)

// _________________add brand

// admin_route.post('/addBrands',catogaryController.addBrand)












module.exports = admin_route

