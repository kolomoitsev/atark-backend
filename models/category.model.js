const mongoose = require('mongoose')
const Schema = mongoose.Schema

const Category = new Schema({
    category_id: {
        type: mongoose.Schema.Types.ObjectId
    },
    category_name: {
        type: String,
        required: true,
        unique: true,
    },
    category_description: {
        type: String,
        required: false,
    },
    category_image: {
        type: Buffer,
        required: false,
    }
},{
    timestamps: true,
})

const CategorySchema = mongoose.model('Category', Category)

module.exports = CategorySchema