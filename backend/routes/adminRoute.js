import express from "express"
import { adminData, allUserData, registerAdmin, updateAdminProfile} from "../controller/adminController.js";
import Authenticate from "../middleware/Authenticate.js"
import multer from 'multer'
const upload = multer({ dest: 'upload/' })

const router = express.Router();

router.route("/register").post(registerAdmin);
router.route("/allUsers").get(allUserData);
router.route("/adminData").get(Authenticate, adminData);
router.route("/updateAdminProfile").post(Authenticate, upload.single('photo'), updateAdminProfile);




export default router;