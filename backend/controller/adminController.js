import { userAdminModel } from "../models/userAdmin.js";
import SECRET_KEY from "../jwtKey.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { v2 as cloudinary } from "cloudinary";

export const registerAdmin = async (req, res) => {
  const {fullname, email, address, phoneNumber, city, country, role, password, confirmPassword,} = req.body;
  try {
    if (!fullname || !email || !address ||
      !phoneNumber ||
      !city ||
      !country ||
      !password ||
      !role ||
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

    const userCreate = new userAdminModel({
      fullname,
      email,
      address,
      phoneNumber,
      city,
      country,
      password: hashPassword,
      role,
    });

    userCreate.save();

    res.status(201).json({
      message: "Admin Account Created Successfully",
      success: true,
      user: userCreate,
    });
  } catch (error) {
    console.log(error);
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

export const adminData = async (req, res) => {
  try {
    const userId = req.id;
    let userData = await userAdminModel.findById(userId);

    if (!userData) {
      return res.status(400).json({
        message: "User not found",
        success: false,
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
      role: userData.role,
      image: userData.image || null,
      // photo: userData.photo?.image || null,
    };

    return res.status(200).json({
      message: "Admin data fetched successfully",
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

export const updateAdminProfile = async (req, res) => {
  try {
    const userId = req.id;
    const { fullname, address, city, country, phoneNumber } = req.body;
    let user = await userAdminModel.findById(userId);

    if (!user) {
      return res
        .status(400)
        .json({ message: "User not found", success: false });
    }

    if (req.file) {
      cloudinary.config({
        cloud_name: "dkw7qk3cc",
        api_key: "581825648657291",
        api_secret: "M3FA11REbXr71AT6KXisgkRMRac",
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
      message: "Admin Profile updated successfully",
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

export const login = async (req, res) => {
  const { email, password, role } = req.body;
  try {
    if (!email || !password || !role) {
      return res.status(400).json({
        message: "Something is missing",
        success: false,
      });
    }

    const user = await userAdminModel.findOne({ email });

    if (!user) {
      return res.status(400).json({
        message: "Incorrect email",
        success: false,
      });
    }

    if (role !== user.role) {
      return res.status(400).json({
        message: "Incorrect role",
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

    const tokenUser = {
      id: user.id,
    };

    const token = jwt.sign(tokenUser, SECRET_KEY, { expiresIn: "1d" });

    const sendUser = {
      id: user.id,
      fullname: user.fullname,
      email: user.email,
      phoneNumber: user.phoneNumber,
      role: user.role,
    };

    res.status(200).cookie("token", token).json({
      message: "Login successfully",
      sendUser,
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
