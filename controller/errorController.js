// error handling middleware
module.exports=(err,req,res,next)=>{
    // all err data will come through errorHandling file from util folder 
    res.status(err.statusCode).json({
        status:err.status,
        message:err.message,
        detail:err
    })
}