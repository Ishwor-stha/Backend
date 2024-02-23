const mongoose=require("mongoose")
const User=require('../modle/userModel')
const errorHandling=require('../util/errorHandling')
const jwt=require('jsonwebtoken')

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
        // creating a JWT Token {payload is the newly created id of user },secretkey,and the JWT Expiration date=30days 
        const token=jwt.sign({ id: createNewUser._id},process.env.JWT_SECRETKEY,process.env.JWT_EXPIRE_DateInDay)
        res.status(201).json({
            token:token,
            status:"success",
            userDetail:createNewUser

        })
    }catch(err){next(new errorHandling(err.message,404))}

}