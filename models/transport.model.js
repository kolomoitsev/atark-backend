const mongoose = require('mongoose')
const Schema = mongoose.Schema

const Transport = new Schema({
    transport_id: {
        type: mongoose.Schema.Types.ObjectId,
    },
    category_id: {
        type: mongoose.Schema.Types.ObjectId, ref: 'Category',
        required: true
    },
    point_id: {
        type: mongoose.Schema.Types.ObjectId, ref: 'Point',
        required: true
    },
    transport_name: {
        type: String,
        required: true,
    },
    transport_serial_number: {
        type: String,
        required: true,
        unique: true,
    },
    transport_insurance_number: {
        type: String,
        required: true,
        unique: true,
    },
    transport_status: {
        type: String,
        default: `active`
    },
},{
    timestamps: true,
})

const TransportSchema = mongoose.model('Transport', Transport)

module.exports = TransportSchema