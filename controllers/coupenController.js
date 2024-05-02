
//  Import User Modal :-
const User = require("../models/userModel");

//  Import Product Modal :-
const Product = require("../models/product");

//  Import Category Modal :-
const Category = require("../models/category");

//  Import Order Modal :-
const Order = require("../models/order");

//  Import Cart Modal :-
const Cart = require("../models/cart");

//  Import Wallet Model :-
const Wallet = require("../models/wallet");

//  Coupen Modal :-
const Coupen = require('../models/coupen_model');

//  User

const loadCoupen = async (req, res) => {
    
    try {
        
        const categoryData = await Category.find({ is_Listed: true });

        if (req.session.user) {

            const msg = req.flash('flash')

            const coupenData = await Coupen.find({ status: true });
            
            res.render("coupen", { login: req.session.user, categoryData, coupenData, msgg: msg });

        } else {

            res.redirect('/login');

        }
        
    } catch (error) {

        console.log(error.message);
        
    }

};

//  User

const coupenCheck = async (req, res) => {
    
    try {

        const inpValue = req.body.inpVal

        const checkCoupen = await Coupen.findOne({ coupenId: inpValue });

        if (checkCoupen) {
            
            res.send({ succ: true })

        } else {

            res.send({ fail: true })

        }

    } catch (error) {

        console.log(error.message);
        
    }

};

//  Admin

const loadAdminCoupen = async (req, res) => {
    
    try {

        const msg = req.flash("good");

        const coupenData = await Coupen.find();

        res.render("adminCoupon", { coupenData , msgg : msg});
        
    } catch (error) {

        console.log(error.message);
        
    }

};

//  Admin

const addCoupen = async (req, res) => {
    
    try {

        const { coupon, min, max, discount } = req.body;

        const newId = generateCoupenId()

        const createCoupen = new Coupen({

            name: coupon,
            discountt: discount,
            from: min,
            to: max,
            coupenId: newId,
            image: req.files[0].filename

        })
        
        if (createCoupen) {
            
            createCoupen.save();
            req.flash("flash", "good");
            res.redirect("/admin/adminCoupen");

        }

    } catch (error) {

        console.log(error.message);
        
    }

};

//  Admin 

const coupenAction = async (req, res) => {
    
    try {

        const copId = req.query.id

        const changeStatus = await Coupen.findOne({ _id: copId });

        changeStatus.status = !changeStatus.status
        changeStatus.save()
        
    } catch (error) {

        
    }

};

//  Using Coupen

const useCoupen = async (req, res) => {
    
    try {

        const coupenIdd = req.body.coupen;
        
        const coupen = await Coupen.findOne({ coupenId: coupenIdd, status: true });

        // if (coupen) {
            
            const cartData = await Cart.findOne({ userId: req.session.user._id });

        //     const exist = await User.findOne({ _id: req.session.user._id, applyCoupen: { $in: [coupen.coupenId] } });

            // if (!exist) {
                
                const cartPrice = cartData.Total_price;  //  CartPrice
                const coupenDis = coupen.discountt     //  Coupen Discount
                
                if (coupen) {
                            
                    const offerValue = Math.round((cartPrice) - (cartPrice * coupenDis / 100));
                    const discountedValue = cartPrice - offerValue
                
                    const updateCart = await Cart.findOneAndUpdate({ _id: cartData._id }, { $set: { Total_price: offerValue, coupenDisPrice: discountedValue, percentage: coupen.discountt } }, { new: true });
                    // await User.findOneAndUpdate({ _id: req.session.user._id }, { $push: { applyCoupen: coupen.coupenId } });
                
                    if (updateCart) {
                               
                        req.flash("flash", "coupen");
                        res.redirect("/checkout");
                
                    }
                }

            // } else {

            //     req.flash('flash', 'usedOne');
            //     res.redirect("/cart");

            // }

        // } else {

        // }
        
    } catch (error) {

        console.log(error.message);
        
    }

};

//  Used Coupen Removing

const remove = async (req, res) => {
    
    try {

        const userIdd = req.session.user._id

        const cartData = await Cart.findOne({ userId: userIdd });

        const addPrice = cartData.coupenDisPrice

        const updateCart = await Cart.findOneAndUpdate({ userId: userIdd } , { $inc: { Total_price: addPrice}});

        const updateCartt = await Cart.findOneAndUpdate({userId : userIdd} , {$set : {coupenDisPrice : 0 , percentage : 0}})

        // await User.findOneAndUpdate({ _id: userIdd }, { $pop: { applyCoupen: 1 } }); //  Remove Coupen Id in User Side
        
        if (updateCart && updateCartt) {
            
            res.send({ succ: true });
        }
        
    } catch (error) {

        console.log(error.message);
        
    }

};

//  Admin Delete Coupen

const deleteCoupen = async (req, res) => {
    
    try {

        const copId = req.query.id

        const deletCoupen = await Coupen.deleteOne({ _id: copId });

        if (deletCoupen) {
            
            res.send({ succ: true });

        } 
                
    } catch (error) {

        console.log(error.message);
        
    }

};

//  Coupen Id Generating

const generateCoupenId = () => {

    const look = '123456789G'
    let ID = ''
    
    for (let i = 0; i < 6; i++) {

        ID += look[Math.floor(Math.random() * 10)];

    };

    return ID

}

module.exports = {

    loadCoupen,
    coupenCheck,
    loadAdminCoupen,
    addCoupen,
    coupenAction,
    useCoupen,
    remove,
    deleteCoupen
}