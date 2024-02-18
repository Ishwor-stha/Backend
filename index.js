const express = require('express')
const app = express()
const tours = require('./controller/getTour')
const dotenv = require('dotenv')
const mongoose = require('mongoose')
const errorHandling=require('./util/errorHandling')
const errorController=require('./controller/errorController')


app.use(express.json())
//configuring the path for importing the details from config.env file
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

// ROUTE SECTION
app.route('/api/v1/tours').get(tours.getTours).post(tours.postTour)
app.route('/api/v1/tours/:id').get(tours.getOnlyOneTour).patch(tours.updateById).delete(tours.deleteById)



// handling error if user enter other route than defined route
// .all accepts all request method (get,post,patch,delete)and "*" accepts all route url
app.all('*', (req, res, next) => {
    // calling errorHandling classs while passing two arguments
    next(new errorHandling(`The request url ${req.originalUrl} is not avaiable`,404))

})



//redirecting to the error handling middleware  
app.use(errorController)


const port = process.env.PORT//importing port from config.env file
app.listen(port, () => {
    console.log('Server started at port ' + port)
})
