import mongoose from 'mongoose';

const userAdmin = new mongoose.Schema({
    fullname: {
        type: String,
    },
    email: {
        type: String,
        required: true
    },
    address: {
        type: String,
    },
    phoneNumber: {
        type: Number,
    },
    city: {
        type: String,
    },
    country: {
        type: String,
    },
    password: {
        type: String,
        required: true
    },

    role: {
        type: String,
        enum: ['admin','user'],
        default: 'user'
    },

    image: {
        type: String,
        required: false
    },
})

export const userAdminModel = mongoose.model("userAdminModel", userAdmin);

