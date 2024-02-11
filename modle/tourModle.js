const mongoose=require('mongoose')

const tourSchema= new mongoose.Schema({
    name:{type:String,
        required:[true,'you need name '],
        unique:true
    },
    duration:{
        type:Number,
        required:[true,'A tour must have a duration']
    },
    maxGroupSize:{
        type:Number,
        required:[true,'A tour must have a group size']
    },
    difficulty:{
        type:String,
        required:[true,'A tour must have a difficulty']
    },
    ratingAverage:{
        type:Number,
        default:4.5
    },
    ratingQuantity:{
        type:Number,
        default:0
    },
    price:{
        type:Number,
        required:[true,'You need to specify price']
    },
    priceDiscount:Number,
    summary:{
        type:String,
        trim:true,// trim method cuts the extra space in the begining and the end of string 
        required:[true,'A tour must have a summary']
    },
        
    description:{
        type:String,
        required:[true,'You need to desctiotion']
    },
    imageCover:{
        type:String,
        required:[true,'A tour must have image cover']
    },
    images:[String],
    cretedAt:{
        type:Date,
        default:Date.now()
    },
    startDates:[Date]


})
const Tour=mongoose.model('tours',tourSchema)//Tour = collection name in DB,Tourschema=documents inside Tour tour module

module.exports=Tour
