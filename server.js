const express = require('express')
const app = express()
const dotenv = require('dotenv')
const mongoose = require('mongoose')
const rateLimit=require('express-rate-limit')
const mongoSanitize = require('express-mongo-sanitize');


const errorHandling=require('./util/errorHandling')
const errorController=require('./controller/errorController')
const tourRoute=require('./routing/tourRoute')
const userRoute=require('./routing/userRoute')


/***********************************Limiting the request ****************************************************** */
// limit the request from the Ip address
const limiter = rateLimit({
	windowMs: 15 * 60 * 1000, // 15 minutes
	limit: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes).
	standardHeaders: 'draft-7', // draft-6: `RateLimit-*` headers; draft-7: combined `RateLimit` header
	legacyHeaders: false, // Disable the `X-RateLimit-*` headers.
	// store: ... , // Redis, Memcached, etc. See below.
})
// limit the request from the Ip address
app.use(limiter)

 /*******Some configuration ********************************************************************************* */
 

 // Parse incoming JSON request bodies
app.use(express.json());
// Configure dotenv to load environment variables from config.env file
dotenv.config({ path: './config.env' });



/************************Preventing from nosql injection and xss************************/

app.use(mongoSanitize());//calling function on middleware to prevent NOSql injection




/***********************************MongoDb connection**************************************************** */

//Importing the mongodb connection string and replacing the <password> field from config.env file
const db = process.env.DATABASE.replace('<password>', process.env.DATABASE_PASSWORD);

// making a async function to connect with database 
async function connectMongodb() {
    try {

        // connecting to db
        await mongoose.connect(db);
        console.log("Db connected");

    } catch (error) {
        console.error(`Error: ${error.message}`);
    }

}
// calling a function to connect with database
connectMongodb();


/****************************************ROUTE SECTION*********************************************** */


// User section
app.use('/api/v1/user',userRoute);
// tours section
app.use('/api/v1/tours',tourRoute);



/*********************************Handling route error***************************************************** */



// handling error if user enter other route than defined route
// .all accepts all request method (get,post,patch,delete)and "*" accepts all route url
app.all('*', (req, res, next) => {
    // calling errorHandling classs while passing two arguments
    next(new errorHandling(`The request url ${req.originalUrl} is not avaiable`,404));

})

/*********************************Error Handling middleware ***************************************************** */

//redirecting to the error handling middleware  
app.use(errorController);


/********************************listening for  incomming request***************************************************/
const port = process.env.PORT;//importing port from config.env file
app.listen(port, () => {
    console.log('Server started at port ' + port);
})
