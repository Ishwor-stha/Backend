const auth=require('../controller/authController')//importing the authController middlewares
const express = require('express')
const router= express.Router()

router.route('/').post(auth.createUser)

module.exports=router
