const Razorpay = require('razorpay')
const Order = require('../models/Order')
const User= require('../models/User')

exports.purchasePremium = async(req,res,next)=>{
    try
    {
        var rzp = new Razorpay({
            key_id : 'rzp_test_7fx2unZReLTesQ',
            key_secret : 'kWkdXDxCPcjlqlWu8RO3KYKb'
        })

        const amount = 2500

        rzp.orders.create({amount,currency:'INR'},(err,order)=>{
            if(err)
            {
                throw new Error (JSON.stringify(err))
            }
            req.user.createOrder({orderid:order.id,status:'PENDING'}).then(()=>{
                return res.status(201).json({order,key_id:rzp.key_id})
            })
        })
    }
    catch(err)
            {
                console.log(err)
                res.status(403).json({message:'Something went wrong',error:err})
            }
}

exports.paymentHandler = async(req,res,next)=>{
    try
    {
        const {payment_id,order_id} = req.body
        const order = await Order.findOne({where:{orderid:order_id}})
        const prom1 = order.update({paymentid:payment_id,status:'SUCCESS'})
        const prom2 = req.user.update({isPremium:true})
        Promise.all([prom1,prom2]).then(()=>{
            return res.status(200).json({success:true,message:'Txn successful',isPremium:true})
        })
        .catch(err=> {
            throw new Error(err)
        })
    }
    catch(err)
    {
        throw new Error (err)
    }
}

exports.premiumStatus = async(req,res,next)=>{
    try
    {
        const premium = await User.findOne({where:{id:req.user.id}})
        // console.log(premium.data)
        if(premium.isPremium)
        {
            return res.status(201).json({isPremium:true})
        }
        else 
        {
            return res.status(201).json({isPremium:false})
        }
    }
    catch(err)
            {
                console.log(err)   
            }
}
