const Cart = require ('../models/cart')
const category = require ('../models/category')
const PRODUCTS = require ('../models/product')
const User = require ('../models/userModel')


// load cart
const cart = async ( req ,res ) => {

    try {
        const categoryData = await category.find({is_listed: true})
        const listedCategory = await category.find({is_listed:true})
        const userdata = await User.findById({_id:req.session.user._id})
        const userProduct = await Cart.findOne({userId : req.session.user._id}).populate('product.productId')
        const cartData = await Cart.findOne({userId : req.session.user._id});

        console.log(cartData);

        const updateCart = userProduct.product.reduce((acc , val) => acc + val.price , 0)

        const newPrice = await Cart.findOneAndUpdate({userId : req.session.user._id} , {$set : {Total_price : updateCart}} , {new : true , upsert : true});
        
        const msg = req.flash('flash')
        
        if(req.session.user){

            res.render('cart',{login:req.session.user,listedCategory,userProduct,userdata,categoryData , newPricee : newPrice.Total_price , msgg : msg , cartData})

        }else{
            res.redirect('/login')
        }
        
    } catch (error) {
        
        console.log(error.message);
    }

}

// cart add 
const addCart = async ( req , res ) => {

    try {
        console.log('hii');

        if(req.session.user){

            const proId = req.query.id
            const userIdd = req.session.user._id
            const quantity = req.query.qty || 1

            console.log(quantity);

        const cartProduct = await PRODUCTS.findOne({_id:proId});

    //    console.log(cartProduct)

        const exist= await Cart.findOne({userId:userIdd , product: {$elemMatch: {productId: proId} } } );

        if(!exist){
            console.log('aaa');
            const total = cartProduct.discount > 0 ? cartProduct.dis_price * quantity : cartProduct.price * quantity
            console.log('bbb');

           await Cart.findOneAndUpdate({userId:userIdd},

            {$addToSet:{

                product:{productId:proId,

                price: total}

            }},{new:true ,upsert:true})

            res.send({success:true})

        }else{

            res.send({exist:true})
        }
        }else{
            
            res.send({failed:true})
        }
        
    } catch (error) {
        
    }

}

//edit cart fetch
const cartEdit = async (req, res) => {

    try {

        const {proId , cartId} = req.body;
     
      const product = await PRODUCTS.findOne({ _id: proId });

      const newval = product.price * req.body.quantity;
      
      const updatedCart = await Cart.findOneAndUpdate(

        { _id: cartId, "product.productId": proId },

        {$set: { "product.$.price": newval,"product.$.quantity": req.body.quantity,},},{ new: true });
      
      const total = updatedCart.product.reduce((acc, product) => acc + product.price,0);
  
       await Cart.findByIdAndUpdate(

        { _id: cartId },

        { $set: {Total_price:total}}

      );

    res.send({ success: total });

    } catch (err) {

      console.log(err.message + "   cart edit ");

    }

  };
 

//  Delete Cart :-

const deleteCart = async(req , res)=>{

    try {

        const proId = req.query.id

        

        const deleteCartt = await Cart.findOneAndUpdate({userId : req.session.user._id} , {$pull : {product : {productId : proId}}});

        if(deleteCartt){

            res.send({succ : true})

        } else {

            res.send({fail : true});

        }
        
    } catch (error) {
        
    }

}


module.exports = {
    cart,
    addCart,
    deleteCart,
    cartEdit

}