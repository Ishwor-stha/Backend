const User = require('../modle/userModel')
const errorHandling = require('../util/errorHandling')
const jwt = require('jsonwebtoken')
const bcrypt=require('bcryptjs')

module.exports.createUser = async (req, res, next) => {
    try {
        // const createNewUser=await User.create(req.body)

        // It is secure to take input this way by filtering 
        const createNewUser = await User.create({
            name: req.body.name,
            email: req.body.email,
            // photo is optional
            photo: req.body.photo,
            password: req.body.password,
            passwordConfirm: req.body.passwordConfirm
        })
        // creating a JWT Token {payload is the newly created id of user },secretkey,and the JWT Expiration date=30days 
        const token = jwt.sign({ id: createNewUser._id }, process.env.JWT_SECRETKEY, { expiresIn: process.env.JWT_EXPIRE_DateInDay })
        res.status(201).json({
            token: token,
            status: "success",
            userDetail: createNewUser

        })
    } catch (err) { next(new errorHandling(err.message, 404)) }

}

module.exports.login =async (req, res, next) => {

    const userName = req.body.name
    const userPassword = req.body.password
    if (!userName || !userPassword) return next(new errorHandling("Please enter username or password", 401))

    const DbUserDetail=await User.findOne({name:userName})
    if(!DbUserDetail) return next(new errorHandling("The username or password is incorrect",401))
    const dbPassword=DbUserDetail.password
    
    const validPassword=await bcrypt.compare(userPassword,dbPassword)
    console.log(validPassword)

    if(!validPassword)return next(new errorHandling("The username or password is incorrect",401))

    res.status(200).json({
        status:"success",
        message:"you have loged in"
    })


    


}
// Valid user token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY1ZGIwODQ5YmIxYTYwZWJmYWI1YmYzMyIsImlhdCI6MTcwODg1MzMyMiwiZXhwIjoxNzExNDQ1MzIyfQ.3kJzCfcvLKpgZTFJCYQjHGXj5jXvT-fIhmUnDIo_kbI