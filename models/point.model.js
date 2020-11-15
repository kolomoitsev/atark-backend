const mongoose = require('mongoose')
const Schema = mongoose.Schema

const Point = new Schema({
    point_id: {
        type: mongoose.Schema.Types.ObjectId,
    },
    city_id: {
        type: mongoose.Schema.Types.ObjectId, ref: 'City',
        required: true,
    },
    point_name: {
        type: String,
        required: true,
    },
    owner_id: {
        type: mongoose.Schema.Types.ObjectId, ref: 'User',
        required: true,
        unique: true,
    }
},{
    timestamps: true,
})

const PointSchema = mongoose.model('Point', Point)

module.exports = PointSchema