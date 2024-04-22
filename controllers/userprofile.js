const User = require('../models/userModel')
const Category = require('../models/category')
const Product = require('../models/product')
const bcrypt = require('bcrypt')
const Address = require ('../models/address')


const securepassword = async (password) => {

    try {
        const passwordHash = await bcrypt.hash(password,10)
        return passwordHash
        
    } catch (error) {
        console.log(error.message);
        
    }
    
}

//__________user profile     
const profileLoad = async ( req , res ) => {
    
    try {
        // console.log('hii');
        const listedCategory = await Category.find({is_listed:true})
        const products = await Product.find({status:true})   
        const userdata = await User.findById({_id:req.session.user._id})
        const categoryData = await Category.find({is_listed: true})
        
        if(req.session.user){
            
           const flash= req.flash('flash')
            res.render('profile',{listedCategory,products,login:req.session.user,userdata,msg:flash,categoryData})
        }else{
            
            res.redirect('/login')
        }
        
    } catch (error) {
        
        
    }
}
// profile edit 

const editProfile = async ( req , res ) => {
    try {
        const id = req.query.id
       const { name , phones} = req.body
       const updateData = await User.findByIdAndUpdate({_id:id},{$set:{username:name,phone:phones}})
       if(updateData){
        req.flash('flash',"Edited Successfully")
        res.redirect('/profile')
       }
       
    } catch (error) {
        
    }
}

const passCange = async (req , res) =>{
    try {
       const oldpass = req.body.oldPass
       const newpass = req.body.newPass
       const confpass = req.body.confPass
       const user  = await User.findById({_id:req.query.id})
       const oldpassCheck = await bcrypt.compare(oldpass,user.password)  
       if(oldpassCheck&&newpass==confpass){
           const hashpass = await securepassword(confpass)
           const updatepass = await User.findByIdAndUpdate({_id:req.query.id},{$set:{password:hashpass}})
           req.flash('flash',"passchanged")
           res.redirect('/profile')
        }else{
           console.log('hi 4');
        req.flash('flash',"failed")
        res.redirect('/profile')
       }

       
    } catch (error) {
        throw error
    }
}

// ad addresss

const addAddress = async ( req , res ) => {
    try {
       
        const userZId = req.query.id
        const Newaddress = req.body.datas
        const userName = await User.findById({_id:userZId})
        const userAddress = Address.create({
            userId:userName._id,
            address : [{
                name:userName.fullname,
                city:Newaddress.city,
                state:Newaddress.state,
                pincode:Newaddress.pincode
                
            }]
        })
        
        
    } catch (error) {
        console.log(error);
    }
}

module.exports ={
    profileLoad,
    editProfile,
    passCange,
    addAddress
}