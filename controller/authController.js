const User = require('../modle/userModel')
const errorHandling = require('../util/errorHandling')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')

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

module.exports.login = async (req, res, next) => {
    // Taking userName from client side
    const userName = req.body.name
    // taking password from client side
    const userPassword = req.body.password
    // it there is no user name or password then terminate current middleware and call errorhandling middleware with two argument ie(errormessage,statusCode)
    if (!userName || !userPassword) return next(new errorHandling("Please enter username or password", 400))

    // searching the document of user in DataBase providing username which we have received form clientSide
    const DbUserDetail = await User.findOne({ name: userName })

    // if there is no userDetail then terminate current middleware and call errorhandling middleware
    if (!DbUserDetail) return next(new errorHandling("The username or password is incorrect", 401))

    // storing the hashed userpassword of db in variable
    const dbPassword = DbUserDetail.password

    // comparing the hashed Database password and the password of Client side using bcrypt  
    const validPassword = await bcrypt.compare(userPassword, dbPassword)//true/false

    // if password doesnot match then terminate this/current middleware and call error handling middleware
    if (!validPassword) return next(new errorHandling("The username or password is incorrect", 401))

    // if password and username is valid then send the response
    res.status(200).json({
        status: "success",
        message: "you have loged in"
    })





}

module.exports.protect =async (req, res, next) => {
    let token
    if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
        let arrayString = req.headers.authorization.split(" ")
        token = arrayString[1]

    }

    if (!token) next(new errorHandling("please login to get access", 401))
    
    const isValid= await jwt.verify(token,process.env.JWT_SECRETKEY)
    console.log(isValid)


    next()
}