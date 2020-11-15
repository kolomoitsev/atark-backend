const mongoose = require('mongoose')
const Schema = mongoose.Schema

const Country = new Schema({
    country_id: {
        type: mongoose.Schema.Types.ObjectId
    },
    country_name: {
        type: String,
        required: true,
        unique: true,
    },
    country_code: {
        type: String,
        required: true,
        unique: true,
    },
    code_3: {
        type: String,
        required: true,
        unique: true,
    },
    country_number: {
        type: String,
        required: true,
        unique: true,
    }
},{
    timestamps: true,
})

const CountrySchema = mongoose.model('Country', Country)

module.exports = CountrySchema