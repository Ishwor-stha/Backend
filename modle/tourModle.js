const mongoose = require('mongoose')
const slugify = require('slugify')

const tourSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'you need name '],
        unique: true,
        // built in validators for strings
        maxLength:['40',"A name must be less than 40 words "],
        minLength:['10',"A name must be more than 10 words "]
        // or the long long format of above validator
        /*
            maxLength:{
                value:40,
                message:'a name must be less than 40 word'
            }
        */

    },
    slug: {
        type: String
    },

    duration: {
        type: Number,
        required: [true, 'A tour must have a duration']
    },
    maxGroupSize: {
        type: Number,
        required: [true, 'A tour must have a group size']
    },
    difficulty: {
        type: String,
        required: [true, 'A tour must have a difficulty'],
        // built in validator "gives error if a user gives data other than easy,hard and medium"
        enum:{
            value:['easy','difficult','medium'],
            message:'A difficutly must be easy,medium or hard'

        }
    },
    ratingAverage: {
        type: Number,
        default: 4.5,
        // built in validator for numbers
        min:['1','A rating must be 1 or above 1'],
        max:['5','A rating must be below 5']
    },
    ratingQuantity: {
        type: Number,
        default: 0
    },
    price: {
        type: Number,
        required: [true, 'You need to specify price']
    },
    priceDiscount: Number,
    summary: {
        type: String,
        trim: true,// trim method cuts the extra space in the begining and the end of string 
        required: [true, 'A tour must have a summary']
    },

    description: {
        type: String,
        required: [true, 'You need to desctiotion']
    },
    imageCover: {
        type: String,
        required: [true, 'A tour must have image cover']
    },
    images: [String],
    cretedAt: {
        type: Date,
        default: Date.now()
    },
    startDates: [Date]
})
// creating a mongoose middleware to create a slug based on the user provided name before saving the document in DB
tourSchema.pre("save", function (next) {
    this.slug = slugify(this.name)//this.slug selcts the slug schema same goes to this.name
    next()// if there is another mongoose middleware  then it will forward to that middlewarae 
})
const Tour = mongoose.model('tours', tourSchema)//Tour = collection name in DB,Tourschema=documents inside Tour tour module

module.exports = Tour
