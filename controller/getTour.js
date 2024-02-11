const express = require('express')
const app = express()
const Tour = require("../modle/tourModle")



app.use(express.json())

module.exports.getTours = async (req, res) => {

    try {
        // let query = JSON.stringify(req.query)
        // query = query.replace(/\b(gt|lt|lte|gte)\b/g, match => { return `$${match}` })
        // query = JSON.parse(query)


        //variables for  sorting
        let sort = {}
        let sortName = req.query.sort
        let sortOrder = 1
        //variable for storing the name of fieldName for select mongoose method
        let fieldNames = ""
        //Variables for pagination
        let page
        let limit
        let skip

        //counting the total number of documents on collection 
        let totalDocument = await Tour.countDocuments()
        console.log(totalDocument)

        //logic for limiting and skiping the content(pagination)
        if ((req.query.limit * 1) > totalDocument) {
            //if the limit is greater than the total  number of document 
            throw new Error('limit exceed the total number of document')
        }
        else if (req.query.limit && req.query.page) {
            page = req.query.page * 1
            limit = req.query.limit * 1
            skip = (page - 1) * limit
        }




        //logic for sorting the content
        if (req.query.sort) {
            if (req.query.order === 'desc') {
                sortOrder = -1
            }
            sort[sortName] = sortOrder


        }
        //logic for receiving the field name and  for using on select mongoose method 
        if (req.query.fields) {
            fieldNames = req.query.fields
            fieldNames = fieldNames.split(',').join(' ');

        }

        // let tour = await Tour.find(query).sort(sort).select(fieldNames)

        //quering the request on the database
        let tour = await Tour.find().sort(sort).select(fieldNames).skip(skip).limit(limit)


        res.status(200).json({
            status: 'success',
            result: tour.length,
            data: tour



        })


    } catch (error) {
        res.status(404).json({
            status: "fail",
            Error: error.message

        })

    }
}

//CREATING A FUNCTION WHICH IS USED TO CREATE A NEW TOUR AND POST IT IN A JSON FILE
module.exports.postTour = async (req, res) => {
    try {

        const data = await Tour.create(req.body)
        res.json({
            status: "success",
            data: {
                data
            }

        })


    } catch (error) {
        res.status(404).json({
            status: 'fail',
            Error: {
                error
            }
        })

    }
}


//CREATING A FUNCTION WHICH TAKES THE ID AND RETURNS THE RESPECTIVE TOUR DETAILS



module.exports.getOnlyOneTour = async (req, res) => {
    try {
        const tour = await Tour.findById(req.params.id)
        res.json({
            status: 'success',
            tour

        })
    } catch (error) {
        res.status(404).json({
            status: 'error',
            Error: {
                error
            }
        })

    }




}
module.exports.updateById = async (req, res) => {
    try {
        const update = req.body
        const tour = await Tour.findByIdAndUpdate(req.params.id, update)
        res.json({
            status: 'success',
            updated: {
                tour
            }


        })
    } catch (error) {
        res.status(404).json({
            status: 'error',
            Error: {
                error
            }
        })

    }
}
module.exports.deleteById = async (req, res) => {
    try {
        await Tour.findByIdAndDelete(req.params.id)
        res.json({
            status: 'success',

        })


    } catch (error) {
        res.status(404).json({
            status: 'fail',
            Error: {
                error
            }
        })
    }
}
