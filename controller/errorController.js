// error handling middleware
const errorInDevelopment=(err,res)=>{
    res.status(err.statusCode).json({
        status:err.status,
        message:err.message,
        err,
        detail:err.stack
    })
}
const errorInProduction=(err,res)=>{
    res.status(err.statusCode).json({
        status:err.status,
        message:err.message,
      
    })
}

module.exports=(err,req,res,next)=>{
    // all err data will come through errorHandling file from util folder 
    if(process.env.NODE_ENV ==="development"){
        errorInDevelopment(err,res)
    }
    else if(process.env.NODE_ENV === "production"){
        errorInProduction(err,res)
    }
}