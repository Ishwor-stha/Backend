const User = require('../modle/userModel')
const errorHandling = require('../util/errorHandling')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const sendEmail = require('../util/sendMail')

// @method:POST
// @endpoint :localhost:3000/api/v1/user
//@desc: controller for creating the new user /registering the new user
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


// @method:POST
// @endpoint:localhost:3000/api/v1/user/login
// @desc:controller for checking the neccessary detail to login the system
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





// @endpoint:there is no end point for this controller
// @desc:controller for checking the if the user is login or not 
module.exports.protect = async (req, res, next) => {
    let token
    //Receiving token
    // if the request header contains authorization and which starts with Bearer then

    if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
        // example =Bearer uniqueToken
        let arrayString = req.headers.authorization.split(" ")//converting token string in to array eg['Bearer','uniqueToken']
        token = arrayString[1]

    }
    // if there no token then call errorhandling middleware with error message and status code
    if (!token) next(new errorHandling("please login to get access", 401))
    let decode
    // decoding the token received from  client side /verifying 
    try {
        decode = jwt.verify(token, process.env.JWT_SECRETKEY)
    } catch (err) {
        next(new errorHandling("Forbidden to get access", 403))
    }//if something wrong with token then give error

    //if token is valid then check if user is still available
    const userAvaiable = await User.findById(decode.id)

    //if user is not avaiable then  
    if (!userAvaiable) next(new errorHandling("Please create a account ", 400))
    // storing user role in req.role. (I stored  making new .role to check if role of an user in next middleware ie(isadmin))
    req.role = userAvaiable.role
    next()//calling next middleware
}


//@endPoint :there is no end point for this controller
// @desc:controller to see whether user is admin or  not
module.exports.isAdmin = (req, res, next) => {
    const role = req.role//storing the role taken from previous middleware(protect)
    // if role is not admin the throw error 
    if (role != "admin") {
        return next(new errorHandling("You are not allowed to perform this action", 401))
    }

    //otherwise call next middle ware
    next()
}

// @method:POST
// @endpoint:localhost:3000/api/v1/user/forgotPassword
// @desc:controller for checking the email and sent the token to the respective user email
module.exports.forgotPassword = async (req, res, next) => {
    const userEmail = req.body.email
    // is there is no email 
    if (!userEmail) return next(new errorHandling("Please enter the email ", 400))
    // fetching the user details using email
    const fetchUser = await User.findOne({ email: userEmail })
    // if there  is no user from above email
    if (!fetchUser) return next(new errorHandling("Cannot found this email ", 404))

    // if all the above conditions are fullfilled then create resetToken by calling the function created in userModel
    const resetToken = await fetchUser.createPasswordResetToken()//function to create resetToken(see in userModel)

    // disabling all the validators we defined on userSchema
    /* disabling the validator is must while updating the current document because the validators 
    runs while updating the documents and we are only passsing the One field not all hence it create validation error 
    to resolve this problem  validator must be disable */

    await fetchUser.save({ validateBeforeSave: false })//saving the updated field

    // creating the link req.protocol=http/https ,req.get('host')=gives the host name eg localhost:300
    const resetUrl = `${req.protocol}://${req.get('host')}/api/v1/user/resetPassword/${resetToken}`

    //preparing the message 
    const message = `You have received your reset url.\n\n ${resetUrl} \n\n Your reset url will expire after 10 minutes `
    console.log(message);
    // calling sendEmail function inside try block
    try {
        await sendEmail({
            subject: "Your reset url",
            userEmail: fetchUser.email,//fetchUser object contains user details stored from  above code
            message: message//from above message variable
        })
        res.status(200).json({
            status: "success",
            message: "Reset url sent to your mail"
        })

    } catch (err) {
        // if there is an error in sending email then set below field value to undefined
        fetchUser.passwordResetToken = undefined
        fetchUser.passwordExpiryTime = undefined
        // saving the updated field
        await fetchUser.save({ validateBeforeSave: false })
        // return the error 
        return next(new errorHandling('Error in sending mail.Please try again later', 500))
    }




}

// @method:PATCH
// @endPoint:localhost:3000//api/v1/user/resetPassword/:token
// @desc: Controller to update the password
module.exports.resetPassword = async (req, res, next) => {
    try {
        // Get password and password confirmation from the request body
        let password = req.body.password;
        let passwordConfirm = req.body.passwordConfirm;
        // if the password and passwordConfirm field is empty
        if (!password || !passwordConfirm) return next(new errorHandling("Please fill out the form", 404))

        //Getting token from  
        let token = req.params.token

        // Find a user with the matching passwordResetToken in the database
        let user = await User.findOne({ passwordResetToken: token });
        console.log(user)
        // Check if the user does not exist or if the password reset token has expired
        if (!user || user.passwordExpiryTime < Date.now()) {
            // Clear the passwordResetToken and passwordExpiryTime fields for the user
            user.passwordResetToken = undefined;
            user.passwordExpiryTime = undefined;

            // Save the user without validation before saving
            await user.save({ validateBeforeSave: false });

            // Return an error indicating that the reset token is invalid or has expired
            return next(new errorHandling("Reset token is invalid or time has expired", 404));
        }

        // Set the new password and password confirmation for the user
        user.password = password;
        user.passwordConfirm = passwordConfirm;

        // Clear the passwordResetToken and passwordExpiryTime fields for the user
        user.passwordResetToken = undefined;
        user.passwordExpiryTime = undefined;

        // Save the user with the updated password information
        await user.save();

        // Return a success response indicating that the password has been changed
        res.status(200).json({
            status: "success",
            message: "Your password has changed"
        });
    } catch (error) {
        next(new errorHandling(error.message, 500))

    }

} 