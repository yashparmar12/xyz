import { userAdminModel } from "../models/userAdmin.js";
import SECRET_KEY  from "../jwtKey.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const register = async (req, res) => {
    const { fullname, email, phoneNumber, password, role} = req.body;
    try {
        if (!fullname || !email || !phoneNumber || !password || !role) {
            return res.status(400).json({
                message: "Something is missing",
                success: false
            })
        }

        const user = await userAdminModel.findOne({ email });
        if (user) {
            return res.status(400).json({
                message: "User already exist with this email",
                success: false
            });
        }

        const hashPassword = await bcrypt.hash(password, 10);

        const userCreate = new userAdminModel({
            fullname,
            email,
            phoneNumber,
            password: hashPassword,
            role
        });

        userCreate.save();

        res.status(201).json({
            message: "Account created successfully",
            success: true
        });

    } catch (error) {
        console.log(error);
    }
}

export const login = async(req,res) => {
    const { email, password, role } = req.body;
    try {
        if (!email || !password || !role) {
            return res.status(400).json({
                message: "Something is missing",
                success: false
            })
        }

        const user = await userAdminModel.findOne({email});

        if(!user){
            return res.status(400).json({
                message: "Incorrect email",
                success: false
            })
        }
        
        if(role !== user.role){
            return res.status(400).json({
                message: "Incorrect role",
                success: false
            })
        }

        const isPasswordMatch = await bcrypt.compare(password, user.password);

        if(!isPasswordMatch){
            return res.status(400).json({
                message: "Incorrect password",
                success: false
            })
        }

        const tokenUser = {
            id:user.id
        }

        const token = jwt.sign(tokenUser, SECRET_KEY,{expiresIn:'1d'});

        const sendUser={
            id:user.id,
            fullname:user.fullname,
            email:user.email,
            phoneNumber:user.phoneNumber,
            role:user.role
        }

        res.status(200).cookie("token", token).json({
            message: "Login successfully",
            sendUser,
            success: true,
        });


    } catch (error) {
        console.log(error);
    }
} 


export const logout = (req, res) => {
    try {
        res.status(200).cookie("token", "").json({
            message: "LogOut successfully",
            success: true,
        });
    } catch (error) {
        console.log(error);
    }
}