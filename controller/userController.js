const mongoose=require("mongoose")
const User=require('../modle/userModel')
const errorHandling=require('../util/errorHandling')

module.exports.createUser=async(req,res,next)=>{
    try{
        // const createNewUser=await User.create(req.body)

        // It is secure to take input this way by filtering 
        const createNewUser=await User.create({
            name:req.body.name,
            email:req.body.email,
            // photo is optional
            photo:req.body.photo,
            password:req.body.password,
            passwordConfirm:req.body.passwordConfirm
        })
        res.status(200).json({
            status:"success",
            userDetail:createNewUser

        })
    }catch(err){next(new errorHandling(err.message,404))}

}