const express = require('express');
const app = express();
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const rateLimit = require('express-rate-limit');
const mongoSanitize = require('express-mongo-sanitize');
const { JSDOM } = require('jsdom');
const createDOMPurify = require('dompurify');
const { window } = new JSDOM('');
const DOMPurify = createDOMPurify(window);

const errorHandling = require('./util/errorHandling');
const errorController = require('./controller/errorController');
const tourRoute = require('./routing/tourRoute');
const userRoute = require('./routing/userRoute');

/***********************************Limiting the request ******************************************************/
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    limit: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes).
    standardHeaders: 'draft-7', // draft-6: `RateLimit-*` headers; draft-7: combined `RateLimit` header
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers.
});
app.use(limiter);

/*******Some configuration ********************************************************************************* */
app.use(express.json());
dotenv.config({ path: './config.env' });

/************************Preventing from nosql injection and xss************************/
app.use(mongoSanitize()); // Prevent NoSQL injection

// Sanitize user input to prevent XSS attacks
app.use((req, res, next) => {
    // Check if request body exists and is an object
    if (req.body && typeof req.body === 'object') {
        // Iterate over each key in the request body
        const arrayKey=Object.keys(req.body)
        arrayKey.forEach(key => {
            // Sanitize the value of each key using DOMPurify
            req.body[key] = DOMPurify.sanitize(req.body[key]);
        });
    }
    next();
});

/***********************************MongoDb connection**************************************************** */
const db = process.env.DATABASE.replace('<password>', process.env.DATABASE_PASSWORD);
async function connectMongodb() {
    try {
        await mongoose.connect(db);
        console.log("Db connected");
    } catch (error) {
        console.error(`Error: ${error.message}`);
    }
}
connectMongodb();

/****************************************ROUTE SECTION*********************************************** */
app.use('/api/v1/user', userRoute); // User section
app.use('/api/v1/tours', tourRoute); // Tours section

/*********************************Handling route error***************************************************** */
app.all('*', (req, res, next) => {
    next(new errorHandling(`The request URL ${req.originalUrl} is not available`, 404));
});

/*********************************Error Handling middleware ***************************************************** */
app.use(errorController);

/********************************listening for incoming request***************************************************/
const port = process.env.PORT;
app.listen(port, () => {
    console.log('Server started at port ' + port);
});
