import { userAdminModel } from "../models/userAdmin.js";
import SECRET_KEY from "../jwtKey.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { v2 as cloudinary } from "cloudinary"

export const register = async (req, res) => {
    const {
        fullname,
        email,
        address,
        phoneNumber,
        city,
        country,
        password,
        confirmPassword,
        role
    } = req.body;
    try {
        if (
            !fullname ||
            !email ||
            !address ||
            !phoneNumber ||
            !city ||
            !country ||
            !password ||
            !confirmPassword
        ) {
            return res.status(400).json({
                message: "Something is missing",
                success: false,
            });
        }

        const user = await userAdminModel.findOne({ email });
        if (user) {
            return res.status(400).json({
                message: "User already exist with this email",
                success: false,
            });
        }

        const newPassword = password === confirmPassword;
        if (!newPassword) {
            return res.status(400).json({
                message: "Password is not matching",
                success: false,
            });
        }

        const hashPassword = await bcrypt.hash(password, 10);
        
        // const userRole = 'user';
        const userCreate = new userAdminModel({
            fullname,
            email,
            address,
            phoneNumber,
            city,
            country,
            password: hashPassword,
            role
        });

        userCreate.save();

        res.status(201).json({
            message: "Account created successfully",
            success: true,
            user: userCreate
        });
    } catch (error) {
        console.log(error);
    }
};

export const login = async (req, res) => {
    const { email, password } = req.body;
    console.log(email);
    try {
        if (!email || !password) {
            return res.status(400).json({
                message: "Something is missing",
                success: false,
            });
        }

        let user = await userAdminModel.findOne({ email });

        if (!user) {
            return res.status(400).json({
                message: "Incorrect email",
                success: false,
            });
        }

        const isPasswordMatch = await bcrypt.compare(password, user.password);

        if (!isPasswordMatch) {
            return res.status(400).json({
                message: "Incorrect password",
                success: false,
            });
        }

        const token = jwt.sign({ id: user.id }, SECRET_KEY, { expiresIn: "1d" });

        user = {
            id: user.id,
            fullname: user.fullname,
            email: user.email,
            address: user.address,
            phoneNumber: user.phoneNumber,
            role: user.role,
        };

        return res
            .status(200)
            .cookie("token", token, {
                httpOnly: true,
                secure: false, //if run on production it should be true
                maxAge: 1 * 24 * 60 * 60 * 1000,
                sameSite: "strict",
            })
            .json({
                message: "Login successfully",
                user,
                success: true,
            });
    } catch (error) {
        console.log(error);
    }
};

export const logout = (req, res) => {
    try {
        res.status(200).cookie("token", "").json({
            message: "LogOut successfully",
            success: true,
        });
    } catch (error) {
        console.log(error);
    }
};

export const userData = async (req, res) => {
    try {
        const userId = req.id; // User ID from the token
        let userData = await userAdminModel.findById(userId);

        if (!userData) {
            return res.status(400).json({
                message: "User not found",
                success: false,
            });
        }
        if(userData.role === "admin"){
            let allUsers = await userAdminModel.find();
            
            return res.status(200).json({
                message: "All Users data fetched successfully",
                user: allUsers,
                specificAdmin: userData, 
                success: true,
            });
        }

        userData = {
            _id: userData._id,
            fullname: userData.fullname,
            email: userData.email,
            address: userData.address,
            city: userData.city,
            country: userData.country,
            phoneNumber: userData.phoneNumber,
            image: userData.image || null, 
            role: userData.role 
            // photo: userData.photo?.image || null, 
        };

        return res.status(200).json({
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


export const updateProfile = async (req, res) => {
    try {
        const userId = req.id;
        const { fullname, address, city, country, phoneNumber } = req.body;
        let user = await userAdminModel.findById(userId);

        if (!user) {
            return res.status(400).json({ message: "User not found", success: false });
        }

        if (req.file) {

            cloudinary.config({
                cloud_name: "dkw7qk3cc",
                api_key: "581825648657291",
                api_secret: "M3FA11REbXr71AT6KXisgkRMRac"
            });

            const result = await cloudinary.uploader.upload(req.file.path);
            user.image = result.secure_url;
            // publicId: result.public_id,

        }
        
        user.fullname = fullname || user.fullname;
        user.address = address || user.address;
        user.city = city || user.city;
        user.country = country || user.country;
        user.phoneNumber = phoneNumber || user.phoneNumber;

        await user.save();

        return res.status(200).json({
            message: "Profile updated successfully",
            success: true,
            user: {
                fullname: user.fullname,
                email: user.email,
                address: user.address,
                city: user.city,
                country: user.country,
                phoneNumber: user.phoneNumber,
                // photo: user.photo?.image,
                image: user.image,

            },
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Internal server error",
            success: false,
        });
    }
};

export const allUserData = async (req, res) => {
    try {
      let userData = await userAdminModel.find();
  
      if (!userData) {
        return res.status(400).json({
          message: "User not found",
          success: false,
        });
      }
  
      return res.status(200).json({
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

export const forgetPassword = async (req, res) => {
    const { email, password, confirmPassword } = req.body;
    try {
        let user = await userAdminModel.findOne({ email });
        if (!user) {
            return res.status(400).json({
                message: "Incorrect email",
                success: false,
            });
        }

        const newPassword = password === confirmPassword;
        if (!newPassword) {
            return res.status(400).json({
                message: "Password is not matching",
                success: false,
            });
        }

        user.password = await bcrypt.hash(password, 10);
        await user.save();

        res.status(200).json({
            message: "Password update successfully",
            success: true,
        });
    } catch (error) {
        console.log(error);
    }
};

export const uploadPhoto = async (req, res) => {
    const id = req.id;
    try {
        cloudinary.uploader.upload(req.file.path, function (error, result) {
            if (error) {
                console.log(error);
                return res.status(500).json({
                    success: false,
                    message: "Error",
                });
            }
            const userData = userAdminModel.findByIdAndUpdate(
                id,
                {
                    photo: {
                        image: result.secure_url,
                        publicId: result.public_id,
                    },
                },
                {
                    new: true,
                }
            );

            res.status(200).json({
                success: true,
                message: "uploaded",
                data: userPhoto,
            });
        });
    } catch (error) {
        console.log(error);
    }
};
