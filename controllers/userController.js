const User = require('../models/userModel')
const bcrypt = require('bcrypt')

const Otp = require('../models/otpmodel')

const nodemailer = require('nodemailer')


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
        const error = req.flash('flash')
        res.render('registration',{msg : error})
        // console.log('bbdueujd')
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

            username : req.body.name,
            email : req.body.email,
            password : req.body.password,
            phone : req.body.phone,
            is_Admin : false

        })

        req.session.userSession = user
        const userData = req.session.userSession

        if(userData){
          
            const OTPP = generateOTP();
            console.log(OTPP);
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

        const emailQuery=req.query.email;
        res.render('otp' , {emailQuery})

    } catch (error) {

        console.log(error.message);

    }

}

const verifyOtp=async(req,res)=>{

    try{

        const querymail=req.body.email

        const userSessionn = req.session.userSession;
        console.log(req.session.userSession);
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

                    res.redirect('/')

                }


            }

        }else{
            console.log('email not match');
        }

    }else{
        console.log('otp not working');
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

        if(usersession.email ==userdata)
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
        const error = req.flash('flash')

        res.render('login' , {msg : error});

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
        

        const userData = await User.findOne({email:newemail})
        
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
             res.redirect('/login')
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

        if(req.session.user){

            res.render('home' , {login : req.session.user});

        } else {

            res.render('home')

        }
      
       
    } catch (error) {
        console.log(error.message);
    }
}




const aboutus = async(req,res)=>{
    try {
        res.render('about')
    } catch (error) {
        
    }
}


const contact = async(req,res)=>{

    try {
        res.render('contact')
    } catch (error) {
        
    }
}

const products = async(req,res)=>{
    try {
        res.render('productDetails')

    } catch (error) {
        
    }
}
const catagory = async(req,res)=>{
    try {
        res.render('catagory')
    } catch (error) {
        
    }
}

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
    loadresendotp
} 