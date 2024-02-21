// error handling middleware

//  function for developer to display  detailed error . (FOR DEVELOPMENT)
const errorInDevelopment = (err, res) => {
    res.status(err.statusCode).json({
        status: err.status,
        message: err.message,
        err,
        detail: err.stack
    })
}

// function for users  to display  normal error. (FOR PRODUCTION)  
const errorInProduction = (err, res) => {
    res.status(err.statusCode).json({
        status: err.status,
        message: err.message,

    })
}

module.exports = (err, req, res, next) => {
    // all err data will come through errorHandling file from util folder 
    // if node environment is in  development 
    if (process.env.NODE_ENV === "development") {
        //calling function with  err and res as argument
        errorInDevelopment(err, res)
    }
    // If node env is in production 
    else if (process.env.NODE_ENV === "production") {

        //calling function with  err and res as argument
        errorInProduction(err, res)
    }
}