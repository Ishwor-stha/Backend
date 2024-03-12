const auth=require('../controller/authController')//importing the authController middlewares
const express = require('express')
const router= express.Router()

router.route('/').post(auth.createUser)
router.route('/login').post(auth.login)
router.route('/forgotPassword').post(auth.forgotPassword)
router.route('/resetPassword/:token').patch(auth.resetPassword)



module.exports=router
