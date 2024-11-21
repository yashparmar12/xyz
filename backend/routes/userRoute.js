import express from 'express';
import Authenticated from '../middleware/Authenticate.js';
import {login, logout, register, userData} from '../controller/userController.js';

const router = express.Router();

router.route("/register").post(register);
router.route("/login").post(login);
router.route("/logout").get(logout);
router.route('/userData').get(Authenticated, userData);


export default router;