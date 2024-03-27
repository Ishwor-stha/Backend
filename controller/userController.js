const User = require('../modle/userModel');
const errorHandling=require('../util/errorHandling')

// @desc: function for filtering the field name 
const filteredData = (req, ...fields) => {
    const data = {};

    const keyValue = Object.keys(req.body)
    keyValue.forEach(el => {
        if(fields.includes(el)) data[el]=req.body[el]
    });
     
    return data;
};


// method:PATCH
// @EndPoint:localhost:3000/api/v1/user/updateProfile
// @desc : A controller for updating the user detail(ie.name,email) 
module.exports.updateProfile = async (req, res, next) => {
    try {
        const userId = req.userId;
        // console.log(userId)
        const data = filteredData(req, 'name','email');
        
        if(!data) return next(new errorHandling("Empty data",404))
        const updateUser = await User.findByIdAndUpdate(userId, data, { new: true, runValidators: true });

        if (!updateUser) return next(new errorHandling("User not found",404))
            

        res.status(200).json({ 
            message: "Profile updated successfully",
           
        });
    } catch (error) {
        next(error);
    }
};
