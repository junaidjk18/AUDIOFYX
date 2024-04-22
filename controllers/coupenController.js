
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


const loadAdminCoupen = async (req, res) => {
    
    try {

        const msg = req.flash("good");

        const coupenData = await Coupen.find();

        res.render("adminCoupon", { coupenData , msgg : msg});
        
    } catch (error) {

        console.log(error.message);
        
    }

};

const addCoupen = async (req, res) => {
    
    try {

        const { coupon, min, max, discount } = req.body;

        const newId = generateCoupenId()

        const createCoupen = new Coupen({

            name: coupon,
            discount: discount,
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
    loadAdminCoupen,
    addCoupen,
    deleteCoupen
}