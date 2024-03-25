const authController=require('../controller/authController')//importing the authController middlewares
const userController=require('../controller/userController')
const express = require('express')
const router= express.Router()

router.route('/').post(authController.createUser)
router.route('/login').post(authController.login)
router.route('/forgotPassword').post(authController.forgotPassword)
router.route('/resetPassword/:token').patch(authController.resetPassword)
router.route('/updatePassword').patch(authController.protect,authController.updatePassword)
router.route('/updateProfile').patch(authController.protect,userController.updateProfile)




module.exports=router
