const express = require('express')
const app = express()
const Tour = require("../modle/tourModle")
const errorHandling = require('../util/errorHandling')



app.use(express.json())

const pagination = (limit, page) => {
    page = page * 1
    limit = limit * 1
    return (page - 1) * limit

}
/*
const asyncFunction = (func) => {
    return (req, res, next) => {

        func(req, res, next).catch(err => {
            errorHandling(err.message, 404)
        })
    }
}
*/
module.exports.getTours = async (req, res, next) => {

    try {
        // let query = JSON.stringify(req.query)
        // query = query.replace(/\b(gt|lt|lte|gte)\b/g, match => { return `$${match}` })
        // query = JSON.parse(query)

        //variable for storing the name of fieldName for select mongoose method
        let fieldNames = ""
        //Variables for pagination
        let limit
        let skip

        //counting the total number of documents on collection 
        let totalDocument = await Tour.countDocuments()


        //logic for limiting and skiping the content(pagination)
        if ((req.query.limit * 1) > totalDocument) {
            //if the limit is greater than the total  number of document 
            throw new Error('limit exceed the total number of document')
        }
        else if (req.query.limit && req.query.page) {
            skip = pagination(req.query.limit, req.query.page)
            limit = req.query.limit * 1
        }

        //logic for receiving the field name and  for using on select mongoose method 
        if (req.query.fields) {
            fieldNames = req.query.fields
            fieldNames = fieldNames.split(',').join(' ');

        }

        // let tour = await Tour.find(query).sort(sort).select(fieldNames)

        //quering the request on the database
        let tour = await Tour.find().sort(req.query.sort).select(fieldNames).skip(skip).limit(limit)


        res.status(200).json({
            status: 'success',
            result: tour.length,
            data: tour



        })


    } catch (error) { next(new errorHandling(error.message, 404)) }

}


//CREATING A FUNCTION WHICH IS USED TO CREATE A NEW TOUR AND POST IT IN A JSON FILE
module.exports.postTour = async (req, res, next) => {
    try {

        const data = await Tour.create(req.body)
        res.json({
            status: "success",
            data: {
                data
            }

        })
    } catch (error) { next(new errorHandling(error.message, 404)) }
}


//CREATING A FUNCTION WHICH TAKES THE ID AND RETURNS THE RESPECTIVE TOUR DETAILS
module.exports.getOnlyOneTour = async (req, res, next) => {

    try {
        const tour = await Tour.findById(req.params.id)

        res.json({
            status: 'success',
            tour

        })
    } catch (error) { next(new errorHandling(`An Id is invalid or there is no data corresponding to ${req.params.id} id`, 404)) }


}
module.exports.updateById = async (req, res, next) => {
    try {
        const update = req.body
        const tour = await Tour.findByIdAndUpdate(req.params.id, update)
        res.json({
            status: 'success',
            updated: {
                tour
            }
        })
    } catch (error) { next(new errorHandling(error.message, 404)) }
}
module.exports.deleteById = async (req, res, next) => {
    try {
        await Tour.findByIdAndDelete(req.params.id)
        res.json({
            status: 'success',

        })

    } catch (error) { next(new errorHandling(error.message, 404)) }
}
