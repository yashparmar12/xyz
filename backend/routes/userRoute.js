import express from 'express';
import Authenticated from '../middleware/Authenticate.js';
import {login, logout, register, userData, forgetPassword, updateProfile, allUserData, uploadPhoto} from '../controller/userController.js';
import multer from 'multer'
const upload = multer({ dest: 'upload/' })

const router = express.Router();

router.route("/register").post(register);
router.route("/login").post(login);
router.route("/logout").get(logout);
router.route('/userData').get(Authenticated, userData);
router.route("/allUsers").get(allUserData);
router.route("/updateProfile").post(Authenticated, upload.single('photo'), updateProfile);
router.route('/updatePassword').post(forgetPassword);



export default router;