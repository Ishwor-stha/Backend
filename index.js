const express = require('express')
const app = express()
const tours = require('./controller/getTour')
const dotenv = require('dotenv')
const mongoose = require('mongoose')


app.use(express.json())
//importing the variables from config.env file
dotenv.config({ path: './config.env' })

//Importing the mongodb connection string and replacing the <password> field from config.env file
const db = process.env.DATABASE.replace('<password>', process.env.DATABASE_PASSWORD);

// making a async function to connect with database 
async function connectMongodb() {
    try {

        // connecting to db
        await mongoose.connect(db)
        console.log("Db connected")

    } catch (error) {
        console.error(`Error: ${error.message}`);
    }

}
// calling a function to connect with database
connectMongodb()

// route section
app.route('/api/v1/tours').get(tours.getTours).post(tours.postTour)
app.route('/api/v1/tours/:id').get(tours.getOnlyOneTour).patch(tours.updateById).delete(tours.deleteById)



// handling error if user enter other route than defined route
// .all accepts all request method (get,post,patch,delete)and "*" accepts all route url
app.all('*', (req, res, next) => {
    const err = new Error(`cannot find ${req.originalUrl} route.`)
    err.status = fail
    err.statusCode = 404
    next(err)//passing any value to next  method triggers the error handling middleware and directily jumps to the error handling middleware

})

//creating an error handling middleware 
app.use((err, req, res, next) => {
    err.statusCode = err.statusCode || 500
    err.status = err.status || "error"
    res.status(err.statusCode).json({
        status: err.status,
        message: err.message
    })
})



const port = process.env.PORT//importing port from config.env file
app.listen(port, () => {
    console.log('Server started at port ' + port)
})
