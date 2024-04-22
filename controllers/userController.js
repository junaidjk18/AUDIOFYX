const User = require('../models/userModel')
const bcrypt = require('bcrypt')

const Otp = require('../models/otpmodel')

const nodemailer = require('nodemailer')

// const product = require('../models/product')
const category = require('../models/category')

const cart = require('../models/cart')
const product = require('../models/product')

const Wallet = require('../models/wallet')


const securePassword = async (password)=>{
    try {
        const passwordhash = await bcrypt.hash(password,10)
        return passwordhash
    } catch (error) {
        console.log(error.message);
    }
}

const loadRegister = async(req,res)=>{

    try {
        const categoryData = await category.find({is_listed: true})

        const error = req.flash('flash')
        res.render('registration',{msg : error ,categoryData})
        
    } catch (error) {
        console.log(error.message);
    }
}


//fetch userdata and store the data into database:- (post of registration)
const insertUser = async(req,res)=>{
   
    try {
        // console.log('here i am')
        const emailExist = await User.findOne({email:req.body.email});

        if(emailExist)
        {
            req.flash('flash','email already exist')
            res.redirect('/register')

        }else{
                    
        const user = new User({

            username : req.body.fullName,
            email : req.body.email,
            password : req.body.password,
            phone : req.body.phone,
            is_Admin : false

        })

        req.session.userSession = user
        const userData = req.session.userSession

        console.log(userData + "ahyy");

        if(userData){
          
            const OTPP = generateOTP();
            console.log('First OTP :-' + OTPP);
            sendotpmail(req.body.name,req.body.email,OTPP,res);

        }else{

            req.flash('flash','something')
            res.redirect('/register')
        }

    }

    } catch (error) {
        console.log(error.message);
    }
}

const loadotp = async(req,res)=>{

    try {
        const categoryData = await category.find({is_listed: true})

        const emailQuery=req.query.email;
        const msg = req.flash('flash')
        res.render('otp' , {emailQuery , msgg : msg,categoryData})

    } catch (error) {

        console.log(error.message);

    }

}

const verifyOtp=async(req,res)=>{

    try{

        const querymail=req.body.email

        const userSessionn = req.session.userSession;
        // console.log(req.session.userSession);
        const {inp1,inp2,inp3,inp4}=req.body

        const enterdOtp=`${inp1}${inp2}${inp3}${inp4}`

        const verifyedOtp= await Otp.findOne({userEmail:querymail,otp:enterdOtp})

        if(verifyedOtp){

        if(querymail){

            const hashPassword = await securePassword(userSessionn.password);

            if(hashPassword){

                const userr = new User({

                    username : userSessionn.username,
                    email : userSessionn.email,
                    password : hashPassword,
                    phone : userSessionn.phone,
                    is_Admin : false
        
                })

                userr.save()
                const updating=await User.findOneAndUpdate({email:querymail},{$set:{is_Verified:true}});

                if(updating){

                    res.redirect('/login')

                }


            }

        }else{
            console.log('email not match');
        }

    }else{
        req.flash('flash' , "Invalid OTP!!!")
        res.redirect('/otp')
    }

    }catch(error){

    }
   
}


const sendotpmail = async (name,email,otpp,res)=>{

        console.log('vannood');

    try {
        //send mail method  
        const transporter = nodemailer.createTransport({
            service : 'gmail',

            auth:{

                user : 'junaidkallil75@gmail.com',
                pass : "dury hrqe vfdi kkuz"
            }

        })

        //compose email
        const mailoption = {

        from : 'junaidkallil75@gmail.com',
        to : email,
        subject : `For OTP verification`,
        html : `<h3> Hello ${name} welcome to AUDIOFYX </h3>
        <br><p>enter ${otpp} on the signup page to register</p>`

        }

        //send email
         transporter.sendMail(mailoption,function(error,info)
    
        {
            if(error)
            {
                console.log('error sending email:',error);
            }
            else
            {
                console.log('email has been sended',info.response);
            }
        })

        //otp schema adding in dbs

        const newuserotp = new Otp({
            userEmail : email,
            otp : otpp
        });

        await newuserotp.save();  //otp saved in dbs

        // calling otp page and also passing query to the page

        res.redirect(`/otp?email=${email}`);

      
    } catch (error) {
        console.log(error.message);
    }
}

