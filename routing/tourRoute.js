const express = require('express')
const tours = require('../controller/getTour')
const router = express.Router()


router.route('/').get(tours.getTours).post(tours.postTour)
router.route('/:id').get(tours.getOnlyOneTour).patch(tours.updateById).delete(tours.deleteById)

module.exports=router