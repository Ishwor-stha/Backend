const express = require('express')
const app = express()
const tours = require('./controller/getTour')
const dotenv = require('dotenv')
const mongoose = require('mongoose')


app.use(express.json())
//importing the variables from config.env file
dotenv.config({ path: './config.env' })


const db = process.env.DATABASE.replace('<password>', process.env.DATABASE_PASSWORD);

async function connectMongodb(){
    try {
    

        await mongoose.connect(db)
        console.log("Db connected")
    
    } catch (error) {
        console.error(`Error: ${error.message}`);
    }
    
}
connectMongodb()

app.route('/api/v1/tours').get(tours.getTours).post(tours.postTour)
app.route('/api/v1/tours/:id').get(tours.getOnlyOneTour).patch(tours.updateById).delete(tours.deleteById)




const port = process.env.PORT//importing port from config.env file
app.listen(port, () => {
    console.log('Server started at port ' + port)
})
