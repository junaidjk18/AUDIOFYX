const mongoose = require ('mongoose')

const otpSchema = new mongoose.Schema({

    otp : {
        type : Number,
        required : true
    },

    userEmail : {

        type :String,
        required :true

    },

    createdAt : {

        type : Date , expires : "60" , default : Date.now()

    }
    
});

module.exports = mongoose.model('otp',otpSchema);