const express = require ('express')
const user_route = express();

user_route.set('view engine','ejs')
user_route.set('views','./views/users')

const userController= require('../controllers/userController')

const address_controller = require('../controllers/addressController')

const profile_controller = require('../controllers/userprofile')

const cart_controller = require ('../controllers/cartController')

const checkout_controller = require('../controllers/checkoutController')

const orders_controller = require('../controllers/orderController')

const user_wishlist = require('../controllers/wishlist-constroller')

const user_coupen = require ('../controllers/coupenController')

const user_auth = require('../middleware/userAuth')

user_route.use(express.json())
user_route.use(express.urlencoded({extended:true}))

user_route.get('/', userController.loadhome)

user_route.get('/login', user_auth.loginUser, userController.loadLogin)
user_route.post('/login',userController.verifyLogin)

user_route.get('/register', userController.loadRegister)
user_route.post('/signup',userController.insertUser)

user_route.get('/otp',userController.loadotp)
user_route.post('/verifyotp',userController.verifyOtp)

user_route.get('/aboutus',userController.aboutus)

user_route.get('/product',userController.products)

user_route.get('/productDetails',userController.productDetails)

//  Search Producct (put)
user_route.put("/searchProduct", userController.searchProduct);

user_route.put('/lowTohigh',userController.priceLowToHigh)

user_route.put('/highTolow',userController.priceHighToLow)

//  Price Filter (put)
user_route.put('/priceFilter', userController.priceFilter);

//  SortProName (put)
user_route.put("/sortProduct", userController.proNameSortAZ);

user_route.put('/sortProduct2',userController.proNameSortZA)

//  wallet (get)
user_route.get('/Wallet', userController.loadWallet);

//__________ user profile 
user_route.get('/profile',profile_controller.profileLoad)

// edit user profile 
user_route.post('/editProfile',profile_controller.editProfile)
// change password
user_route.post('/editPassword',profile_controller.passCange)



// aadd address show 
user_route.get('/Address',address_controller.loadAddress)
// add post 
user_route.post('/addAddress',address_controller.addAddress)
// delete address 
user_route.post('/deleteAdd',address_controller.deleteAddress)

user_route.put("/editAddress", address_controller.editAddress);
// edit address update
user_route.post("/verifyEditAddress", address_controller.verifyEditAddress);

// cart load
user_route.get('/cart',cart_controller.cart)

// add cart
user_route.post('/addcart',cart_controller.addCart)

//cart edit

user_route.put('/cartUpdate' , cart_controller.cartEdit)

//  deleteCart 
user_route.put('/deleteCart' , cart_controller.deleteCart);

//  Cart Count (post)
user_route.post("/cartAction", userController.cartAction);

//  Coupen Section :-

//  Coupen (get)
user_route.get('/coupen', user_coupen.loadCoupen);


//  coupenCheck (post)
user_route.post("/coupenCehck", user_coupen.coupenCheck);

//  useCoupen (post)
user_route.post('/useCoupen', user_coupen.useCoupen);

//  removeCouepn (put)
user_route.put('/removeCop', user_coupen.remove);

//  checkout (get)
user_route.get('/checkout', checkout_controller.loadCheckout);

//  verifychekout Add Address (post)
user_route.post("/verifyChekutAdss", checkout_controller.verifyCheckOutAddress);

//  editAddressCheckout (put)
user_route.put("/editAddressCheckout", checkout_controller.editAddress);

//  verifyEditAddressCheckout (post)
user_route.post('/verifyEditAddCheckout', checkout_controller.verifyEditAddress);

user_route.post('/chooseAddress' , checkout_controller.chooseAddress)

//  deleteAddress (post)
user_route.post('/deleteCheckAdd', checkout_controller.deleteAdd);

//  razorPay (post)
user_route.post("/razorPay", checkout_controller.RazorPay);

//  Wishlist Section :-

//  wishList (get)
user_route.get('/wishlist', user_wishlist.loadWishlist);

//  addWishlist (post)
user_route.post('/addWishlist', user_wishlist.addWishlist);

//  removeWishlist (put)
user_route.put('/removeWishlist', user_wishlist.removeWishlist);

//  load Orders (get)
user_route.get('/orders',  orders_controller.loadOrder);

//  orderDetails (get)
user_route.get("/orderDetails", orders_controller.orderView);

user_route.get('/thanks',orders_controller.loadsuccess)


//  cancelOrder (post)
user_route.post('/cancelOrd', orders_controller.orderCancel);


//  returnOrder (post)
user_route.put('/returnOrd', orders_controller.returnOrd);

//  Order Kitty (post)
user_route.post('/getOrder', orders_controller.orderKitty);

//  Download Invoice
user_route.get("/downloadInvoice", orders_controller.downloadInvoice);

user_route.get('/category/:id',userController.loadcategory)

user_route.get('/contact',userController.contact)

user_route.get('/resendOtp',userController.loadresendotp)

user_route.post('/logout',userController.logout)


module.exports = user_route
