const mongoose = require('mongoose')
const Schema = mongoose.Schema

const Book = new Schema({
    book_id: {
        type: mongoose.Schema.Types.ObjectId
    },
    transport_id: {
        type: mongoose.Schema.Types.ObjectId, ref: 'Transport'
    },
    user_id: {
        type: mongoose.Schema.Types.ObjectId, ref: 'User'
    },
    tariff_id: {
        type: mongoose.Schema.Types.ObjectId, ref: 'Tariff'
    },
    book_start: {
        type: Date,
        required: true,
    },
    book_end: {
        type: Date,
        required: true,
    },
    book_status: {
        type: String,
        default: `active`
    }
},{
    timestamps: true,
})

const BookSchema = mongoose.model('Book', Book)

module.exports = BookSchema