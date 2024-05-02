const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({

    username:{
        type : String,
        required : true
    },
    phone : {
        type : Number,
        required : true
    },
    email :{
        type : String,
        required : true
    },
    password : {
        type : String,
        required : true
    },
    is_Admin : {
        type : Boolean,
        default : false
    },
    is_Verified : {
        type : Boolean,
        default : false
    },
    is_blocked : {
        type:Boolean,
        default : false
    },
    applyCoupen:[]

});


module.exports = mongoose.model('userData',userSchema)