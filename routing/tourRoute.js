const express = require('express')
const tours = require('../controller/getTour')//importing  the middlewares of tourcontroller 
const authController=require('../controller/authController')
const router = express.Router()


router.route('/').get(authController.protect,tours.getTours).post(authController.protect,authController.isAdmin,tours.postTour)
router.route('/:id').get(tours.getOnlyOneTour).patch(authController.protect,authController.isAdmin,tours.updateById).delete(authController.protect,authController.isAdmin,tours.deleteById)

module.exports=router