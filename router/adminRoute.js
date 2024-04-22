
const express =require ('express')

const admin_route = express()

admin_route.set('view engine','ejs')
admin_route.set('views','./views/admin')

const adminController = require('../controllers/adminController')
const productController = require('../controllers/productController');
const catogaryController=require('../controllers/categaryController')
const admin_order = require('../controllers/adminOrderController')
const adminOffer = require('../controllers/admin_offer')
const coupen_controller = require('../controllers/coupenController')

//admin middleware

const adminAuth = require('../middleware/adminAuth')


//  Path :-
const path = require('path');

//  Multer :-
const multer = require('multer');

const storage = multer.diskStorage({

    destination: (req, file, cb) => {
        
        cb(null, path.join(__dirname, '../public/productImage'));
    },
    
    filename: (req, file, cb) => {
      
        const name = Date.now() + ' - ' + file.originalname;
        cb(null, name);
        
    },
    
});

const upload = multer({

    storage: storage,
    
    fileFilter: (req, file, cb) => {
      
        cb(null, true);
        
    },
    
});



admin_route.use(express.json())
admin_route.use(express.urlencoded({extended:true}))

admin_route.get('/',  adminAuth.isLogout,adminController.AdminLogin)
admin_route.post('/login',adminController.verifyAdmin)

admin_route.get('/dashboard' , adminController.loaddashboard)

admin_route.get('/users', adminAuth.isLogin , adminController.loadusers)

admin_route.get('/users/:id',adminController.userAction)


// load category

admin_route.get('/category', adminAuth.isLogin , adminController.adminCategory)

// // admin logout 

admin_route.post('/logout',adminController.adminLogout)


//__________________ category routes


admin_route.post('/category',catogaryController.addCategory)

// edit category

admin_route.put('/category',catogaryController.editCategory)

// category action

admin_route.put('/categoryaction',catogaryController.categaryAction)


// load products

admin_route.get('/products',adminAuth.isLogin,productController.loadProducts)

// add products (Get)

admin_route.get('/productsAdd',adminAuth.isLogin,productController.loadAddproduct)

// add products (post)

admin_route.post('/productsAdd', upload.array('images', 3),productController.addProducts)


// edit product 
admin_route.get('/editProduct',productController.loadeditProduct)

//product list  

admin_route.put('/productStatus',productController.productStatus)

// product Edit

admin_route.post('/productedit/:id',upload.fields([{ name: 'image0', maxCount: 1 }, { name: 'image1', maxCount: 1 }, { name: 'image2', maxCount: 1 }]),productController.editProduct)


//  Admin Orders List (get)
admin_route.get('/orders', admin_order.loadOrderss);

//  Admin Orders Details (post)
admin_route.get('/ordDetails', admin_order.ordersDetails);

//  Admin OrderStatus Handling (put)
admin_route.put("/orderStatusHandling", admin_order.orderProstatus);

admin_route.post("/retordmanage",admin_order.returnorderManage)


//  Admin Coupen (get)
admin_route.get('/adminCoupen', coupen_controller.loadAdminCoupen);

//  AddCoupen (post)
admin_route.post('/addCoupen', upload.array('image', 1), coupen_controller.addCoupen);

//  DeleteCoupen (put)
admin_route.put("/deletCoupen", coupen_controller.deleteCoupen);


//  Admin Offer Section :-

//  loadIffer (get)
admin_route.get('/adminOffer', adminOffer.loadOffer);

//  addOffer (post)
admin_route.post('/addOffer', adminOffer.addOffer);

//  offerRenove (put)
admin_route.put('/offerRemove', adminOffer.offerRemove);












module.exports = admin_route

