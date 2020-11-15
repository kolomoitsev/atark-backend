const mongoose = require('mongoose')
const Schema = mongoose.Schema

const User = new Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId
    },
    user_name: {
        type: String,
        required: true,
    },
    user_middle_name: {
        type: String,
        required: false,
    },
    user_last_name: {
        type: String,
        required: true,
    },
    user_phone: {
        type: String,
        required: true,
        unique: true,
    },
    user_email: {
        type: String,
        required: true,
        unique: true,
    },
    user_password: {
        type: String,
        required: true,
    },
    user_id_number: {
        type: String,
        required: true,
        unique: true,
    },
    user_address: {
        type: String,
        required: true,
    },
    user_city_registered: {
        type: String,
        required: true,
    },
    user_rating: {
        type: Number,
        default: 50,
    },
    user_status: {
        type: String,
        default: `active`,
    },

},{
    timestamps: true,
})

const UserSchema = mongoose.model('User', User)

module.exports = UserSchema