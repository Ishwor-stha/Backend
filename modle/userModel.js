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
                return val===this.password
            },
            message:"Password must be same in password Confirm "
        }
    }

})
// hasing the password before 
userSchema.pre("save",async function(next){
    if(!this.isModified("password")){
        return next()
    }
    this.password=await bcrypt.hash(this.password,10)
    
    this.passwordConfirm=undefined
    next()
})

const User=mongoose.model("User",userSchema)
module.exports=User