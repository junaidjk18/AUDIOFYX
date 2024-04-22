
const mongoose = require('mongoose')
const newcart = new mongoose.Schema({
    
    userId : {type : String , required: true} ,
    product : [{
        productId : {type : mongoose.Schema.Types.ObjectId , ref :'product',},
        quantity:{type:Number,required:true,default:1},
        price : {type : Number , required : true}
    }],
    
    Total_price : {type : Number}
})

module.exports = mongoose.model('Cart',newcart)