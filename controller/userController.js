const User=require('../modle/userModel')
const filteredData=(req,...field)=>{
    const data={}
    const keyValue=Object.keys(req.body)
    keyValue.forEach(el=>{
        if(el.includes(field)){
            data[el]=req.body.el
        }

    })
}

module.exports.updateProfile=async(req,res,next)=>{
    
    const userId=req.userId
    const data=filteredData(req,['name','email'])
    
    const updateUser=User.findByIdAndUpdate(userId,data,{validate:true})
    
    
}