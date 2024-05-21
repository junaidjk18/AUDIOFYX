//  Import Address Modal :-
const Address = require("../models/address");

//  Import User Modal :-
const User = require("../models/userModel");

//  Import Product Modal :-
const Product = require("../models/product");

//  Import Category Modal :-
const Category = require("../models/category");

const Wallet = require('../models/wallet')

//  Cart
const Cart = require('../models/cart');

const razorPay = require('./razorpay');

const order = require('../models/order')

//    Load Checkout (Get Method) :-

const loadCheckout = async (req, res) => {
    
    try {

        const categoryData = await Category.find({ is_Listed: true });

        if (req.session.user) {

            const msg = req.flash('flash');

            const userData = await User.findById({ _id: req.session.user._id });

            console.log(userData);

            const addresData = await Address.findOne({ userId: req.session.user._id });
            // console.log(addresData);

            const cartDataa = await Cart.findOne({ userId: req.session.user._id }).populate('product.productId');

            console.log(cartDataa);

            

            if (cartDataa) {

                const walletDataa = await Wallet.findOne({userId : req.session.user})
                
                const newTprice = cartDataa.product.reduce((acc, val) => acc + val.price, 0);
                
                const cartData = await Cart.findOneAndUpdate({ userId: req.session.user._id }, { $set: { totalCartPrice: newTprice } }, { upsert: true, new: true });
                            
                res.render("checkout", { login: req.session.user, categoryData, addres: addresData, userData, msgg: msg, cartData , walletDataa});
                
            } else {

                res.redirect('/login')

            }

        } else {

            res.redirect('/login')


        }

    } catch (error) {

        console.log(error.message);
        
    }

};

//  VerifyCartAddress (Post Method) :-

const verifyCheckOutAddress = async (req, res) => {

    try {
          
        const userId = req.query.id
                  
        const exist = await Address.findOne({ userId: userId, addresss: { $elemMatch: { address: req.body.addressData.address } } });

        if (!exist) {
            
            const verifyAddress = await Address.findOneAndUpdate(
            
              { userId: req.query.id },

              {
                  $addToSet: {
                    
                  addresss: {
                        
                        name: req.body.addressData.name,
                        city: req.body.addressData.city,
                        state: req.body.addressData.state,
                        pincode: req.body.addressData.pincode,
                        phone: req.body.addressData.phone,
                        locality: req.body.addressData.locality,
                        address: req.body.addressData.address,
                        status: true,
                    
                      },
                      
                  },
                  
                },
              
                { new: true, upsert: true }
              
            );
            
            if (verifyAddress) {
                
                res.send({success : true});

            } else {

                console.log("error aneeee");

            }
            
        } else {

            res.status(400).send({ exist: true });

        }
        
    } catch (error) {

        res.status(400);
        console.log(error.message);
        
    }

};

//  Delete Address (Post Method) :-

const deleteAdd = async (req, res) => {
    
    try {

        const userId = req.query.id
        const addId = req.query.addId

        const deleteAdd = await Address.updateOne({ userId: userId }, { $unset: { addresss: { _id: addId } } });

        if (deleteAdd) {
            
            res.send(true);

        }
        
    } catch (error) {
        
    }

}

//  Edit Address (Put Method) :-

const editAddress = async (req, res) => {
    
    try {

        const { edit } = req.body;
        const editData = await Address.findOne({ 'addresss._id': edit }, { 'addresss.$': 1 });
        
        res.json({ editData });
        
    } catch (error) {

        console.log(error.message);
        
    }

};

//  Verify Edit Address (Post Method) :-

const verifyEditAddress = async (req, res) => {
    
    try {

        const userId = req.session.user._id;

        const { name, phone, locality, pincode, address, city, state, id } = req.body;

        const editAddress = await Address.findOneAndUpdate({ userId: userId, 'addresss._id': id }, { $set: { 'addresss.$.name': name, 'addresss.$.phone': phone, 'addresss.$.locality': locality, 'addresss.$.pincode': pincode, 'addresss.$.address': address, 'addresss.$.city': city, 'addresss.$.state': state } });

        if (editAddress) {
            
            req.flash('flash', 'Address Edited');
            res.redirect('/checkout');

        }
        
    } catch (error) {

        console.log(error.message);
        
    }

};

//  Choosee Address (Post Method) :-

const chooseAddress = async (req, res) => {
    
    try {

        console.log("j");

        const addId = req.query.id

        const userIdd = req.session.user._id;

        const update = await Address.bulkWrite([
        
            {
              
                updateOne: {
                
                    filter: { userId: userIdd, "addresss.status": true },
                    update: { $set: { "addresss.$.status": false } },
              
                },
                
            },

            {
              
                updateOne: {
                
                    filter: { userId: userIdd, "addresss._id": addId },
                    update: { $set: { "addresss.$.status": true } },
              
                },
                
            },
          
        ]);
        
    } catch (error) {

        console.log(error.message);
        
    }

};

