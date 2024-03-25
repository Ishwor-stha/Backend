const User = require('../model/userModel');
const errorHandling=require('../util/errorHandling')

const filteredData = (req, ...fields) => {
    const data = {};
    const keyValue = Object.keys(req.body);
    keyValue.forEach(el => {
        fields.forEach(field => {
            if (el.includes(field)) {
                data[el] = req.body[el];
            }
        });
    });
    return data;
};

module.exports.updateProfile = async (req, res, next) => {
    try {
        const userId = req.userId;
        const data = filteredData(req, 'name', 'email');
        if(!data) return next(new errorHandling("Empty data",404))
        const updateUser = await User.findByIdAndUpdate(userId, data, { new: true, runValidators: true });

        if (!updateUser) return next(new errorHandling("User not found",404))
            

        res.status(200).json({ message: "Profile updated successfully",
         user: updateUser });
    } catch (error) {
        next(error);
    }
};
