const mongoose=require('mongoose')
const validator=require('validator')
const bcrypt=require('bcryptjs')


const userSchema=mongoose.Schema({
    name:{
        type:String,
        required:[true,'User must have name'],
        minLength:[6,'User name should be minimum of 6 word']
    },
    email:{
        type:String,
        required:[true,'A user must have an email'],
        unique:true,
        lowercase:true,
        // using validator package to check if the email is valid
        validate:[validator.isEmail,"Please enter a valid email"]

    },
    // photo is optional
    photo:{
        photo:String
    },
    password:{
        type:String,
        required:[true,'A user must have password'],
        minLength:[8,'Password must be at least of 8 word']
    },
    passwordConfirm:{
        type:String,
        required:[true,'Please confirm your password'],
        minLength:[8,'Password must be at least of 8 word'],
        validate:{
            validator:function(val){
                return val===this.password//val takes passwordConfirm data as an argument
            },
            message:"Password must be same in password Confirm "
        }
    }

})
// hasing the password before saving the document
userSchema.pre("save",async function(next){
    // return next and terminate the middleware if the password is not modified
    // The below logic is neccessary because every time if we try to update the document this middleware will be called hence to avoid hashing already hashed password unless the password is being modified
    if(!this.isModified("password")){
        return next()//Terminates this middeware and calls next middleware
    }
    // hashing the password and storing it to a password schema
    this.password=await bcrypt.hash(this.password,12)
    // muting the passwordConfirm because it stores unhashed password  
    this.passwordConfirm=undefined
    next()
})

const User=mongoose.model("User",userSchema)
module.exports=User