//  Paymen Method (RazorPay Post Method) :-

const RazorPay = async (req, res) => {
    
    try {

        const userIdd = req.session.user._id;

        if (userIdd) {

            const cartData = await Cart.findOne({ userId: userIdd });

            const addressData = await Address.findOne({ userId: userIdd });

            if (!cartData || cartData.product.length == 0) {
                
                res.send({ emptyCart: true });

            } else if (addressData.addresss.length == 0) {
                
                res.send({ noAddress: true });

            } else {

                const user = await User.findOne({ _id: req.session.user });
                const amount = req.body.amount * 100;

                console.log(user);
                console.log(amount);
        
                const options = {
        
                    amount: amount,
                    currency: "INR",
                    receipt: "absharameen625@gmail.com",
                    
                };
        
                razorPay.orders.create(options, (err, order) => {
        
                    if (!err) {
        
                        res.send({
        
                            succes: true,
                            msg: "ORDER created",
                            order_id: order.id,
                            amount: amount,
                            key_id: process.env.RAZORPAY_IDKEY,
                            name: user.fullName,
                            email: user.email,
        
                        });
        
                    } else {
        
                        console.error("Error creating order:", err);
        
                        res.status(500).send({ success: false, msg: "Failed to create order" });
                    }
        
                });

            }

        } else {

            res.redirect('/login');

        }
    
    } catch (error) {

        console.log(error.message);
        
    }

};


const failRazorpay = async (req, res) => {
    
    try {

        const userIdd = req.session.user._id

        const cart = await Cart.findOne({ userId: userIdd });

        const payMethod = req.body.payment;

        const addres = await Address.findOne({ userId: userIdd, 'addresss.status': true }, { 'addresss.$': 1 });

        const { name, phone, address, pincode, locality, state, city } = addres?.addresss?.[0] ?? {};

        const getFailedOrd = await order.create({

            userId: userIdd,

            products: cart.product.map((val) => ({

                productId: val.productId,
                quantity: val.quantity,
                price: val.price,
                orderProStatus: 'payment pending'

            })),

            deliveryAddress: {

                name: name,
                phone: phone,
                address: address,
                locality: locality,
                city: city,
                state: state,
                pincode: pincode,
            },

            orderDate: Date.now(),
            orderStatus:'payment pending',
            orderAmount: cart.Total_price,
            payment: payMethod,
            coupenDis: cart.coupenDisPrice,
            percentage: cart.percentage,

        });

        await Cart.updateOne({userId : userIdd} , {$unset : {products : 1 , coupenDisPrice : 0, percentage:0 , Total_price :0}});

        if (getFailedOrd) {

            console.log("hahaha");
            
            res.redirect("/orders");

        }
        
    } catch (error) {

        console.log(error.message); 
        
    }

};


const changeProStatus = async (req, res, next) => {
    
    try {

        const ordIdd = req.body.ordIdd

        const ord = await order.findOne({ _id: ordIdd });

        const upd = await order.findOneAndUpdate({ _id: ordIdd }, { $set: { 'products.$[].orderProStatus': 'pending' } });

        //  Stock Managing :-

        ord.products.forEach(async (e) => {
            
            let productt = await Product.findOne({ _id: e.productId });
            
            let newStock = productt.stock - e.quantity;
            
            await Product.findOneAndUpdate({ _id: e.productId }, { $set: { stock: newStock } });
            
        });

        if (upd) {
            
            res.send({ suc: true })

        }
        
    } catch (error) {

        next(error, req, res)
        
    }

};

const sucRazorpay = async (req, res, next) => {
    
    try {

        const userIdd = req.session.user._id;

        if (userIdd) {


            const user = await User.findOne({ _id: req.body.userId });
            const amount = req.body.amount * 100;
        
            const options = {
        
                amount: amount,
                currency: "INR",
                receipt: "absharameen625@gmail.com",
                    
            };
        
            razorPay.orders.create(options, (err, order) => {
        
                if (!err) {
        
                    res.send({
        
                        succes: true,
                        msg: "ORDER created",
                        order_id: order.id,
                        amount: amount,
                        key_id: process.env.RAZORPAY_IDKEY,
                        name: user.fullName,
                        email: user.email,
        
                    });
        
                } else {
        
                    console.error("Error creating order:", err);
        
                    res.status(500).send({ success: false, msg: "Failed to create order" });
                }
        
            });

        } else {

            res.redirect('/login');

        }
    
    } catch (error) {

        next(error, req, res);

        
    }

};

module.exports = {

    loadCheckout,
    verifyCheckOutAddress,
    deleteAdd,
    editAddress,
    verifyEditAddress,
    chooseAddress,
    RazorPay,
    failRazorpay,
    changeProStatus,
    sucRazorpay
    
};