const loadresendotp = async(req,res)=>{

    try {

        console.log("start");

        const userdata = req.query.email; //query mail
        const usersession = req.session.userSession  //session user data

        console.log(usersession.email + "neee");
        console.log(userdata + "njan");

        if(usersession.email == userdata)
        {
            console.log("hai");
            const generatedOTP = generateOTP()
            console.log(generatedOTP + 'Re-send otp');

            await sendotpmail(usersession.name,usersession.email,generatedOTP ,res)

            setTimeout(async ()=>{   //deleting otp from db

                await Otp.findOneAndDelete({email  :userdata})

            },60000)

        }

    } catch (error) {

        console.log(error);

    }

}


const loadLogin = async(req,res)=>{
    try {
        const categoryData = await category.find({is_listed: true})
        const error = req.flash('flash')

        res.render('login' , {msg : error , login : req.session.user,categoryData});

    } catch (error) {
        console.log(error.message);
    }
}

//login post
const verifyLogin = async(req,res)=>{
    try {
        // console.log('h');
        const newemail = req.body.email
        
        const password = req.body.password
        

        const userData = await User.findOne({email:newemail , is_Admin : false , is_blocked : false})
        
        if(userData)

        {
            // console.log('hi');

           const passswordMatch = await bcrypt.compare(password,userData.password)
        //    console.log(passswordMatch,'uuuuuuuuuuuuuuuuu');
           if(passswordMatch)
           {
            //  req.session.user_id = userData._id
            //  console.log('jjj');
            req.flash('flash' , "Login Successfully")
            req.session.user = userData
             res.redirect('/')
           }
           else{
            req.flash('flash','wrong password')
            res.redirect('/login')
           }

        }
        else{
            req.flash('flash','wrong email')
            res.redirect('/login')
        }

    } catch (error) {
        console.log(error.mess);
    }

}

const loadhome = async(req,res)=>{
    try {
        const categoryData = await category.find({is_listed: true})
        if(req.session.user){
           

            res.render('home' , {login : req.session.user,categoryData});

        } else {

            res.render('home',{categoryData})

        }
      
       
    } catch (error) {
        console.log(error.message);
    }
}




const aboutus = async(req,res)=>{
    try {
        const categoryData = await category.find({is_listed: true})
        res.render('about' , {login : req.session.user,categoryData})
    } catch (error) {
        
    }
}


const contact = async(req,res)=>{

    try {
        const categoryData = await category.find({is_listed: true})
        res.render('contact' , {login : req.session.user,categoryData})
    } catch (error) {
        
    }
}

const products = async(req,res)=>{
    try {

        const producDataa = await product.find({status :true}).populate('category')
        // console.log(producData);
        const categoryData = await category.find({is_listed: true})

        res.render('product' , {login : req.session.user, producData : producDataa,categoryData})

    } catch (error) {
        console.log(error.message);
    }
}
const catagory = async(req,res)=>{
    try {
        const categoryData = await category.find({is_listed: true})
        console.log(categoryData);
        res.render('catagory' , {login : req.session.user,categoryData})
    } catch (error) {
        
    }
}

const productDetails = async (req, res) => {
    
    try {

        const id = req.query.id;

        const categoryData = await category.find({ is_listed: true });      //  Category

        const productData = await product.findOne({ _id: id });     //  Product
        console.log(productData)
        
        if (req.session.user) {
            
            res.render("productDetails", { login: req.session.user , categoryData , productData});

        } else {

            res.render("productDetails", { categoryData , productData});

        }
        
    } catch (error) {

        console.log(error.message);
        
    }

}

//  CartAction (Get Method) :-

