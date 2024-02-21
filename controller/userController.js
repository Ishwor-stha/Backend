const mongoose=require("mongoose")
const User=require('../modle/userModel')
const errorHandling=require('../util/errorHandling')

module.exports.createUser=async(req,res,next)=>{
    try{
        const createNewUser=await User.create(req.body)
        res.status(200).json({
            status:"success",
            userDetail:createNewUser

        })
    }catch(err){next(new errorHandling(err.message,404))}

}