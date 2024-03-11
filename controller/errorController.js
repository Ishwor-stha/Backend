// error handling middleware

//@desc: Function for developers to display detailed error (FOR DEVELOPMENT)
const errorInDevelopment = (err, res) => {
    const statusCode = err.statusCode || 500;
    res.status(statusCode).json({
        status: err.status || 'error',
        message: err.message ,
        error: err,
        detail:err.stack 
    });
}

// @desc :Function for users to display a normal error (FOR PRODUCTION)
const errorInProduction = (err, res) => {
    const statusCode = err.statusCode || 500;
    res.status(statusCode).json({
        status: err.status || 'error',
        message: err.message || 'Something went wrong',
    });
}

// @desc :Error handling controller 
module.exports = (err, req, res, next) => {
    // All err data will come through the errorHandling file from the util folder
    // If the node environment is in development
    if (process.env.NODE_ENV === 'development') {
        // Calling function with err and res as arguments
        errorInDevelopment(err, res);
    }
    // If the node environment is in production
    else if (process.env.NODE_ENV === 'production') {
        // Calling function with err and res as arguments
        errorInProduction(err, res);
    }
}
