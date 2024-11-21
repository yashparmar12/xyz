import mongoose from 'mongoose';

const userAdmin = new mongoose.Schema({
    fullname: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    phoneNumber: {
        type: Number,
        required: true
    },
    password: {
        type: String,
        required: true
    }
})

export const userAdminModel = mongoose.model("userAdminModel", userAdmin);

