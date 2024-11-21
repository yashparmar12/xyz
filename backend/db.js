import mongoose from 'mongoose';

const db = async() =>{
    try {
       await mongoose.connect("mongodb://localhost:27017/User");
       console.log("MongoDB connected successfuly");
    } catch (error) {
        console.log(error);
    }
}

export default db;