const express = require('express')
const tours = require('../controller/getTour')//importing  the middlewares of tourcontroller 
const authController=require('../controller/authController')
const router = express.Router()


router.route('/').get(authController.protect,tours.getTours).post(tours.postTour)
router.route('/:id').get(tours.getOnlyOneTour).patch(tours.updateById).delete(tours.deleteById)

module.exports=router