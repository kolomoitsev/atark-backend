const mongoose = require('mongoose')
const Schema = mongoose.Schema

const City = new Schema({
    city_id: {
        type: mongoose.Schema.Types.ObjectId
    },
    country_id: {
        type: mongoose.Schema.Types.ObjectId, ref: 'Country',
        required: true,
    },
    city_name: {
        type: String,
        required: true,
        unique: true,
    }
},{
    timestamps: true,
})

const CitySchema = mongoose.model('City', City)

module.exports = CitySchema