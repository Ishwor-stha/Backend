const auth=require('../controller/authController')
const express = require('express')
const router= express.Router()

router.route('/').post(auth.createUser)

module.exports=router
