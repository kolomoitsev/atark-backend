const mongoose = require('mongoose')
const Schema = mongoose.Schema

const Tariff = new Schema({
    tariff_id: {
        type: mongoose.Schema.Types.ObjectId
    },
    category_id: {
        type: mongoose.Schema.Types.ObjectId, ref: 'Category',
        required: true,
    },
    tariff_name: {
        type: String,
        required: true,
    },
    tariff_description: {
        type: String,
        required: true,
    },
    tariff_price: {
        type: String,
        required: true,
    },
    tariff_length: {
        type: Number,
        required: true,
    }
},{
    timestamps: true,
})

const TariffSchema = mongoose.model('Tariff', Tariff)

module.exports = TariffSchema