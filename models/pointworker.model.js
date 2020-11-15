const mongoose = require('mongoose')
const Schema = mongoose.Schema

const PointWorker = new Schema({
    point_worker_id: {
        type: mongoose.Schema.Types.ObjectId,
    },
    point_id: {
        type: mongoose.Schema.Types.ObjectId, ref: 'Point',
        required: true,
    },
    user_id: {
        type: mongoose.Schema.Types.ObjectId, ref: 'User',
        required: true,
    },
    point_worker_status: {
        type: String,
        default: `active`
    },
},{
    timestamps: true,
})

const PointWorkerSchema = mongoose.model('PointWorker', PointWorker)

module.exports = PointWorkerSchema