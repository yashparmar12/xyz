import { userAdminModel } from "../models/userAdmin.js";
import SECRET_KEY  from "../jwtKey.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const register = async (req, res) => {
    const { fullname, email, phoneNumber, password} = req.body;
    try {
        if (!fullname || !email || !phoneNumber || !password) {
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
    const { email, password } = req.body;
    console.log(email);
    try {
        if (!email || !password) {
            return res.status(400).json({
                message: "Something is missing",
                success: false
            })
        }

       let user = await userAdminModel.findOne({email});
        
        if(!user){
            return res.status(400).json({
                message: "Incorrect email",
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

        

        const token = jwt.sign({id:user.id}, SECRET_KEY,{expiresIn:'1d'});

        user={
            id:user.id,
            fullname:user.fullname,
            email:user.email,
            phoneNumber:user.phoneNumber,
            
        }

        return res.status(200).cookie("token", token, {httpsOnly:true}).json({
            message: "Login successfully",
            user,
            success: true,
        });
        // return res.status(200).res.cookie('token', token, {
        //     httpOnly: true,
        //     secure: false, // Change this to false for local development
        //     maxAge: 3600000,
        //     success: true,
        //   });


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

// export const userData = async(req, res) => {
//     try {
       
//         const userId = req.id; //userId as a token store h cookies me
//         let user = await userAdminModel.findById(userId); 

//         if(!user){
//             return res.status(400).json({
//                 message:"User not found",
//                 success:false
//             })
//         }

//         user = {
//             _id: user._id,
//             fullname: user.fullname,
//             email: user.email,
//             phoneNumber: user.phoneNumber,
//         }

//         res.status(200).json({
//             message:"Successfully Login",
//             user,
//             success:true
//         });

//     } catch (error) {
//         console.log(error);
//     }
// }

export const userData = async (req, res) => {
    try {
      const userId = req.id; // User ID from token, which was assigned in the Authenticated middleware
      let user = await userAdminModel.findById(userId); 
  
      if (!user) {
        return res.status(400).json({
          message: "User not found",
          success: false,
        });
      }
  
      const userData = {
        _id: user._id,
        fullname: user.fullname,
        email: user.email,
        phoneNumber: user.phoneNumber,
      };
  
      res.status(200).json({
        message: "User data fetched successfully",
        user: userData,
        success: true,
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        message: "Internal server error",
        success: false,
      });
    }
  };