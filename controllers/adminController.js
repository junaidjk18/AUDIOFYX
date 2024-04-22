const User = require ('../models/userModel')
const category=require('../models/category');
const bcrypt = require ('bcrypt')


const AdminLogin = async(req,res)=>{
    try {
        const flash = req.flash('flash')
        res.render('login',{msg : flash})
    } catch (error) {
        console.log(error.message);
    }
}

const verifyAdmin = async (req,res)=>{

    try {

        const newemail = req.body.email
        const newpassword = req.body.password
        const adminCheck = await User.findOne({email : newemail,is_Admin :true})
        // console.log(admin);
        
        if(adminCheck){
        

            const  passswordMatch = await bcrypt.compare(newpassword,adminCheck.password)
            
            if(passswordMatch){
        
                    req.session.admin = adminCheck
            res.redirect('/admin/dashboard')
        }
        else{
            res.redirect('/admin')
        
        
        }
    }  
   
    } catch (error) {
        console.log(error.message);
    }
}

const loaddashboard = async(req,res)=>{
    try {
        res.render('dashboard')
    } catch (error) {
        console.log(error.message);
    }
} 

// admin logout

const adminLogout =async ( req , res ) => {
    
    try {
        console.log('gh');
        req.session.admin = undefined

        req.flash('flash','logout succcessfully...')
        res.redirect('/admin')

        
    } catch (error) {
        
    }
} 

const loadusers = async(req,res)=>{
    try {
        //page navigation

        const limit = 5;
        const page = parseInt(req.query.page) || 1
        const skip = (page -1 ) * limit;

        const totalusercount = await User.countDocuments({is_Admin : 0})
        const totalPages = Math.ceil(totalusercount / limit)

        const userData = await User.find({is_Admin : false})

        .skip(skip)
        .limit(limit)

        // res.render('usersList')

        res.render('usersList',{clint : userData, currentPage : page,totalPages})
        // const userData = await Admin.find({is_Admin:false})
    } catch (error) {
        console.log(error.message);
    }
}

const adminCategory = async (req, res) => {

    try {
  
        
  
        const limit = 5;
        const page = parseInt(req.query.page) || 1;
        const skip = (page - 1) * limit;

        const totalCatCount = await category.countDocuments();
        const totalPages = Math.ceil(totalCatCount / limit);
  
        const categoryData = await category.find()
  
        .skip(skip)
        .limit(limit);
  
        res.render("categary" , {category : categoryData ,  currentPage: page, totalPages});
        
    } catch (error) {
        
        console.log(error.message);
  
    }
  
  };
  



// user action

const userAction = async ( req, res) =>{
    
    try {
        console.log('hello')
        const userId =req.params.id
        //    const user=await User.findOne({_id:userId});
        //    user.is_blocked=!user.is_blocked;
        const blockedUser = await User.findOne({_id:userId,is_blocked:true})
        const activeUser = await User.findOne({_id:userId,is_blocked:false})

        if(activeUser){

            const useraction = await User.findByIdAndUpdate({_id:userId},{$set:{is_blocked:true}})
           
        }else{

            const useraction = await User.findByIdAndUpdate({_id:userId},{$set:{is_blocked:false}})
           
        }

        
    } catch (error) {
        
        console.log(error.message);

    }
}






module.exports = {
    AdminLogin,
    verifyAdmin,
    loaddashboard,
    loadusers,
    userAction,
    adminLogout,
    adminCategory,
}