const cartAction = async (req, res) => {
    
    try {

        if (req.session.user) {
            
            const userIdd = req.session.user._id;

            const cartAcction = await cart.findOne({ userId: userIdd });

            const val = cartAcction.product.length;

            res.send({ success: val });

        } else {

            res.send({success : 0})

        }
       
    } catch (error) {

        console.log(error.message);
        
    }

};

//  Search Product  :-

const searchProduct = async (req, res) => {

    try {
      
        const findProduct = req.body.items
        
        const searchedItem = await product.find({ name: { $regex: new RegExp(`.*${findProduct}.*`, 'i') } }).populate('category');  
  
        console.log(searchedItem)

        res.send(searchedItem);
    
    } catch (error) {
        
        console.log(error.message);
      
    }
  
};

const priceLowToHigh = async(req,res)=>{
    try {
        // console.log('ddddd');
        const {status} = req.body

        if(status)
        {
            const smallToHigh = await product.find({status : true}).sort({price : 1}).populate('category')

            res.send(smallToHigh)
        }
        
    } catch (error) {
        console.log(error.message)
    }
}

const priceHighToLow = async(req,res)=>{
    try {
        const {status} = req.body

        if(status)
        {
            const HighToSmall = await product.find({status : true}).sort({price :-1}).populate('category')
            res.send(HighToSmall)
        }
    } catch (error) {
        console.log(error.message);
    }
}

//  Acending Order Product Name (PUT Method) :-

const proNameSortAZ = async (req, res) => {
    
    try {

        const { status } = req.body;

        if (status) {
            
            const productSmallToHigh = await product.find({ status: true }).sort({ name: -1 }).populate('category');

            res.send(productSmallToHigh);

        }
        
    } catch (error) {

        console.log(error.message);
        
    }

};

//Decending order product name(PUT method)

const proNameSortZA = async (req, res) => {
    
    try {

        const { status } = req.body;

        if (status) {
            
            const productSmallToHigh = await product.find({ status: true }).sort({ name: 1 }).populate('category');

            res.send(productSmallToHigh);

        }
        
    } catch (error) {

        console.log(error.message);
        
    }

};


//  Price Filter (Put Metthod) :-

const priceFilter = async (req, res) => {
    
    try {

        const minn = req.body.min
        const maxx = req.body.max

        if (minn && maxx) {
                
            const productPrice = await product.find({ $and: [{ price: { $lt: Number(maxx) } }, { price: { $gt: Number(minn) } }] }).populate('category')

            if (productPrice) {
                
                res.send({ success: productPrice });

            } else {

                res.send({fail : "failed"})

            }

        } else {

            res.send({fail : "failed"})

        }

    } catch (error) {

        console.log(error.message);
        
    }

};

//  LoadWallet (Get Method) :-

const loadWallet = async (req, res) => {
    
    try {

        const categoryData = await category.find({ is_Listed: true });

        if (req.session.user) {

            const walletData = await Wallet.findOne({ userId: req.session.user._id });
            console.log(walletData);

            res.render('wallet', { login: req.session.user, categoryData, walletData });

        } else {

            res.redirect('/login')

        }
        
    } catch (error) {

        console.log(error.message);
        
    }

};






//function : generate otp
const generateOTP = ()=>{

    const digits = '0123456789'
    let OTP = '';
    for(let i=0;i<4;i++)
    {
        OTP += digits[Math.floor(Math.random()*10)]
    }
    return OTP
}

const logout = async(req,res)=>{
    try {
        req.session.destroy()
        res.redirect('/')
    } catch (error) {
        console.log(error.message);
    }
}


module.exports = {
    loadRegister,
    insertUser,
    loadotp,
    sendotpmail,
    loadLogin,
    verifyLogin,
    loadhome,
    verifyOtp,
    aboutus,
    products,
    catagory,
    contact,
    loadresendotp,
    productDetails,
    cartAction,
    searchProduct,
    priceLowToHigh,
    priceHighToLow,
    priceFilter,
    proNameSortAZ,
    proNameSortZA,
    loadWallet,
    logout
}  