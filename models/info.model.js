const mongoose = require('mongoose')
const Schema = mongoose.Schema

const Info = new Schema({
    info_id: {
        type: mongoose.Schema.Types.ObjectId
    },
    book_id: {
        type: mongoose.Schema.Types.ObjectId, ref: 'Book'
    },
    info_lat: {
        type: Schema.Types.Decimal128,
    },
    info_lng: {
        type: Schema.Types.Decimal128,
    },
    info_time: {
        type: Date
    },
    info_temperature: {
        type: Number,
    },
    info_humidity: {
        type: Number,
    }

},{
    timestamps: true,
})

const InfoSchema = mongoose.model('Info', Info)

module.exports = InfoSchema